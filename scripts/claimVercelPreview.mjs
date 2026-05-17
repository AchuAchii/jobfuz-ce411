import fs from 'fs';
import os from 'os';
import path from 'path';
import { execFile } from 'child_process';
import { promisify } from 'util';
import dotenv from 'dotenv';

const execFileAsync = promisify(execFile);
const DEPLOY_ENDPOINT = 'https://codex-deploy-skills.vercel.sh/api/deploy';
const FRAMEWORK = 'vite';

function ensurePublicEnv() {
    const envPath = path.resolve('.env');
    const parsed = fs.existsSync(envPath) ? dotenv.parse(fs.readFileSync(envPath)) : {};
    const supabaseUrl = process.env.VITE_SUPABASE_URL || parsed.VITE_SUPABASE_URL;
    const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || parsed.VITE_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
        throw new Error('Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY for preview deploy.');
    }

    return { supabaseUrl, supabaseAnonKey };
}

async function copyProject(sourceDir, targetDir) {
    await fs.promises.mkdir(targetDir, { recursive: true });
    await fs.promises.cp(sourceDir, targetDir, {
        recursive: true,
        filter: (sourcePath) => {
            const relative = path.relative(sourceDir, sourcePath);
            if (!relative) return true;

            const normalized = relative.replace(/\\/g, '/');
            if (normalized === 'node_modules' || normalized.startsWith('node_modules/')) return false;
            if (normalized === '.git' || normalized.startsWith('.git/')) return false;
            if (normalized === 'dist' || normalized.startsWith('dist/')) return false;
            if (normalized === '.env' || normalized.startsWith('.env.')) return false;

            return true;
        },
    });
}

async function createTarball(stagingDir, tarballPath) {
    await execFileAsync('tar.exe', ['-czf', tarballPath, '-C', stagingDir, '.']);
}

async function uploadTarball(tarballPath) {
    const form = new FormData();
    form.append('framework', FRAMEWORK);
    form.append('file', new Blob([await fs.promises.readFile(tarballPath)]), 'project.tgz');

    const response = await fetch(DEPLOY_ENDPOINT, {
        method: 'POST',
        body: form,
    });

    const text = await response.text();
    if (!response.ok) {
        throw new Error(`Deploy endpoint returned ${response.status}: ${text}`);
    }

    const data = JSON.parse(text);
    if (data.error) {
        throw new Error(data.error);
    }

    return data;
}

async function waitForPreview(previewUrl) {
    for (let attempt = 0; attempt < 60; attempt += 1) {
        try {
            const response = await fetch(previewUrl, { redirect: 'manual' });
            if (response.status === 200 || (response.status >= 400 && response.status < 500)) {
                return;
            }
        } catch {
            // Deployment may still be provisioning.
        }

        await new Promise((resolve) => setTimeout(resolve, 5000));
    }
}

async function main() {
    const { supabaseUrl, supabaseAnonKey } = ensurePublicEnv();
    const sourceDir = process.cwd();
    const tempDir = await fs.promises.mkdtemp(path.join(os.tmpdir(), 'jobfuz-vercel-'));
    const stagingDir = path.join(tempDir, 'staging');
    const tarballPath = path.join(tempDir, 'project.tgz');

    try {
        await copyProject(sourceDir, stagingDir);

        const envFile = [
            `VITE_SUPABASE_URL=${supabaseUrl}`,
            `VITE_SUPABASE_ANON_KEY=${supabaseAnonKey}`,
            '',
        ].join('\n');
        await fs.promises.writeFile(path.join(stagingDir, '.env.production'), envFile, 'utf8');

        await createTarball(stagingDir, tarballPath);
        const deployment = await uploadTarball(tarballPath);

        if (deployment.previewUrl) {
            await waitForPreview(deployment.previewUrl);
        }

        process.stdout.write(`${JSON.stringify(deployment)}\n`);
    } finally {
        await fs.promises.rm(tempDir, { recursive: true, force: true });
    }
}

main().catch((error) => {
    process.stderr.write(`${error.message}\n`);
    process.exit(1);
});
