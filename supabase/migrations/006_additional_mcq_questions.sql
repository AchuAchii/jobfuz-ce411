-- =============================================================
-- HirePilot AI - Additional MCQ bank for repeat usage
-- =============================================================

create or replace function public.seed_mcq_question(
    p_profession_slug text,
    p_difficulty int,
    p_prompt text,
    p_explanation text,
    p_tags text[],
    p_correct_label text,
    p_option_a text,
    p_option_b text,
    p_option_c text,
    p_option_d text
)
returns void
language plpgsql
as $$
declare
    v_profession_id uuid;
    v_question_id uuid;
begin
    select id into v_profession_id
    from public.professions
    where slug = p_profession_slug;

    if v_profession_id is null then
        raise exception 'Profession not found: %', p_profession_slug;
    end if;

    select id into v_question_id
    from public.questions
    where profession_id = v_profession_id
      and prompt = p_prompt
    limit 1;

    if v_question_id is not null then
        return;
    end if;

    insert into public.questions (profession_id, type, difficulty, prompt, explanation, tags)
    values (v_profession_id, 'mcq', p_difficulty, p_prompt, p_explanation, p_tags)
    returning id into v_question_id;

    insert into public.question_options (question_id, label, option_text, is_correct) values
    (v_question_id, 'A', p_option_a, p_correct_label = 'A'),
    (v_question_id, 'B', p_option_b, p_correct_label = 'B'),
    (v_question_id, 'C', p_option_c, p_correct_label = 'C'),
    (v_question_id, 'D', p_option_d, p_correct_label = 'D');
end;
$$;

-- software-dev
select public.seed_mcq_question('software-dev', 1, 'In Flexbox, what does justify-content control?', 'justify-content aligns flex items along the main axis.', ARRAY['css', 'layout'], 'B', 'Text color', 'Alignment along the main axis', 'Font size', 'Grid column count');
select public.seed_mcq_question('software-dev', 1, 'Which HTTP status code means a new resource was created successfully?', '201 Created is commonly returned after successful resource creation.', ARRAY['http', 'api'], 'C', '200', '202', '201', '204');
select public.seed_mcq_question('software-dev', 1, 'Which Git command shows commit history?', 'git log displays commit history for a repository.', ARRAY['git', 'basics'], 'A', 'git log', 'git clone', 'git stash', 'git clean');
select public.seed_mcq_question('software-dev', 2, 'Which SQL clause filters aggregated groups after GROUP BY?', 'HAVING filters grouped results after aggregation.', ARRAY['sql', 'database'], 'D', 'WHERE', 'ORDER BY', 'LIMIT', 'HAVING');
select public.seed_mcq_question('software-dev', 2, 'What is the main purpose of unit testing?', 'Unit tests verify small pieces of logic in isolation.', ARRAY['testing', 'quality'], 'B', 'To replace production monitoring', 'To test small pieces of code in isolation', 'To deploy code automatically', 'To document API endpoints');
select public.seed_mcq_question('software-dev', 2, 'What problem does memoization help solve?', 'Memoization stores previous results to avoid repeated expensive calculations.', ARRAY['algorithms', 'performance'], 'A', 'Repeated expensive computation', 'Network encryption', 'Database normalization', 'UI rendering order');
select public.seed_mcq_question('software-dev', 2, 'Which format is most commonly used for REST API request and response bodies?', 'JSON is the most common payload format for REST APIs.', ARRAY['api', 'web'], 'C', 'XML Schema', 'CSV', 'JSON', 'Markdown');
select public.seed_mcq_question('software-dev', 3, 'What is dependency injection?', 'Dependency injection supplies required dependencies from the outside rather than creating them inside the class.', ARRAY['architecture', 'design-patterns'], 'D', 'Encrypting environment variables', 'Bundling frontend assets', 'Caching database queries', 'Providing dependencies from the outside');
select public.seed_mcq_question('software-dev', 3, 'Which JavaScript array method returns a new array by transforming each element?', 'Array.map transforms each element and returns a new array.', ARRAY['javascript', 'arrays'], 'B', 'forEach', 'map', 'find', 'some');
select public.seed_mcq_question('software-dev', 3, 'What does ACID describe in databases?', 'ACID describes core properties of reliable transactions.', ARRAY['database', 'transactions'], 'A', 'Reliable transaction properties', 'Frontend accessibility rules', 'HTTP caching behavior', 'Container orchestration states');

