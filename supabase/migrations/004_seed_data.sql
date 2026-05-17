-- =============================================================
-- HirePilot AI — Seed Data (Professions + MCQ Questions)
-- Run this in Supabase SQL Editor after 001-003
-- IMPORTANT: First delete old seed data if re-running
-- =============================================================

-- Clean up old data first (safe to re-run)
DELETE FROM public.question_options;
DELETE FROM public.questions;
DELETE FROM public.professions;

-- ---- Professions (must match src/data/professions.js slugs) ----
INSERT INTO public.professions (slug, name_en, name_th) VALUES
('software-dev', 'Software & Applications Developer', 'นักพัฒนาซอฟต์แวร์'),
('fintech', 'FinTech Engineer', 'วิศวกร FinTech'),
('devops', 'DevOps Engineer', 'วิศวกร DevOps'),
('data-analyst', 'Data Analyst', 'นักวิเคราะห์ข้อมูล'),
('security', 'Information Security Analyst', 'นักวิเคราะห์ความปลอดภัยสารสนเทศ')
ON CONFLICT (slug) DO NOTHING;

-- ============================================================
-- SOFTWARE-DEV Questions (10)
-- ============================================================
DO $$
DECLARE
  v_prof_id uuid;
  v_q_id uuid;
BEGIN
  SELECT id INTO v_prof_id FROM public.professions WHERE slug = 'software-dev';

  INSERT INTO public.questions (profession_id, type, difficulty, prompt, explanation, tags)
  VALUES (v_prof_id, 'mcq', 1, 'What does HTML stand for?', 'HTML stands for HyperText Markup Language, the standard language for creating web pages.', ARRAY['web','basics'])
  RETURNING id INTO v_q_id;
  INSERT INTO public.question_options (question_id, label, option_text, is_correct) VALUES
  (v_q_id, 'A', 'HyperText Markup Language', true),
  (v_q_id, 'B', 'High Tech Modern Language', false),
  (v_q_id, 'C', 'Home Tool Markup Language', false),
  (v_q_id, 'D', 'Hyperlink Text Management Language', false);

  INSERT INTO public.questions (profession_id, type, difficulty, prompt, explanation, tags)
  VALUES (v_prof_id, 'mcq', 1, 'Which data structure uses FIFO (First In, First Out)?', 'A queue follows FIFO ordering — the first element added is the first one removed.', ARRAY['data-structures'])
  RETURNING id INTO v_q_id;
  INSERT INTO public.question_options (question_id, label, option_text, is_correct) VALUES
  (v_q_id, 'A', 'Stack', false),
  (v_q_id, 'B', 'Queue', true),
  (v_q_id, 'C', 'Tree', false),
  (v_q_id, 'D', 'Graph', false);

  INSERT INTO public.questions (profession_id, type, difficulty, prompt, explanation, tags)
  VALUES (v_prof_id, 'mcq', 1, 'What is the time complexity of binary search?', 'Binary search divides the search interval in half each time, giving O(log n) complexity.', ARRAY['algorithms'])
  RETURNING id INTO v_q_id;
  INSERT INTO public.question_options (question_id, label, option_text, is_correct) VALUES
  (v_q_id, 'A', 'O(n)', false),
  (v_q_id, 'B', 'O(n²)', false),
  (v_q_id, 'C', 'O(log n)', true),
  (v_q_id, 'D', 'O(1)', false);

  INSERT INTO public.questions (profession_id, type, difficulty, prompt, explanation, tags)
  VALUES (v_prof_id, 'mcq', 2, 'Which HTTP method is idempotent?', 'GET, PUT, and DELETE are idempotent. POST is not because repeating it creates new resources.', ARRAY['web','http'])
  RETURNING id INTO v_q_id;
  INSERT INTO public.question_options (question_id, label, option_text, is_correct) VALUES
  (v_q_id, 'A', 'POST', false),
  (v_q_id, 'B', 'PUT', true),
  (v_q_id, 'C', 'PATCH', false),
  (v_q_id, 'D', 'CONNECT', false);

  INSERT INTO public.questions (profession_id, type, difficulty, prompt, explanation, tags)
  VALUES (v_prof_id, 'mcq', 2, 'What does REST stand for?', 'REST stands for Representational State Transfer, an architectural style for APIs.', ARRAY['web','api'])
  RETURNING id INTO v_q_id;
  INSERT INTO public.question_options (question_id, label, option_text, is_correct) VALUES
  (v_q_id, 'A', 'Representational State Transfer', true),
  (v_q_id, 'B', 'Remote Execution Service Transfer', false),
  (v_q_id, 'C', 'Relational Entity State Tracking', false),
  (v_q_id, 'D', 'Resource Enabled Server Technology', false);

  INSERT INTO public.questions (profession_id, type, difficulty, prompt, explanation, tags)
  VALUES (v_prof_id, 'mcq', 2, 'Which design pattern ensures a class has only one instance?', 'The Singleton pattern restricts a class to a single instance and provides a global access point.', ARRAY['design-patterns'])
  RETURNING id INTO v_q_id;
  INSERT INTO public.question_options (question_id, label, option_text, is_correct) VALUES
  (v_q_id, 'A', 'Factory', false),
  (v_q_id, 'B', 'Observer', false),
  (v_q_id, 'C', 'Singleton', true),
  (v_q_id, 'D', 'Adapter', false);

  INSERT INTO public.questions (profession_id, type, difficulty, prompt, explanation, tags)
  VALUES (v_prof_id, 'mcq', 2, 'What is the purpose of an index in a database?', 'Indexes speed up data retrieval by allowing the database to find rows without scanning the entire table.', ARRAY['database'])
  RETURNING id INTO v_q_id;
  INSERT INTO public.question_options (question_id, label, option_text, is_correct) VALUES
  (v_q_id, 'A', 'To enforce data integrity', false),
  (v_q_id, 'B', 'To speed up query performance', true),
  (v_q_id, 'C', 'To store backup data', false),
  (v_q_id, 'D', 'To manage user permissions', false);

  INSERT INTO public.questions (profession_id, type, difficulty, prompt, explanation, tags)
  VALUES (v_prof_id, 'mcq', 3, 'What is a closure in JavaScript?', 'A closure is a function that retains access to its outer scope variables even after the outer function has returned.', ARRAY['javascript'])
  RETURNING id INTO v_q_id;
  INSERT INTO public.question_options (question_id, label, option_text, is_correct) VALUES
  (v_q_id, 'A', 'A way to close browser tabs', false),
  (v_q_id, 'B', 'A function with access to its outer scope', true),
  (v_q_id, 'C', 'A method to end a loop', false),
  (v_q_id, 'D', 'A type of event listener', false);

  INSERT INTO public.questions (profession_id, type, difficulty, prompt, explanation, tags)
  VALUES (v_prof_id, 'mcq', 3, 'Which SOLID principle states software should be open for extension but closed for modification?', 'The Open/Closed Principle (OCP) is part of SOLID principles.', ARRAY['design-patterns','solid'])
  RETURNING id INTO v_q_id;
  INSERT INTO public.question_options (question_id, label, option_text, is_correct) VALUES
  (v_q_id, 'A', 'Single Responsibility', false),
  (v_q_id, 'B', 'Liskov Substitution', false),
  (v_q_id, 'C', 'Open/Closed Principle', true),
  (v_q_id, 'D', 'Dependency Inversion', false);

  INSERT INTO public.questions (profession_id, type, difficulty, prompt, explanation, tags)
  VALUES (v_prof_id, 'mcq', 3, 'What is the CAP theorem about?', 'CAP theorem states a distributed system can only guarantee two of three: Consistency, Availability, and Partition tolerance.', ARRAY['distributed-systems'])
  RETURNING id INTO v_q_id;
  INSERT INTO public.question_options (question_id, label, option_text, is_correct) VALUES
  (v_q_id, 'A', 'Caching, APIs, and Performance', false),
  (v_q_id, 'B', 'Consistency, Availability, Partition tolerance', true),
  (v_q_id, 'C', 'Concurrency, Atomicity, Persistence', false),
  (v_q_id, 'D', 'Compression, Authentication, Privacy', false);
