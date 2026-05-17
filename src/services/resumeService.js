import * as pdfjsLib from 'pdfjs-dist';
import workerUrl from 'pdfjs-dist/build/pdf.worker.min.mjs?url';

// Set worker source — using Vite ?url import so the worker path resolves
// correctly in both dev (HMR) and production build output.
pdfjsLib.GlobalWorkerOptions.workerSrc = workerUrl;

/**
 * Extract text from a PDF file using pdf.js
 */
export async function extractTextFromPDF(file) {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

    let fullText = '';
    for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items.map(item => item.str).join(' ');
        fullText += pageText + '\n';
    }
    return fullText.trim();
}

// Common action verbs for resumes
const ACTION_VERBS = [
    'led', 'managed', 'developed', 'designed', 'implemented', 'created',
    'built', 'established', 'launched', 'improved', 'increased', 'reduced',
    'optimized', 'delivered', 'coordinated', 'supervised', 'mentored',
    'analyzed', 'resolved', 'streamlined', 'automated', 'collaborated',
    'negotiated', 'presented', 'trained', 'achieved', 'exceeded', 'spearheaded'
];

// Profession-specific keywords (imported via professions.js)
import { PROFESSION_KEYWORDS } from '../data/professions';

/**
 * Analyze resume text and return a structured score
 */
export function analyzeResume(text, professionId) {
    const lowerText = text.toLowerCase();
    const words = text.split(/\s+/).filter(Boolean);
    const wordCount = words.length;

    let score = 0;
    const strengths = [];
    const improvements = [];

    // 1. Contact Info Detection (10 pts)
    const hasEmail = /[\w.-]+@[\w.-]+\.\w+/.test(text);
    const hasPhone = /(\+?\d[\d\s\-()]{7,}\d)/.test(text);
    const hasLinkedIn = /linkedin\.com\/in\/\S+/i.test(text) || /linkedin/i.test(text);

    let contactScore = 0;
    if (hasEmail) contactScore += 4;
    if (hasPhone) contactScore += 3;
    if (hasLinkedIn) contactScore += 3;
    score += contactScore;

    if (contactScore >= 7) {
        strengths.push('Contact information is complete (email, phone, LinkedIn)');
    } else {
        const missing = [];
        if (!hasEmail) missing.push('email');
        if (!hasPhone) missing.push('phone number');
        if (!hasLinkedIn) missing.push('LinkedIn profile URL');
        improvements.push(`Add missing contact details: ${missing.join(', ')}`);
    }

    // 2. Section Detection (20 pts)
    const sections = {
        summary: /(summary|objective|profile|about\s*me)/i.test(text),
        experience: /(experience|work\s*history|employment)/i.test(text),
        education: /(education|academic|degree|university|college)/i.test(text),
        skills: /(skills|technical\s*skills|competencies|proficiencies)/i.test(text)
    };

    let sectionScore = 0;
    const foundSections = [];
    const missingSections = [];

    if (sections.summary) { sectionScore += 5; foundSections.push('Summary/Objective'); }
    else missingSections.push('Professional Summary');

    if (sections.experience) { sectionScore += 5; foundSections.push('Experience'); }
    else missingSections.push('Work Experience');

    if (sections.education) { sectionScore += 5; foundSections.push('Education'); }
    else missingSections.push('Education');

    if (sections.skills) { sectionScore += 5; foundSections.push('Skills'); }
    else missingSections.push('Skills');

    score += sectionScore;

    if (foundSections.length >= 3) {
        strengths.push(`Well-structured with clear sections: ${foundSections.join(', ')}`);
    }
    if (missingSections.length > 0) {
        improvements.push(`Add missing sections: ${missingSections.join(', ')}`);
    }

    // 3. Action Verbs & Bullet Points (20 pts)
    const foundVerbs = ACTION_VERBS.filter(verb => {
        const regex = new RegExp(`\\b${verb}\\b`, 'i');
        return regex.test(text);
    });

    const hasBulletPoints = /^[\s]*[•\-\*\u2022\u25CF]/m.test(text) || (text.match(/\n/g) || []).length > 5;

    let verbScore = Math.min(10, foundVerbs.length * 2);
    let bulletScore = hasBulletPoints ? 10 : 3;
    score += verbScore + bulletScore;

    if (foundVerbs.length >= 4) {
        strengths.push(`Strong action verbs used: ${foundVerbs.slice(0, 5).join(', ')}`);
    } else {
        improvements.push(`Use more action verbs (e.g., ${ACTION_VERBS.slice(0, 6).join(', ')}). Found only ${foundVerbs.length}.`);
    }

    if (!hasBulletPoints) {
        improvements.push('Use bullet points to list achievements and responsibilities for better readability.');
    }

    // 4. Keyword Match (25 pts)
    const keywords = PROFESSION_KEYWORDS[professionId] || [];
    const foundKeywords = keywords.filter(kw => lowerText.includes(kw.toLowerCase()));
    const missingKeywords = keywords.filter(kw => !lowerText.includes(kw.toLowerCase()));

    const keywordRatio = keywords.length > 0 ? foundKeywords.length / keywords.length : 0;
    const keywordScore = Math.round(keywordRatio * 25);
    score += keywordScore;

    if (keywordRatio >= 0.5) {
        strengths.push(`Good keyword coverage (${foundKeywords.length}/${keywords.length} profession-relevant keywords found)`);
    }
    if (missingKeywords.length > 0) {
        improvements.push(`Consider adding these profession-relevant keywords: ${missingKeywords.slice(0, 8).join(', ')}`);
    }

    // 5. Length & Formatting (15 pts)
    let lengthScore = 0;
    if (wordCount >= 200 && wordCount <= 800) {
        lengthScore = 15;
        strengths.push(`Appropriate resume length (${wordCount} words)`);
    } else if (wordCount >= 100) {
        lengthScore = 10;
        if (wordCount < 200) improvements.push(`Resume is short (${wordCount} words). Consider adding more detail.`);
        if (wordCount > 800) improvements.push(`Resume is long (${wordCount} words). Consider condensing to 1-2 pages.`);
    } else {
        lengthScore = 5;
        improvements.push(`Resume seems very short (${wordCount} words). Aim for 200-800 words.`);
    }
    score += lengthScore;

    // 6. Quantifiable Achievements (10 pts)
    const numbers = text.match(/\d+[\+%]?/g) || [];
    const hasPercentages = /%/.test(text);
    const hasDollarAmounts = /\$[\d,]+/.test(text);

    let quantScore = 0;
    if (numbers.length >= 3) quantScore += 5;
    else if (numbers.length >= 1) quantScore += 3;
    if (hasPercentages || hasDollarAmounts) quantScore += 5;
    else quantScore += numbers.length >= 5 ? 5 : 0;
    quantScore = Math.min(10, quantScore);
    score += quantScore;

    if (quantScore >= 7) {
        strengths.push('Includes quantifiable achievements with metrics');
    } else {
        improvements.push('Add quantifiable achievements (e.g., "Increased sales by 25%", "Managed team of 10").');
    }

    // Clamp score
    score = Math.max(0, Math.min(100, score));

    return {
        score,
        strengths: strengths.length > 0 ? strengths : ['Your resume addresses the key areas.'],
        improvements: improvements.length > 0 ? improvements : ['Your resume is in good shape!'],
        missingKeywords: missingKeywords.slice(0, 10),
        recommendedKeywords: keywords.slice(0, 10),
        wordCount,
        foundKeywords
    };
}