-- fintech
select public.seed_mcq_question('fintech', 1, 'What is reconciliation in financial operations?', 'Reconciliation compares internal transaction records against external records such as bank statements.', ARRAY['operations', 'payments'], 'B', 'Predicting stock prices with AI', 'Matching internal records with external statements', 'Encrypting customer passwords', 'Reducing loan interest rates');
select public.seed_mcq_question('fintech', 1, 'What does ISO 20022 define?', 'ISO 20022 is a global standard for electronic financial messaging.', ARRAY['standards', 'banking'], 'C', 'A cryptocurrency wallet format', 'A card network fee model', 'A financial messaging standard', 'A cloud security framework');
select public.seed_mcq_question('fintech', 1, 'What is a chargeback?', 'A chargeback reverses a card transaction after a dispute or fraud claim.', ARRAY['cards', 'risk'], 'D', 'A loyalty points refund', 'A same-day bank transfer', 'A merchant onboarding review', 'A reversed card payment after a dispute');
select public.seed_mcq_question('fintech', 2, 'What is settlement in a payment system?', 'Settlement is the final transfer of funds between participating parties.', ARRAY['payments', 'banking'], 'A', 'The final movement of funds', 'The first fraud screening step', 'The creation of a virtual card', 'The process of generating an invoice');
select public.seed_mcq_question('fintech', 2, 'What is a stablecoin?', 'A stablecoin is designed to maintain a steady value by being pegged to a stable reference asset.', ARRAY['crypto', 'digital-assets'], 'B', 'A coin mined only once', 'A crypto asset pegged to a stable reference value', 'A stock exchange fee token', 'A type of payment terminal');
select public.seed_mcq_question('fintech', 2, 'Why do fintech companies run sanctions screening?', 'Sanctions screening helps block transactions involving prohibited individuals or entities.', ARRAY['compliance', 'risk'], 'C', 'To calculate exchange rates', 'To shorten onboarding forms', 'To detect prohibited parties and transactions', 'To compress transaction logs');
select public.seed_mcq_question('fintech', 2, 'What is the role of an acquiring bank?', 'The acquiring bank processes card payments on behalf of the merchant.', ARRAY['cards', 'payments'], 'D', 'It issues a card to the customer', 'It verifies passport documents', 'It creates new bank accounts', 'It processes merchant card transactions');
select public.seed_mcq_question('fintech', 3, 'What is liquidity in a market?', 'Liquidity refers to how easily an asset can be bought or sold without causing a large price change.', ARRAY['markets', 'finance'], 'A', 'How easily an asset can be traded', 'The legal limit on card spending', 'The number of APIs in a banking app', 'The speed of account verification');
select public.seed_mcq_question('fintech', 3, 'What is the purpose of a payment token?', 'A payment token replaces sensitive card details with a safer surrogate value.', ARRAY['payments', 'security'], 'B', 'To increase card interest rates', 'To represent sensitive payment data safely', 'To guarantee a loan approval', 'To calculate tax automatically');
select public.seed_mcq_question('fintech', 3, 'What does an AML alert usually indicate?', 'An AML alert flags activity that may require investigation for potential money laundering risk.', ARRAY['aml', 'monitoring'], 'C', 'A customer changed their password', 'A card chip stopped working', 'A transaction pattern may require compliance review', 'An account earned loyalty rewards');