END $$;

-- ============================================================
-- FINTECH Questions (10)
-- ============================================================
DO $$
DECLARE
  v_prof_id uuid;
  v_q_id uuid;
BEGIN
  SELECT id INTO v_prof_id FROM public.professions WHERE slug = 'fintech';

  INSERT INTO public.questions (profession_id, type, difficulty, prompt, explanation, tags)
  VALUES (v_prof_id, 'mcq', 1, 'What does KYC stand for in financial services?', 'KYC stands for Know Your Customer — a process to verify the identity of clients.', ARRAY['compliance','basics'])
  RETURNING id INTO v_q_id;
  INSERT INTO public.question_options (question_id, label, option_text, is_correct) VALUES
  (v_q_id, 'A', 'Keep Your Cash', false),
  (v_q_id, 'B', 'Know Your Customer', true),
  (v_q_id, 'C', 'Key Yearly Compliance', false),
  (v_q_id, 'D', 'Knowledge Yield Certificate', false);

  INSERT INTO public.questions (profession_id, type, difficulty, prompt, explanation, tags)
  VALUES (v_prof_id, 'mcq', 1, 'What is a blockchain?', 'A blockchain is a distributed, immutable ledger that records transactions across many computers.', ARRAY['blockchain','basics'])
  RETURNING id INTO v_q_id;
  INSERT INTO public.question_options (question_id, label, option_text, is_correct) VALUES
  (v_q_id, 'A', 'A type of database server', false),
  (v_q_id, 'B', 'A distributed immutable ledger', true),
  (v_q_id, 'C', 'A programming language', false),
  (v_q_id, 'D', 'A cloud service provider', false);

  INSERT INTO public.questions (profession_id, type, difficulty, prompt, explanation, tags)
  VALUES (v_prof_id, 'mcq', 1, 'What does API stand for?', 'API stands for Application Programming Interface — a set of rules for software communication.', ARRAY['api','basics'])
  RETURNING id INTO v_q_id;
  INSERT INTO public.question_options (question_id, label, option_text, is_correct) VALUES
  (v_q_id, 'A', 'Application Programming Interface', true),
  (v_q_id, 'B', 'Automated Payment Integration', false),
  (v_q_id, 'C', 'Advanced Protocol Implementation', false),
  (v_q_id, 'D', 'Application Process Instruction', false);

  INSERT INTO public.questions (profession_id, type, difficulty, prompt, explanation, tags)
  VALUES (v_prof_id, 'mcq', 2, 'What is PCI DSS?', 'PCI DSS (Payment Card Industry Data Security Standard) is a security standard for handling credit card data.', ARRAY['compliance','security'])
  RETURNING id INTO v_q_id;
  INSERT INTO public.question_options (question_id, label, option_text, is_correct) VALUES
  (v_q_id, 'A', 'A programming language for payments', false),
  (v_q_id, 'B', 'A security standard for card data', true),
  (v_q_id, 'C', 'A type of digital wallet', false),
  (v_q_id, 'D', 'A payment gateway protocol', false);

  INSERT INTO public.questions (profession_id, type, difficulty, prompt, explanation, tags)
  VALUES (v_prof_id, 'mcq', 2, 'What is Open Banking?', 'Open Banking allows third-party developers to access bank data through APIs with customer consent.', ARRAY['banking','api'])
  RETURNING id INTO v_q_id;
  INSERT INTO public.question_options (question_id, label, option_text, is_correct) VALUES
  (v_q_id, 'A', 'Banks that operate 24/7', false),
  (v_q_id, 'B', 'Third-party access to bank data via APIs', true),
  (v_q_id, 'C', 'Free banking services', false),
  (v_q_id, 'D', 'Open-source banking software', false);

  INSERT INTO public.questions (profession_id, type, difficulty, prompt, explanation, tags)
  VALUES (v_prof_id, 'mcq', 2, 'What is a smart contract?', 'A smart contract is a self-executing contract with terms directly written into code on a blockchain.', ARRAY['blockchain'])
  RETURNING id INTO v_q_id;
  INSERT INTO public.question_options (question_id, label, option_text, is_correct) VALUES
  (v_q_id, 'A', 'A digital signature for contracts', false),
  (v_q_id, 'B', 'Self-executing code on a blockchain', true),
  (v_q_id, 'C', 'An AI-powered legal document', false),
  (v_q_id, 'D', 'An encrypted PDF contract', false);

  INSERT INTO public.questions (profession_id, type, difficulty, prompt, explanation, tags)
  VALUES (v_prof_id, 'mcq', 2, 'What is tokenization in payments?', 'Tokenization replaces sensitive card data with a non-sensitive token to reduce fraud risk.', ARRAY['payments','security'])
  RETURNING id INTO v_q_id;
  INSERT INTO public.question_options (question_id, label, option_text, is_correct) VALUES
  (v_q_id, 'A', 'Converting currency to crypto', false),
  (v_q_id, 'B', 'Replacing sensitive data with tokens', true),
  (v_q_id, 'C', 'Breaking data into smaller chunks', false),
  (v_q_id, 'D', 'Encrypting transaction logs', false);

  INSERT INTO public.questions (profession_id, type, difficulty, prompt, explanation, tags)
  VALUES (v_prof_id, 'mcq', 3, 'What is AML in financial compliance?', 'AML (Anti-Money Laundering) refers to laws and procedures to prevent criminals from disguising illegally obtained funds.', ARRAY['compliance'])
  RETURNING id INTO v_q_id;
  INSERT INTO public.question_options (question_id, label, option_text, is_correct) VALUES
  (v_q_id, 'A', 'Automated Machine Learning', false),
  (v_q_id, 'B', 'Anti-Money Laundering', true),
  (v_q_id, 'C', 'Advanced Markup Language', false),
  (v_q_id, 'D', 'Asset Management Liability', false);

  INSERT INTO public.questions (profession_id, type, difficulty, prompt, explanation, tags)
  VALUES (v_prof_id, 'mcq', 3, 'What is DeFi?', 'DeFi (Decentralized Finance) uses blockchain to offer financial services without traditional intermediaries.', ARRAY['blockchain','finance'])
  RETURNING id INTO v_q_id;
  INSERT INTO public.question_options (question_id, label, option_text, is_correct) VALUES
  (v_q_id, 'A', 'Default Financial instruments', false),
  (v_q_id, 'B', 'Decentralized Finance', true),
  (v_q_id, 'C', 'Digital Fiat currency', false),
  (v_q_id, 'D', 'Defined Financial integration', false);

  INSERT INTO public.questions (profession_id, type, difficulty, prompt, explanation, tags)
  VALUES (v_prof_id, 'mcq', 3, 'What is the difference between a payment gateway and a payment processor?', 'A gateway authorizes and encrypts transactions; a processor handles the actual fund transfer between banks.', ARRAY['payments'])
  RETURNING id INTO v_q_id;
  INSERT INTO public.question_options (question_id, label, option_text, is_correct) VALUES
  (v_q_id, 'A', 'They are the same thing', false),
  (v_q_id, 'B', 'Gateway authorizes; processor transfers funds', true),
  (v_q_id, 'C', 'Gateway is for online; processor is for in-store', false),
  (v_q_id, 'D', 'Processor is for crypto; gateway is for fiat', false);