-- devops
select public.seed_mcq_question('devops', 1, 'What is the main benefit of a rolling deployment?', 'Rolling deployments update instances gradually to reduce downtime and risk.', ARRAY['deployment', 'release'], 'A', 'Gradual updates with lower downtime risk', 'Full downtime during every release', 'Manual server configuration', 'Automatic schema rollback only');
select public.seed_mcq_question('devops', 1, 'What does immutable infrastructure mean?', 'Immutable infrastructure means servers are replaced with new versions rather than modified in place.', ARRAY['infrastructure', 'operations'], 'C', 'Every server must stay online forever', 'Only one server can be changed at a time', 'Infrastructure is replaced instead of modified in place', 'Developers cannot access logs');
select public.seed_mcq_question('devops', 1, 'Why are health checks important in distributed systems?', 'Health checks allow systems to detect unhealthy instances and route traffic away from them.', ARRAY['reliability', 'operations'], 'D', 'They increase CPU usage for testing', 'They replace logging systems', 'They create backups automatically', 'They help detect unhealthy instances');
select public.seed_mcq_question('devops', 2, 'What is autoscaling?', 'Autoscaling adjusts compute capacity automatically based on demand.', ARRAY['cloud', 'scaling'], 'B', 'Compressing logs at night', 'Automatically changing capacity based on load', 'Converting VMs into containers', 'Encrypting infrastructure secrets');
select public.seed_mcq_question('devops', 2, 'What does observability commonly include?', 'Observability is commonly built from metrics, logs, and traces.', ARRAY['monitoring', 'observability'], 'C', 'Only dashboards', 'Only uptime checks', 'Metrics, logs, and traces', 'Only CPU alerts');
select public.seed_mcq_question('devops', 2, 'What is the role of a reverse proxy?', 'A reverse proxy sits in front of backend services and forwards client requests to them.', ARRAY['networking', 'web'], 'A', 'It forwards client requests to backend services', 'It stores Git history', 'It validates Terraform syntax', 'It replaces DNS records');
select public.seed_mcq_question('devops', 2, 'Why is secret management important?', 'Secret management keeps credentials secure and reduces the risk of exposing them in code or logs.', ARRAY['security', 'operations'], 'D', 'It makes builds run in parallel', 'It removes the need for MFA', 'It replaces all environment variables', 'It protects credentials and access tokens');
select public.seed_mcq_question('devops', 3, 'What is a canary deployment?', 'A canary deployment releases a new version to a small subset of users before wider rollout.', ARRAY['deployment', 'release'], 'B', 'Deploying to two clouds at the same time', 'Releasing to a small audience first', 'Scaling only read replicas', 'Deploying only during business hours');
select public.seed_mcq_question('devops', 3, 'What does idempotent infrastructure automation mean?', 'Idempotent automation can run multiple times and still leave the system in the same desired state.', ARRAY['iac', 'automation'], 'C', 'It always requires a new server', 'It can only run once', 'Repeated runs keep the same desired result', 'It only works in production');
select public.seed_mcq_question('devops', 3, 'Why are runbooks useful during incidents?', 'Runbooks provide standard response steps so teams can react consistently under pressure.', ARRAY['incident-response', 'operations'], 'A', 'They document reliable response steps', 'They replace alerting systems', 'They eliminate the need for backups', 'They disable failing services automatically');

-- data-analyst
select public.seed_mcq_question('data-analyst', 1, 'What does GROUP BY do in SQL?', 'GROUP BY groups rows so aggregate calculations can be performed per group.', ARRAY['sql', 'aggregation'], 'B', 'Sorts values alphabetically', 'Groups rows for aggregation', 'Deletes duplicate records', 'Creates an index automatically');
select public.seed_mcq_question('data-analyst', 1, 'Which chart type is usually best for comparing categories?', 'Bar charts are well suited for comparing values across categories.', ARRAY['visualization', 'charts'], 'A', 'Bar chart', 'Line chart', 'Histogram', 'Area chart');
select public.seed_mcq_question('data-analyst', 1, 'What does a primary key do in a relational table?', 'A primary key uniquely identifies each row in a table.', ARRAY['sql', 'database'], 'D', 'Sorts rows by importance', 'Stores only numeric values', 'Connects to cloud storage', 'Uniquely identifies each row');
select public.seed_mcq_question('data-analyst', 2, 'What does an INNER JOIN return?', 'An INNER JOIN returns only rows that match in both joined tables.', ARRAY['sql', 'joins'], 'C', 'All rows from the left table only', 'All rows from both tables regardless of match', 'Only rows that match in both tables', 'Only duplicated rows');
select public.seed_mcq_question('data-analyst', 2, 'What is the purpose of data cleaning?', 'Data cleaning fixes missing, invalid, or inconsistent records before analysis.', ARRAY['data-quality', 'preprocessing'], 'B', 'To build dashboards faster', 'To correct missing or inconsistent data', 'To replace SQL joins', 'To generate labels automatically');
select public.seed_mcq_question('data-analyst', 2, 'What does standard deviation measure?', 'Standard deviation measures how spread out data points are around the mean.', ARRAY['statistics', 'basics'], 'A', 'How spread out values are around the mean', 'The number of missing values', 'The strongest correlation in a dataset', 'The size of the sample only');
select public.seed_mcq_question('data-analyst', 2, 'What is a KPI?', 'A KPI is a measurable indicator used to track business or process performance.', ARRAY['business', 'reporting'], 'D', 'A database backup format', 'A type of SQL function', 'A machine learning algorithm', 'A measurable performance indicator');
select public.seed_mcq_question('data-analyst', 3, 'What is an A/B test?', 'An A/B test compares two variants to measure which performs better.', ARRAY['experimentation', 'product-analytics'], 'C', 'A way to encrypt user data', 'A chart with two axes', 'An experiment comparing two variants', 'A backup process for reports');
select public.seed_mcq_question('data-analyst', 3, 'When data has strong outliers, which measure is often more robust than the mean?', 'The median is often more robust than the mean when outliers are present.', ARRAY['statistics', 'outliers'], 'B', 'Variance', 'Median', 'Range', 'Mode count');
select public.seed_mcq_question('data-analyst', 3, 'What is the main purpose of a dashboard filter?', 'Dashboard filters let users narrow the data view to relevant segments or time periods.', ARRAY['dashboards', 'ux'], 'A', 'To narrow the data shown', 'To replace ETL jobs', 'To delete irrelevant records', 'To generate sample data');