END $$;

-- ============================================================
-- DEVOPS Questions (10)
-- ============================================================
DO $$
DECLARE
  v_prof_id uuid;
  v_q_id uuid;
BEGIN
  SELECT id INTO v_prof_id FROM public.professions WHERE slug = 'devops';

  INSERT INTO public.questions (profession_id, type, difficulty, prompt, explanation, tags)
  VALUES (v_prof_id, 'mcq', 1, 'What does CI/CD stand for?', 'CI/CD stands for Continuous Integration / Continuous Delivery (or Deployment).', ARRAY['cicd','basics'])
  RETURNING id INTO v_q_id;
  INSERT INTO public.question_options (question_id, label, option_text, is_correct) VALUES
  (v_q_id, 'A', 'Code Integration / Code Deployment', false),
  (v_q_id, 'B', 'Continuous Integration / Continuous Delivery', true),
  (v_q_id, 'C', 'Central Infrastructure / Cloud Distribution', false),
  (v_q_id, 'D', 'Compiled Implementation / Configured Distribution', false);

  INSERT INTO public.questions (profession_id, type, difficulty, prompt, explanation, tags)
  VALUES (v_prof_id, 'mcq', 1, 'What is Docker?', 'Docker is a platform for containerizing applications, ensuring consistent environments across development and production.', ARRAY['containers','basics'])
  RETURNING id INTO v_q_id;
  INSERT INTO public.question_options (question_id, label, option_text, is_correct) VALUES
  (v_q_id, 'A', 'A virtual machine manager', false),
  (v_q_id, 'B', 'A container platform for apps', true),
  (v_q_id, 'C', 'A cloud provider', false),
  (v_q_id, 'D', 'A programming language', false);

  INSERT INTO public.questions (profession_id, type, difficulty, prompt, explanation, tags)
  VALUES (v_prof_id, 'mcq', 1, 'What is the purpose of version control (e.g., Git)?', 'Version control tracks changes to code over time, enabling collaboration and rollback capabilities.', ARRAY['git','basics'])
  RETURNING id INTO v_q_id;
  INSERT INTO public.question_options (question_id, label, option_text, is_correct) VALUES
  (v_q_id, 'A', 'To compile code faster', false),
  (v_q_id, 'B', 'To track code changes and enable collaboration', true),
  (v_q_id, 'C', 'To run automated tests', false),
  (v_q_id, 'D', 'To deploy to production', false);

  INSERT INTO public.questions (profession_id, type, difficulty, prompt, explanation, tags)
  VALUES (v_prof_id, 'mcq', 2, 'What is Infrastructure as Code (IaC)?', 'IaC manages infrastructure through code and automation instead of manual processes (e.g., Terraform, CloudFormation).', ARRAY['iac','automation'])
  RETURNING id INTO v_q_id;
  INSERT INTO public.question_options (question_id, label, option_text, is_correct) VALUES
  (v_q_id, 'A', 'Writing code that runs on infrastructure', false),
  (v_q_id, 'B', 'Managing infrastructure through code and automation', true),
  (v_q_id, 'C', 'Coding directly on production servers', false),
  (v_q_id, 'D', 'Using code editors in the cloud', false);

  INSERT INTO public.questions (profession_id, type, difficulty, prompt, explanation, tags)
  VALUES (v_prof_id, 'mcq', 2, 'What is Kubernetes?', 'Kubernetes is a container orchestration platform that automates deployment, scaling, and management of containerized applications.', ARRAY['containers','orchestration'])
  RETURNING id INTO v_q_id;
  INSERT INTO public.question_options (question_id, label, option_text, is_correct) VALUES
  (v_q_id, 'A', 'A programming language', false),
  (v_q_id, 'B', 'A container orchestration platform', true),
  (v_q_id, 'C', 'A database management system', false),
  (v_q_id, 'D', 'A monitoring tool', false);

  INSERT INTO public.questions (profession_id, type, difficulty, prompt, explanation, tags)
  VALUES (v_prof_id, 'mcq', 2, 'What is a load balancer?', 'A load balancer distributes incoming network traffic across multiple servers to ensure availability and performance.', ARRAY['networking'])
  RETURNING id INTO v_q_id;
  INSERT INTO public.question_options (question_id, label, option_text, is_correct) VALUES
  (v_q_id, 'A', 'A tool to compress data', false),
  (v_q_id, 'B', 'Distributes traffic across multiple servers', true),
  (v_q_id, 'C', 'A firewall for web applications', false),
  (v_q_id, 'D', 'A storage management system', false);

  INSERT INTO public.questions (profession_id, type, difficulty, prompt, explanation, tags)
  VALUES (v_prof_id, 'mcq', 2, 'What is the purpose of monitoring in DevOps?', 'Monitoring provides visibility into system health, performance, and issues to enable proactive troubleshooting.', ARRAY['monitoring'])
  RETURNING id INTO v_q_id;
  INSERT INTO public.question_options (question_id, label, option_text, is_correct) VALUES
  (v_q_id, 'A', 'To write better code', false),
  (v_q_id, 'B', 'To track system health and detect issues', true),
  (v_q_id, 'C', 'To manage user permissions', false),
  (v_q_id, 'D', 'To automate deployments', false);

  INSERT INTO public.questions (profession_id, type, difficulty, prompt, explanation, tags)
  VALUES (v_prof_id, 'mcq', 3, 'What is a Blue-Green deployment?', 'Blue-Green deployment maintains two identical environments, switching traffic from old (blue) to new (green) for zero-downtime releases.', ARRAY['deployment'])
  RETURNING id INTO v_q_id;
  INSERT INTO public.question_options (question_id, label, option_text, is_correct) VALUES
  (v_q_id, 'A', 'Deploying to two different cloud providers', false),
  (v_q_id, 'B', 'Two identical environments with traffic switching', true),
  (v_q_id, 'C', 'Color-coding deployment stages', false),
  (v_q_id, 'D', 'Testing in development before production', false);

  INSERT INTO public.questions (profession_id, type, difficulty, prompt, explanation, tags)
  VALUES (v_prof_id, 'mcq', 3, 'What is GitOps?', 'GitOps uses Git as the single source of truth for infrastructure and application deployment, with automated reconciliation.', ARRAY['git','iac'])
  RETURNING id INTO v_q_id;
  INSERT INTO public.question_options (question_id, label, option_text, is_correct) VALUES
  (v_q_id, 'A', 'Using Git for version control', false),
  (v_q_id, 'B', 'Git as single source of truth for deployment', true),
  (v_q_id, 'C', 'Operating Git servers', false),
  (v_q_id, 'D', 'A Git GUI application', false);

  INSERT INTO public.questions (profession_id, type, difficulty, prompt, explanation, tags)
  VALUES (v_prof_id, 'mcq', 3, 'What is the difference between horizontal and vertical scaling?', 'Vertical scaling adds more power to existing machines; horizontal scaling adds more machines to handle the load.', ARRAY['scaling'])
  RETURNING id INTO v_q_id;
  INSERT INTO public.question_options (question_id, label, option_text, is_correct) VALUES
  (v_q_id, 'A', 'Vertical = more machines, Horizontal = bigger machines', false),
  (v_q_id, 'B', 'Vertical = bigger machines, Horizontal = more machines', true),
  (v_q_id, 'C', 'They are the same thing', false),
  (v_q_id, 'D', 'Horizontal is only for databases', false);
END $$;

-- ============================================================
-- DATA-ANALYST Questions (10)
-- ============================================================
DO $$
DECLARE
  v_prof_id uuid;
  v_q_id uuid;
BEGIN
  SELECT id INTO v_prof_id FROM public.professions WHERE slug = 'data-analyst';

  INSERT INTO public.questions (profession_id, type, difficulty, prompt, explanation, tags)
  VALUES (v_prof_id, 'mcq', 1, 'What does SQL stand for?', 'SQL stands for Structured Query Language, used to manage relational databases.', ARRAY['sql','basics'])
  RETURNING id INTO v_q_id;
  INSERT INTO public.question_options (question_id, label, option_text, is_correct) VALUES
  (v_q_id, 'A', 'Structured Query Language', true),
  (v_q_id, 'B', 'Simple Question Language', false),
  (v_q_id, 'C', 'System Quality Logic', false),
  (v_q_id, 'D', 'Standard Query Lookup', false);

  INSERT INTO public.questions (profession_id, type, difficulty, prompt, explanation, tags)
  VALUES (v_prof_id, 'mcq', 1, 'Which chart is best for showing trends over time?', 'Line charts are best for displaying data trends over a continuous time period.', ARRAY['visualization'])
  RETURNING id INTO v_q_id;
  INSERT INTO public.question_options (question_id, label, option_text, is_correct) VALUES
  (v_q_id, 'A', 'Pie chart', false),
  (v_q_id, 'B', 'Bar chart', false),
  (v_q_id, 'C', 'Line chart', true),
  (v_q_id, 'D', 'Scatter plot', false);

  INSERT INTO public.questions (profession_id, type, difficulty, prompt, explanation, tags)
  VALUES (v_prof_id, 'mcq', 1, 'What is the median of the dataset: 3, 7, 8, 12, 14?', 'The median is the middle value when sorted. For 3,7,8,12,14 — the median is 8.', ARRAY['statistics'])
  RETURNING id INTO v_q_id;
  INSERT INTO public.question_options (question_id, label, option_text, is_correct) VALUES
  (v_q_id, 'A', '7', false),
  (v_q_id, 'B', '8', true),
  (v_q_id, 'C', '8.8', false),
  (v_q_id, 'D', '12', false);

  INSERT INTO public.questions (profession_id, type, difficulty, prompt, explanation, tags)
  VALUES (v_prof_id, 'mcq', 2, 'What is a JOIN in SQL?', 'A JOIN combines rows from two or more tables based on a related column.', ARRAY['sql'])
  RETURNING id INTO v_q_id;
  INSERT INTO public.question_options (question_id, label, option_text, is_correct) VALUES
  (v_q_id, 'A', 'A way to delete data', false),
  (v_q_id, 'B', 'Combines rows from multiple tables', true),
  (v_q_id, 'C', 'Creates a new table', false),
  (v_q_id, 'D', 'Sorts data alphabetically', false);

  INSERT INTO public.questions (profession_id, type, difficulty, prompt, explanation, tags)
  VALUES (v_prof_id, 'mcq', 2, 'Which Python library is commonly used for data manipulation?', 'Pandas is the go-to library for data manipulation and analysis in Python.', ARRAY['python','tools'])
  RETURNING id INTO v_q_id;
  INSERT INTO public.question_options (question_id, label, option_text, is_correct) VALUES
  (v_q_id, 'A', 'Django', false),
  (v_q_id, 'B', 'Flask', false),
  (v_q_id, 'C', 'Pandas', true),
  (v_q_id, 'D', 'Requests', false);

  INSERT INTO public.questions (profession_id, type, difficulty, prompt, explanation, tags)
  VALUES (v_prof_id, 'mcq', 2, 'What is a p-value in statistics?', 'A p-value measures the probability of obtaining results at least as extreme as observed, assuming the null hypothesis is true.', ARRAY['statistics'])
  RETURNING id INTO v_q_id;
  INSERT INTO public.question_options (question_id, label, option_text, is_correct) VALUES
  (v_q_id, 'A', 'The percentage of data that is accurate', false),
  (v_q_id, 'B', 'The probability under the null hypothesis', true),
  (v_q_id, 'C', 'The power of a statistical test', false),
  (v_q_id, 'D', 'The population parameter', false);

  INSERT INTO public.questions (profession_id, type, difficulty, prompt, explanation, tags)
  VALUES (v_prof_id, 'mcq', 2, 'What does ETL stand for?', 'ETL stands for Extract, Transform, Load — the process of moving data from source systems to a data warehouse.', ARRAY['data-engineering'])
  RETURNING id INTO v_q_id;
  INSERT INTO public.question_options (question_id, label, option_text, is_correct) VALUES
  (v_q_id, 'A', 'Extract, Transform, Load', true),
  (v_q_id, 'B', 'Evaluate, Test, Launch', false),
  (v_q_id, 'C', 'Export, Transfer, Link', false),
  (v_q_id, 'D', 'Encode, Translate, Log', false);

  INSERT INTO public.questions (profession_id, type, difficulty, prompt, explanation, tags)
  VALUES (v_prof_id, 'mcq', 3, 'What is the difference between correlation and causation?', 'Correlation shows a relationship between variables; causation means one directly causes the other.', ARRAY['statistics'])
  RETURNING id INTO v_q_id;
  INSERT INTO public.question_options (question_id, label, option_text, is_correct) VALUES
  (v_q_id, 'A', 'They mean the same thing', false),
  (v_q_id, 'B', 'Correlation implies a direct cause', false),
  (v_q_id, 'C', 'Correlation shows relationship, causation shows direct effect', true),
  (v_q_id, 'D', 'Causation is always stronger than correlation', false);

  INSERT INTO public.questions (profession_id, type, difficulty, prompt, explanation, tags)
  VALUES (v_prof_id, 'mcq', 3, 'What is a confusion matrix used for?', 'A confusion matrix evaluates classification model performance by showing true/false positives and negatives.', ARRAY['machine-learning'])
  RETURNING id INTO v_q_id;
  INSERT INTO public.question_options (question_id, label, option_text, is_correct) VALUES
  (v_q_id, 'A', 'To display data distributions', false),
  (v_q_id, 'B', 'To evaluate classification accuracy', true),
  (v_q_id, 'C', 'To perform clustering', false),
  (v_q_id, 'D', 'To normalize data', false);

  INSERT INTO public.questions (profession_id, type, difficulty, prompt, explanation, tags)
  VALUES (v_prof_id, 'mcq', 3, 'What is overfitting in machine learning?', 'Overfitting occurs when a model learns noise in training data and performs poorly on new data.', ARRAY['machine-learning'])
  RETURNING id INTO v_q_id;
  INSERT INTO public.question_options (question_id, label, option_text, is_correct) VALUES
  (v_q_id, 'A', 'When a model is too simple', false),
  (v_q_id, 'B', 'When a model memorizes training data', true),
  (v_q_id, 'C', 'When data is insufficient', false),
  (v_q_id, 'D', 'When features are uncorrelated', false);