-- security
select public.seed_mcq_question('security', 1, 'What is hashing primarily used for?', 'Hashing creates a fixed output that is useful for integrity checks and password storage workflows.', ARRAY['cryptography', 'basics'], 'C', 'Reversible encryption of files', 'Hiding server IP addresses', 'Generating fixed digests for integrity or password workflows', 'Compressing security logs');
select public.seed_mcq_question('security', 1, 'What does a VPN do?', 'A VPN encrypts traffic between the user and the VPN endpoint over untrusted networks.', ARRAY['network', 'privacy'], 'B', 'Scans endpoints for malware', 'Encrypts traffic over untrusted networks', 'Blocks every phishing email', 'Removes the need for MFA');
select public.seed_mcq_question('security', 1, 'What is a brute-force attack?', 'A brute-force attack repeatedly tries many passwords or keys until one works.', ARRAY['authentication', 'attacks'], 'D', 'A network cable failure', 'A vulnerability scanner update', 'A backup verification task', 'Repeatedly trying many password guesses');
select public.seed_mcq_question('security', 2, 'Why is patch management important?', 'Patch management closes known vulnerabilities and reduces exposure to published exploits.', ARRAY['vulnerability-management', 'operations'], 'A', 'It reduces risk from known vulnerabilities', 'It removes the need for monitoring', 'It replaces incident response', 'It blocks all insider threats');
select public.seed_mcq_question('security', 2, 'What is cross-site scripting (XSS)?', 'XSS injects malicious scripts into pages viewed by other users.', ARRAY['web-security', 'attacks'], 'C', 'A SQL backup strategy', 'A network segmentation rule', 'An attack that injects malicious scripts into web pages', 'A password hashing algorithm');
select public.seed_mcq_question('security', 2, 'What does IDS stand for?', 'IDS stands for Intrusion Detection System.', ARRAY['monitoring', 'tools'], 'B', 'Identity Defense Service', 'Intrusion Detection System', 'Internet Data Shield', 'Internal Directory Service');
select public.seed_mcq_question('security', 2, 'What is the purpose of security logging?', 'Security logs provide records that support detection, investigation, and auditing.', ARRAY['logging', 'monitoring'], 'D', 'To make passwords longer', 'To increase network speed', 'To replace access controls', 'To support detection and investigation');
select public.seed_mcq_question('security', 3, 'What is a SOC in cybersecurity?', 'A SOC is a Security Operations Center that monitors and responds to security events.', ARRAY['operations', 'teams'], 'A', 'Security Operations Center', 'System of Compliance', 'Standard Operations Control', 'Secure Online Certificate');
select public.seed_mcq_question('security', 3, 'Which backup approach is strongest against ransomware recovery risk?', 'Offline or immutable backups reduce the chance that ransomware can encrypt backup copies.', ARRAY['resilience', 'backups'], 'C', 'Backups stored on the same server', 'Only browser-based exports', 'Offline or immutable backups', 'No backups, only snapshots');
select public.seed_mcq_question('security', 3, 'What is separation of duties?', 'Separation of duties splits sensitive tasks across different people to reduce abuse and error risk.', ARRAY['governance', 'access-control'], 'B', 'Giving all admins the same permissions', 'Splitting critical tasks among different people', 'Disabling privileged accounts weekly', 'Moving logs into a separate database');

drop function if exists public.seed_mcq_question(text, int, text, text, text[], text, text, text, text, text);