END $$;

-- ============================================================
-- SECURITY Questions (10)
-- ============================================================
DO $$
DECLARE
  v_prof_id uuid;
  v_q_id uuid;
BEGIN
  SELECT id INTO v_prof_id FROM public.professions WHERE slug = 'security';

  INSERT INTO public.questions (profession_id, type, difficulty, prompt, explanation, tags)
  VALUES (v_prof_id, 'mcq', 1, 'What does CIA stand for in information security?', 'CIA stands for Confidentiality, Integrity, and Availability — the three pillars of information security.', ARRAY['fundamentals','basics'])
  RETURNING id INTO v_q_id;
  INSERT INTO public.question_options (question_id, label, option_text, is_correct) VALUES
  (v_q_id, 'A', 'Central Intelligence Agency', false),
  (v_q_id, 'B', 'Confidentiality, Integrity, Availability', true),
  (v_q_id, 'C', 'Cybersecurity Information Architecture', false),
  (v_q_id, 'D', 'Classified Information Access', false);

  INSERT INTO public.questions (profession_id, type, difficulty, prompt, explanation, tags)
  VALUES (v_prof_id, 'mcq', 1, 'What is phishing?', 'Phishing is a social engineering attack where attackers impersonate trusted entities to steal sensitive information.', ARRAY['social-engineering','basics'])
  RETURNING id INTO v_q_id;
  INSERT INTO public.question_options (question_id, label, option_text, is_correct) VALUES
  (v_q_id, 'A', 'A type of malware', false),
  (v_q_id, 'B', 'Fraudulent attempts to steal sensitive info', true),
  (v_q_id, 'C', 'A network scanning technique', false),
  (v_q_id, 'D', 'A firewall bypass method', false);

  INSERT INTO public.questions (profession_id, type, difficulty, prompt, explanation, tags)
  VALUES (v_prof_id, 'mcq', 1, 'What is a firewall?', 'A firewall monitors and controls incoming/outgoing network traffic based on security rules.', ARRAY['network','basics'])
  RETURNING id INTO v_q_id;
  INSERT INTO public.question_options (question_id, label, option_text, is_correct) VALUES
  (v_q_id, 'A', 'An antivirus program', false),
  (v_q_id, 'B', 'A network traffic filter based on rules', true),
  (v_q_id, 'C', 'A password manager', false),
  (v_q_id, 'D', 'An encryption algorithm', false);

  INSERT INTO public.questions (profession_id, type, difficulty, prompt, explanation, tags)
  VALUES (v_prof_id, 'mcq', 2, 'What is SQL injection?', 'SQL injection inserts malicious SQL code into queries through user input to manipulate databases.', ARRAY['web-security'])
  RETURNING id INTO v_q_id;
  INSERT INTO public.question_options (question_id, label, option_text, is_correct) VALUES
  (v_q_id, 'A', 'A database optimization technique', false),
  (v_q_id, 'B', 'Inserting malicious SQL via user input', true),
  (v_q_id, 'C', 'A method to speed up queries', false),
  (v_q_id, 'D', 'A backup strategy', false);

  INSERT INTO public.questions (profession_id, type, difficulty, prompt, explanation, tags)
  VALUES (v_prof_id, 'mcq', 2, 'What is multi-factor authentication (MFA)?', 'MFA requires two or more verification methods (something you know, have, or are) to access a system.', ARRAY['authentication'])
  RETURNING id INTO v_q_id;
  INSERT INTO public.question_options (question_id, label, option_text, is_correct) VALUES
  (v_q_id, 'A', 'Using multiple passwords', false),
  (v_q_id, 'B', 'Two or more verification methods', true),
  (v_q_id, 'C', 'Logging in from multiple devices', false),
  (v_q_id, 'D', 'Having multiple user accounts', false);

  INSERT INTO public.questions (profession_id, type, difficulty, prompt, explanation, tags)
  VALUES (v_prof_id, 'mcq', 2, 'What is encryption?', 'Encryption converts data into an unreadable format using algorithms, only accessible with the correct decryption key.', ARRAY['cryptography'])
  RETURNING id INTO v_q_id;
  INSERT INTO public.question_options (question_id, label, option_text, is_correct) VALUES
  (v_q_id, 'A', 'Compressing data for storage', false),
  (v_q_id, 'B', 'Converting data to unreadable format with a key', true),
  (v_q_id, 'C', 'Deleting sensitive data', false),
  (v_q_id, 'D', 'Backing up data to the cloud', false);

  INSERT INTO public.questions (profession_id, type, difficulty, prompt, explanation, tags)
  VALUES (v_prof_id, 'mcq', 2, 'What is the principle of least privilege?', 'The principle of least privilege gives users only the minimum access needed to perform their tasks.', ARRAY['access-control'])
  RETURNING id INTO v_q_id;
  INSERT INTO public.question_options (question_id, label, option_text, is_correct) VALUES
  (v_q_id, 'A', 'Everyone gets admin access', false),
  (v_q_id, 'B', 'Minimum access needed for the task', true),
  (v_q_id, 'C', 'Access is based on seniority', false),
  (v_q_id, 'D', 'No access until explicitly requested', false);

  INSERT INTO public.questions (profession_id, type, difficulty, prompt, explanation, tags)
  VALUES (v_prof_id, 'mcq', 3, 'What is a zero-day vulnerability?', 'A zero-day vulnerability is a software flaw unknown to the vendor, with no patch available, exploitable by attackers.', ARRAY['vulnerabilities'])
  RETURNING id INTO v_q_id;
  INSERT INTO public.question_options (question_id, label, option_text, is_correct) VALUES
  (v_q_id, 'A', 'A bug fixed on day zero', false),
  (v_q_id, 'B', 'An unknown flaw with no available patch', true),
  (v_q_id, 'C', 'A virus that activates immediately', false),
  (v_q_id, 'D', 'A scheduled security update', false);

  INSERT INTO public.questions (profession_id, type, difficulty, prompt, explanation, tags)
  VALUES (v_prof_id, 'mcq', 3, 'What is a SIEM system?', 'SIEM (Security Information and Event Management) collects and analyzes security data from across the organization in real-time.', ARRAY['monitoring','tools'])
  RETURNING id INTO v_q_id;
  INSERT INTO public.question_options (question_id, label, option_text, is_correct) VALUES
  (v_q_id, 'A', 'A type of firewall', false),
  (v_q_id, 'B', 'Security data collection and analysis platform', true),
  (v_q_id, 'C', 'A password management tool', false),
  (v_q_id, 'D', 'An encryption standard', false);

  INSERT INTO public.questions (profession_id, type, difficulty, prompt, explanation, tags)
  VALUES (v_prof_id, 'mcq', 3, 'What is the difference between symmetric and asymmetric encryption?', 'Symmetric uses one shared key for both encryption and decryption. Asymmetric uses a public-private key pair.', ARRAY['cryptography'])
  RETURNING id INTO v_q_id;
  INSERT INTO public.question_options (question_id, label, option_text, is_correct) VALUES
  (v_q_id, 'A', 'Symmetric is faster but less secure', false),
  (v_q_id, 'B', 'Symmetric = one key; Asymmetric = public-private key pair', true),
  (v_q_id, 'C', 'Asymmetric only works offline', false),
  (v_q_id, 'D', 'There is no difference', false);
END $$;
