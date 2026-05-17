/**
 * Seed script — populates the Supabase database with professions and MCQ questions.
 *
 * Usage:
 *   1. Copy .env.example to .env and fill in VITE_SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY
 *   2. Run:  node scripts/seedQuestions.js
 */

import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';
config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
    console.error('Missing VITE_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false }
});

// ─── Professions ───────────────────────────────────────────
const PROFESSIONS = [
    { slug: 'software-dev', name_en: 'Software & Applications Developer', name_th: 'นักพัฒนาซอฟต์แวร์และแอปพลิเคชัน' },
    { slug: 'fintech', name_en: 'FinTech Engineer', name_th: 'วิศวกร FinTech' },
    { slug: 'devops', name_en: 'DevOps Engineer', name_th: 'วิศวกร DevOps' },
    { slug: 'data-analyst', name_en: 'Data Analyst', name_th: 'นักวิเคราะห์ข้อมูล' },
    { slug: 'security', name_en: 'Information Security Analyst', name_th: 'นักวิเคราะห์ความปลอดภัยสารสนเทศ' },
];

// ─── Questions (same content as current mcqQuestions.js) ────
const QUESTIONS = {
    'software-dev': [
        { prompt: "What is the time complexity of binary search?", options: [["A", "O(n)", false], ["B", "O(log n)", true], ["C", "O(n²)", false], ["D", "O(1)", false]], explanation: "Binary search halves the search space each step, giving O(log n) time complexity." },
        { prompt: "Which principle states a class should have only one reason to change?", options: [["A", "Open/Closed", false], ["B", "Liskov Substitution", false], ["C", "Single Responsibility", true], ["D", "Dependency Inversion", false]], explanation: "The Single Responsibility Principle (SRP) says each class should have one reason to change." },
        { prompt: "What does REST stand for?", options: [["A", "Remote Execution State Transfer", false], ["B", "Representational State Transfer", true], ["C", "Reliable Endpoint Service Technology", false], ["D", "Request-Event Structured Transport", false]], explanation: "REST = Representational State Transfer, an architectural style for APIs." },
        { prompt: "Which data structure uses LIFO ordering?", options: [["A", "Queue", false], ["B", "Stack", true], ["C", "Linked List", false], ["D", "Tree", false]], explanation: "A Stack uses Last-In, First-Out (LIFO). Queues use FIFO." },
        { prompt: "What is the purpose of a foreign key in a database?", options: [["A", "Index optimization", false], ["B", "Uniquely identify a row", false], ["C", "Establish a relation between two tables", true], ["D", "Encrypt column data", false]], explanation: "A foreign key creates a link between two tables, enforcing referential integrity." },
        { prompt: "Which HTTP method is idempotent?", options: [["A", "POST", false], ["B", "PUT", true], ["C", "PATCH", false], ["D", "None of the above", false]], explanation: "PUT is idempotent — calling it multiple times with the same data produces the same result." },
        { prompt: "What does CI/CD stand for?", options: [["A", "Code Integration / Code Delivery", false], ["B", "Continuous Integration / Continuous Deployment", true], ["C", "Central Implementation / Central Development", false], ["D", "Compiled Integration / Compiled Delivery", false]], explanation: "CI/CD = Continuous Integration and Continuous Deployment/Delivery." },
        { prompt: "What pattern does React use for data flow?", options: [["A", "Two-way binding", false], ["B", "Unidirectional data flow", true], ["C", "Event-driven", false], ["D", "Observer pattern", false]], explanation: "React uses unidirectional (one-way) data flow: parent → child via props." },
        { prompt: "Which of these is NOT a JavaScript primitive type?", options: [["A", "string", false], ["B", "boolean", false], ["C", "array", true], ["D", "symbol", false]], explanation: "Arrays are objects in JavaScript, not primitives." },
        { prompt: "What is the purpose of version control?", options: [["A", "Improve application performance", false], ["B", "Track changes and enable collaboration", true], ["C", "Compile code faster", false], ["D", "Manage database schemas", false]], explanation: "Version control (e.g., Git) tracks code changes over time and enables team collaboration." },
        { prompt: "What is a closure in JavaScript?", options: [["A", "A way to close browser tabs", false], ["B", "A function with access to its outer scope's variables", true], ["C", "A design pattern for error handling", false], ["D", "A method to terminate async operations", false]], explanation: "A closure is a function that retains access to variables from its enclosing scope." },
        { prompt: "Which sorting algorithm has the best average time complexity?", options: [["A", "Bubble Sort — O(n²)", false], ["B", "Merge Sort — O(n log n)", true], ["C", "Selection Sort — O(n²)", false], ["D", "Insertion Sort — O(n²)", false]], explanation: "Merge Sort has O(n log n) average and worst-case time complexity." },
        { prompt: "What does the 'DRY' principle stand for?", options: [["A", "Don't Repeat Yourself", true], ["B", "Do Repeat Yourself", false], ["C", "Develop Reliably Yearly", false], ["D", "Debug, Refactor, Yield", false]], explanation: "DRY = Don't Repeat Yourself. Avoid code duplication." },
        { prompt: "What is the difference between == and === in JavaScript?", options: [["A", "No difference", false], ["B", "=== checks type and value; == only checks value", true], ["C", "== is faster", false], ["D", "=== is deprecated", false]], explanation: "=== (strict equality) checks both type and value without coercion." },
        { prompt: "What is a SQL injection?", options: [["A", "A database optimization technique", false], ["B", "A security vulnerability where malicious SQL is injected via input", true], ["C", "A way to inject data into NoSQL databases", false], ["D", "A query caching strategy", false]], explanation: "SQL injection is a critical security vulnerability." },
        { prompt: "Which design pattern provides a global access point to an instance?", options: [["A", "Factory", false], ["B", "Observer", false], ["C", "Singleton", true], ["D", "Strategy", false]], explanation: "Singleton ensures only one instance of a class exists." },
        { prompt: "What does API stand for?", options: [["A", "Application Protocol Interface", false], ["B", "Application Programming Interface", true], ["C", "Automated Processing Integration", false], ["D", "Advanced Protocol Implementation", false]], explanation: "API = Application Programming Interface." },
        { prompt: "What is the purpose of unit testing?", options: [["A", "Test the entire application end-to-end", false], ["B", "Test individual components or functions in isolation", true], ["C", "Test database performance", false], ["D", "Test user interface design", false]], explanation: "Unit tests verify individual functions work correctly in isolation." },
        { prompt: "Which Git command creates a new branch?", options: [["A", "git merge", false], ["B", "git branch", true], ["C", "git clone", false], ["D", "git push", false]], explanation: "'git branch <name>' creates a new branch." },
        { prompt: "What is polymorphism in OOP?", options: [["A", "Hiding implementation details", false], ["B", "Objects of different types responding to the same interface", true], ["C", "Inheriting properties from a parent class", false], ["D", "Encapsulating data and methods", false]], explanation: "Polymorphism allows different object types to be treated uniformly." },
    ],
    'fintech': [
        { prompt: "What does AML stand for in financial compliance?", options: [["A", "Automated Machine Learning", false], ["B", "Anti-Money Laundering", true], ["C", "Asset Management Liability", false], ["D", "Advanced Market Liquidity", false]], explanation: "AML = Anti-Money Laundering." },
        { prompt: "What is PCI DSS?", options: [["A", "Payment Card Industry Data Security Standard", true], ["B", "Personal Credit Information Data System", false], ["C", "Protected Consumer Interface Data Standard", false], ["D", "Payment Compliance Infrastructure Document", false]], explanation: "PCI DSS is a security standard for organizations that handle credit card information." },
        { prompt: "What does KYC mean?", options: [["A", "Know Your Customer", true], ["B", "Key Yield Component", false], ["C", "Knowledge Year Check", false], ["D", "Keynote Yield Contract", false]], explanation: "KYC = Know Your Customer." },
        { prompt: "Which protocol is commonly used for bank API integrations?", options: [["A", "FTP", false], ["B", "REST/HTTPS", true], ["C", "Telnet", false], ["D", "SMTP", false]], explanation: "Modern banking APIs primarily use REST over HTTPS." },
        { prompt: "What is a blockchain best described as?", options: [["A", "A centralized database", false], ["B", "A distributed, immutable ledger", true], ["C", "A type of encryption algorithm", false], ["D", "A payment processing network", false]], explanation: "Blockchain is a distributed and immutable ledger." },
        { prompt: "What is idempotency important for in payment systems?", options: [["A", "Faster processing", false], ["B", "Preventing duplicate charges", true], ["C", "Better UI experience", false], ["D", "Lower storage costs", false]], explanation: "Idempotency ensures retrying a payment doesn't result in duplicate charges." },
        { prompt: "What does SWIFT stand for?", options: [["A", "Secure Worldwide Interbank Financial Telecommunication", false], ["B", "Society for Worldwide Interbank Financial Telecommunication", true], ["C", "System for Worldwide Internet Financial Transfer", false], ["D", "Secure Web Interbank Fund Technology", false]], explanation: "SWIFT provides a standard messaging network for international transactions." },
        { prompt: "What is a fintech sandbox?", options: [["A", "A children's play area", false], ["B", "A controlled environment to test new financial products with fewer regulations", true], ["C", "A backup server for financial data", false], ["D", "An encryption protocol", false]], explanation: "Regulatory sandboxes allow fintech companies to test innovations." },
        { prompt: "What encryption standard is typically required for financial data?", options: [["A", "MD5", false], ["B", "AES-256", true], ["C", "Base64", false], ["D", "ROT13", false]], explanation: "AES-256 is industry standard for encrypting sensitive financial data." },
        { prompt: "What is two-factor authentication (2FA)?", options: [["A", "Using two passwords", false], ["B", "Verifying identity with two different types of credentials", true], ["C", "Logging in from two devices", false], ["D", "Having two user accounts", false]], explanation: "2FA combines two different authentication factors." },
        { prompt: "What is the main purpose of a payment gateway?", options: [["A", "Store customer data", false], ["B", "Route transaction data between merchants and banks", true], ["C", "Create invoices", false], ["D", "Manage employee payroll", false]], explanation: "Payment gateways securely transmit transaction data." },
        { prompt: "What is SOX compliance?", options: [["A", "A server operating system", false], ["B", "Sarbanes-Oxley Act for corporate financial reporting", true], ["C", "Software optimization standard", false], ["D", "Service-oriented XML protocol", false]], explanation: "SOX mandates strict financial reporting standards." },
        { prompt: "What is tokenization in payments?", options: [["A", "Using cryptocurrency tokens", false], ["B", "Replacing sensitive data with non-sensitive placeholders", true], ["C", "Splitting code into tokens for parsing", false], ["D", "Creating loyalty program tokens", false]], explanation: "Tokenization replaces sensitive card numbers with tokens." },
        { prompt: "Which database property is most critical for financial transactions?", options: [["A", "Availability", false], ["B", "Consistency (ACID)", true], ["C", "Partition tolerance", false], ["D", "Scalability", false]], explanation: "ACID consistency ensures reliable financial transactions." },
        { prompt: "What is a chargeback?", options: [["A", "A fee for using a credit card", false], ["B", "A transaction reversal demanded by the cardholder's bank", true], ["C", "A type of interest charge", false], ["D", "A deposit refund", false]], explanation: "A chargeback is a forced reversal of a payment." },
        { prompt: "What is Open Banking?", options: [["A", "Free banking services", false], ["B", "Sharing bank data via APIs with customer consent", true], ["C", "Open-source banking software", false], ["D", "Banks with no physical branches", false]], explanation: "Open Banking allows third-party apps to access bank data via APIs." },
        { prompt: "What does GDPR require regarding financial data?", options: [["A", "Data must be stored in the EU only", false], ["B", "Users must consent to data processing and can request deletion", true], ["C", "All data must be encrypted with quantum computing", false], ["D", "Financial data is exempt from GDPR", false]], explanation: "GDPR requires informed consent and right to erasure." },
        { prompt: "What is a digital wallet?", options: [["A", "A physical wallet with digital features", false], ["B", "Software that stores payment credentials for electronic transactions", true], ["C", "A cryptocurrency mining tool", false], ["D", "A bank account type", false]], explanation: "Digital wallets securely store payment info for cashless transactions." },
        { prompt: "What is the purpose of a reconciliation process?", options: [["A", "To attract new customers", false], ["B", "To verify that two sets of records match", true], ["C", "To process new transactions", false], ["D", "To upgrade banking software", false]], explanation: "Reconciliation ensures records match to detect errors." },
        { prompt: "What is microservices architecture in fintech?", options: [["A", "Using very small servers", false], ["B", "Breaking applications into independent, deployable services", true], ["C", "Minimizing code size", false], ["D", "Using micro-transactions", false]], explanation: "Microservices breaks applications into small independent services." },
    ],
    'devops': [
        { prompt: "What is Infrastructure as Code (IaC)?", options: [["A", "Writing code on physical servers", false], ["B", "Managing infrastructure through code and automation", true], ["C", "Coding inside infrastructure teams", false], ["D", "A programming language for networking", false]], explanation: "IaC manages infrastructure through configuration files." },
        { prompt: "What does a load balancer do?", options: [["A", "Increases server CPU speed", false], ["B", "Distributes incoming traffic across multiple servers", true], ["C", "Balances team workload", false], ["D", "Compresses network data", false]], explanation: "Load balancers distribute traffic to prevent overload." },
        { prompt: "Which tool is commonly used for container orchestration?", options: [["A", "Jenkins", false], ["B", "Kubernetes", true], ["C", "Ansible", false], ["D", "Nagios", false]], explanation: "Kubernetes automates containerized application management." },
        { prompt: "What is the purpose of a Docker container?", options: [["A", "Virtual machine replacement", false], ["B", "Package an application with its dependencies for consistent deployment", true], ["C", "Only for database hosting", false], ["D", "A security firewall tool", false]], explanation: "Docker containers package code + dependencies for consistency." },
        { prompt: "What is a CI pipeline?", options: [["A", "A physical pipe for cables", false], ["B", "An automated process that builds, tests, and validates code changes", true], ["C", "A customer interface pipeline", false], ["D", "A code inspection protocol", false]], explanation: "CI pipelines automatically build and test code on every commit." },
        { prompt: "What does 'blue-green deployment' mean?", options: [["A", "Deploying with different color themes", false], ["B", "Running two identical environments and switching traffic between them", true], ["C", "Using green energy for servers", false], ["D", "A testing methodology", false]], explanation: "Blue-green deployment runs two environments; traffic switches after validation." },
        { prompt: "What is the purpose of monitoring and alerting?", options: [["A", "Track employee activity", false], ["B", "Detect system issues and notify teams before users are affected", true], ["C", "Monitor internet speed", false], ["D", "Count daily deployments", false]], explanation: "Monitoring tools track system health and alert of anomalies." },
        { prompt: "What is a reverse proxy?", options: [["A", "A proxy that works in reverse", false], ["B", "A server that forwards client requests to backend servers", true], ["C", "A debugging tool", false], ["D", "A type of VPN", false]], explanation: "A reverse proxy sits between clients and servers." },
        { prompt: "What does SLA stand for?", options: [["A", "Service Level Agreement", true], ["B", "Software License Architecture", false], ["C", "System Load Assessment", false], ["D", "Secure Login Access", false]], explanation: "SLA = Service Level Agreement." },
        { prompt: "What is GitOps?", options: [["A", "Using Git for version control", false], ["B", "Using Git as the single source of truth for infrastructure and deployments", true], ["C", "A Git plugin for DevOps", false], ["D", "A Git hosting service", false]], explanation: "GitOps uses Git repos as source of truth for infrastructure." },
        { prompt: "What is a canary deployment?", options: [["A", "Deploying to a small subset of users first", true], ["B", "Deploying yellow-themed applications", false], ["C", "A deployment that sings when done", false], ["D", "Emergency deployment procedure", false]], explanation: "Canary deployments release to a small subset first." },
        { prompt: "What does MTTR stand for?", options: [["A", "Mean Time To Recovery", true], ["B", "Maximum Time To Response", false], ["C", "Minimum Technical Threshold Requirement", false], ["D", "Main Testing Target Result", false]], explanation: "MTTR = Mean Time To Recovery." },
        { prompt: "What is Terraform used for?", options: [["A", "Writing application code", false], ["B", "Infrastructure provisioning and management", true], ["C", "Monitoring application performance", false], ["D", "Managing team tasks", false]], explanation: "Terraform is an IaC tool for cloud infrastructure." },
        { prompt: "What is a service mesh?", options: [["A", "A physical network mesh", false], ["B", "Infrastructure layer for managing service-to-service communication", true], ["C", "A web development framework", false], ["D", "A deployment strategy", false]], explanation: "Service mesh manages microservice communication." },
        { prompt: "What is the 'shift-left' approach in DevOps?", options: [["A", "Moving servers to the left rack", false], ["B", "Integrating testing and security earlier in the development lifecycle", true], ["C", "Shifting work between teams", false], ["D", "Deploying to left region first", false]], explanation: "Shift-left moves testing/security earlier in development." },
        { prompt: "What is a rolling update?", options: [["A", "Updating documentation in rotating schedule", false], ["B", "Gradually replacing instances with new versions", true], ["C", "Rolling back after an error", false], ["D", "A type of database migration", false]], explanation: "Rolling updates gradually replace old instances." },
        { prompt: "What is the purpose of a secret manager?", options: [["A", "Managing employee secrets", false], ["B", "Securely storing and accessing credentials and API keys", true], ["C", "Encrypting source code", false], ["D", "A password manager for users", false]], explanation: "Secret managers securely store API keys and credentials." },
        { prompt: "What is observability?", options: [["A", "The ability to observe team members working", false], ["B", "The ability to understand system state from its external outputs", true], ["C", "A code review process", false], ["D", "Application logging only", false]], explanation: "Observability combines logs, metrics, and traces." },
        { prompt: "What is horizontal scaling?", options: [["A", "Making servers wider", false], ["B", "Adding more instances to handle increased load", true], ["C", "Increasing a single server's resources", false], ["D", "Scaling the UI horizontally", false]], explanation: "Horizontal scaling adds more instances/machines." },
        { prompt: "What is configuration drift?", options: [["A", "A type of version control", false], ["B", "When infrastructure deviates from its intended configuration over time", true], ["C", "A database optimization technique", false], ["D", "Moving configuration files between servers", false]], explanation: "Configuration drift occurs when live infrastructure diverges from its defined state." },
    ],
    'data-analyst': [
        { prompt: "What is the difference between structured and unstructured data?", options: [["A", "Structured is larger", false], ["B", "Structured follows a predefined schema; unstructured does not", true], ["C", "Unstructured is always text-based", false], ["D", "No difference", false]], explanation: "Structured data has a defined schema; unstructured does not." },
        { prompt: "What does ETL stand for?", options: [["A", "Extract, Transform, Load", true], ["B", "Evaluate, Test, Launch", false], ["C", "Encode, Transfer, Log", false], ["D", "Export, Translate, Link", false]], explanation: "ETL = Extract, Transform, Load." },
        { prompt: "What is a data warehouse?", options: [["A", "A physical storage room", false], ["B", "A centralized repository for integrated data from multiple sources", true], ["C", "A type of database index", false], ["D", "A backup storage system", false]], explanation: "Data warehouses store integrated data for analytical queries." },
        { prompt: "What is the purpose of data normalization?", options: [["A", "Making data look normal", false], ["B", "Reducing data redundancy and improving data integrity", true], ["C", "Increasing database size", false], ["D", "Converting all data to text", false]], explanation: "Normalization reduces redundancy and ensures consistency." },
        { prompt: "What is a pivot table?", options: [["A", "A table that rotates", false], ["B", "A data summarization tool that reorganizes and aggregates data", true], ["C", "A type of database join", false], ["D", "A chart type", false]], explanation: "Pivot tables summarize and aggregate data for quick analysis." },
        { prompt: "What is regression analysis used for?", options: [["A", "Finding bugs in code", false], ["B", "Understanding the relationship between variables and predicting outcomes", true], ["C", "Reverting data to previous versions", false], ["D", "Compressing data files", false]], explanation: "Regression models relationships between variables for prediction." },
        { prompt: "What is the difference between correlation and causation?", options: [["A", "They are the same", false], ["B", "Correlation shows a relationship; causation proves one causes the other", true], ["C", "Causation is weaker", false], ["D", "Correlation is only for numeric data", false]], explanation: "Correlation indicates association; causation means direct cause." },
        { prompt: "What does SQL GROUP BY do?", options: [["A", "Groups tables together", false], ["B", "Groups rows sharing a value to apply aggregate functions", true], ["C", "Orders results by group", false], ["D", "Creates new database groups", false]], explanation: "GROUP BY groups rows for aggregate functions like SUM, COUNT." },
        { prompt: "What is a data lake?", options: [["A", "A lake of printed data", false], ["B", "A storage repository that holds raw data in its native format", true], ["C", "A cleaned dataset", false], ["D", "A visualization type", false]], explanation: "Data lakes store raw data in native format." },
        { prompt: "What is statistical significance?", options: [["A", "How important statistics are", false], ["B", "The probability that results are not due to random chance", true], ["C", "The size of a dataset", false], ["D", "Number of variables", false]], explanation: "Statistical significance indicates results unlikely by chance." },
        { prompt: "What is A/B testing?", options: [["A", "Testing version A then B", false], ["B", "Comparing two versions to determine which performs better", true], ["C", "A type of unit test", false], ["D", "Alphabetical testing", false]], explanation: "A/B testing compares two variants to see which performs better." },
        { prompt: "What is data cleaning?", options: [["A", "Physically cleaning devices", false], ["B", "Identifying and correcting errors and inconsistencies in data", true], ["C", "Deleting old data", false], ["D", "Formatting data for printing", false]], explanation: "Data cleaning fixes errors and removes duplicates." },
        { prompt: "What chart is best for showing trends over time?", options: [["A", "Pie chart", false], ["B", "Line chart", true], ["C", "Bar chart", false], ["D", "Scatter plot", false]], explanation: "Line charts show trends over time." },
        { prompt: "What is a JOIN in SQL?", options: [["A", "Merging two databases", false], ["B", "Combining rows from two or more tables based on a related column", true], ["C", "Adding a column", false], ["D", "Connecting to a database", false]], explanation: "JOIN combines rows from multiple tables." },
        { prompt: "What is the purpose of a dashboard?", options: [["A", "A physical car dashboard", false], ["B", "A visual display of key metrics for quick decision-making", true], ["C", "A data storage tool", false], ["D", "An access control panel", false]], explanation: "Dashboards provide visual summaries of key metrics." },
        { prompt: "What is sampling bias?", options: [["A", "A better sampling technique", false], ["B", "When a sample does not accurately represent the population", true], ["C", "Sampling more than needed", false], ["D", "Bias in equipment", false]], explanation: "Sampling bias skews results when certain members are over-represented." },
        { prompt: "What does KPI stand for?", options: [["A", "Key Performance Indicator", true], ["B", "Knowledge Processing Interface", false], ["C", "Key Program Integration", false], ["D", "Kernel Processing Input", false]], explanation: "KPI = Key Performance Indicator." },
        { prompt: "What is the purpose of data visualization?", options: [["A", "Making data look pretty", false], ["B", "Presenting data in graphical format to reveal patterns and insights", true], ["C", "Storing data in visual format", false], ["D", "Converting images to data", false]], explanation: "Data visualization reveals patterns and supports decisions." },
        { prompt: "What is a data pipeline?", options: [["A", "A physical pipe", false], ["B", "An automated series of processes that move and transform data", true], ["C", "A database connection", false], ["D", "A backup system", false]], explanation: "Data pipelines automate data flow from source to destination." },
        { prompt: "What is the median?", options: [["A", "The average of all values", false], ["B", "The middle value when data is sorted", true], ["C", "The most frequent value", false], ["D", "The difference between max and min", false]], explanation: "The median is the middle value in a sorted dataset." },
    ],
    'security': [
        { prompt: "What is the CIA triad in cybersecurity?", options: [["A", "Central Intelligence Agency", false], ["B", "Confidentiality, Integrity, Availability", true], ["C", "Control, Identification, Authentication", false], ["D", "Cipher, Inspection, Access", false]], explanation: "The CIA triad is the foundational model for information security." },
        { prompt: "What is a zero-day vulnerability?", options: [["A", "A vulnerability that existed for zero days", false], ["B", "A previously unknown vulnerability with no available patch", true], ["C", "A vulnerability fixable in zero days", false], ["D", "A vulnerability with zero impact", false]], explanation: "Zero-day vulnerabilities are unknown with no patch available." },
        { prompt: "What is the principle of least privilege?", options: [["A", "Giving everyone the same access", false], ["B", "Granting users only the minimum access needed", true], ["C", "Removing all privileges", false], ["D", "Giving max privileges to admins only", false]], explanation: "Least privilege limits access to only what's necessary." },
        { prompt: "What is a man-in-the-middle (MITM) attack?", options: [["A", "A physical attack on servers", false], ["B", "An attacker secretly intercepts and relays communication", true], ["C", "A type of DDoS attack", false], ["D", "A social engineering technique", false]], explanation: "MITM attacks intercept communications between two parties." },
        { prompt: "What is the purpose of a firewall?", options: [["A", "Cool down servers", false], ["B", "Monitor and control network traffic based on rules", true], ["C", "Encrypt all traffic", false], ["D", "Speed up connections", false]], explanation: "Firewalls filter traffic based on security rules." },
        { prompt: "What is phishing?", options: [["A", "A fishing sport", false], ["B", "Fraudulent attempts to obtain sensitive information by disguising as a trusted entity", true], ["C", "A network scanning technique", false], ["D", "A type of encryption", false]], explanation: "Phishing uses deceptive emails/websites to steal credentials." },
        { prompt: "What is multi-factor authentication?", options: [["A", "Using multiple passwords", false], ["B", "Requiring two or more verification methods from different categories", true], ["C", "Having multiple accounts", false], ["D", "Authenticating from multiple devices", false]], explanation: "MFA requires 2+ factors from different categories." },
        { prompt: "What is a DDoS attack?", options: [["A", "Direct Denial of Service", false], ["B", "Distributed Denial of Service — overwhelming a system with traffic", true], ["C", "Dynamic Database Operating System", false], ["D", "Decentralized Data Overflow System", false]], explanation: "DDoS overwhelms a target with traffic from many sources." },
        { prompt: "What is penetration testing?", options: [["A", "Testing data penetration speed", false], ["B", "Simulating cyberattacks to identify vulnerabilities", true], ["C", "Testing physical security", false], ["D", "A type of load testing", false]], explanation: "Pen testing simulates attacks to find vulnerabilities." },
        { prompt: "What is the OWASP Top 10?", options: [["A", "Top 10 programming languages", false], ["B", "A list of the 10 most critical web application security risks", true], ["C", "Top 10 antivirus software", false], ["D", "Top 10 cybersecurity companies", false]], explanation: "OWASP Top 10 identifies critical web security risks." },
        { prompt: "What is encryption at rest?", options: [["A", "Encrypting data when not in use", false], ["B", "Protecting stored data through encryption", true], ["C", "Pausing encryption", false], ["D", "Encrypting during nighttime only", false]], explanation: "Encryption at rest protects stored data." },
        { prompt: "What is a SIEM system?", options: [["A", "Security Information and Event Management", true], ["B", "Secure Internet Endpoint Monitor", false], ["C", "System Integration and Error Management", false], ["D", "Server Infrastructure Monitor", false]], explanation: "SIEM aggregates security logs to detect threats." },
        { prompt: "What is social engineering?", options: [["A", "Software engineering", false], ["B", "Manipulating people into divulging confidential information", true], ["C", "Engineering social media", false], ["D", "Database management", false]], explanation: "Social engineering exploits human psychology." },
        { prompt: "What is a VPN used for?", options: [["A", "Increasing internet speed", false], ["B", "Creating a secure, encrypted connection over a public network", true], ["C", "Blocking all internet access", false], ["D", "Managing virtual machines", false]], explanation: "VPNs encrypt traffic and create secure tunnels." },
        { prompt: "What is the purpose of an IDS?", options: [["A", "Internet Data Service", false], ["B", "Intrusion Detection System — monitoring for suspicious activity", true], ["C", "Internal Database System", false], ["D", "Integrated Deployment Service", false]], explanation: "IDS monitors network traffic for suspicious patterns." },
        { prompt: "What is XSS?", options: [["A", "Extra Secure Server", false], ["B", "Cross-Site Scripting — injecting malicious scripts into web pages", true], ["C", "eXtended Security System", false], ["D", "Cross-Server Synchronization", false]], explanation: "XSS attacks inject malicious scripts into web pages." },
        { prompt: "What is a security audit?", options: [["A", "Auditing IT spending", false], ["B", "A systematic evaluation of an organization's security posture", true], ["C", "A type of pen test only", false], ["D", "Annual hardware inspection", false]], explanation: "Security audits evaluate policies, procedures, and controls." },
        { prompt: "What does HTTPS provide over HTTP?", options: [["A", "Faster page loading", false], ["B", "Encrypted communication using SSL/TLS", true], ["C", "Better SEO only", false], ["D", "Unlimited bandwidth", false]], explanation: "HTTPS encrypts data using SSL/TLS." },
        { prompt: "What is a honeypot in cybersecurity?", options: [["A", "A pot of honey for snacks", false], ["B", "A decoy system designed to attract and study attackers", true], ["C", "A type of encryption key", false], ["D", "A firewall configuration", false]], explanation: "Honeypots are decoy systems to lure attackers." },
        { prompt: "What is ransomware?", options: [["A", "Software for random numbers", false], ["B", "Malware that encrypts files and demands payment for decryption", true], ["C", "A legitimate backup software", false], ["D", "A type of antivirus", false]], explanation: "Ransomware encrypts files and demands payment." },
    ],
};

async function seed() {
    console.log('🌱 Seeding professions...');

    for (const prof of PROFESSIONS) {
        const { data: existing } = await supabase
            .from('professions')
            .select('id')
            .eq('slug', prof.slug)
            .single();

        let professionId;

        if (existing) {
            professionId = existing.id;
            console.log(`  ✓ ${prof.slug} already exists (${professionId})`);
        } else {
            const { data, error } = await supabase
                .from('professions')
                .insert(prof)
                .select('id')
                .single();
            if (error) { console.error(`  ✗ Error inserting ${prof.slug}:`, error.message); continue; }
            professionId = data.id;
            console.log(`  + ${prof.slug} inserted (${professionId})`);
        }

        // Seed questions for this profession
        const questions = QUESTIONS[prof.slug] || [];
        console.log(`  📝 Seeding ${questions.length} questions for ${prof.slug}...`);

        for (const q of questions) {
            // Check if question already exists by prompt
            const { data: existingQ } = await supabase
                .from('questions')
                .select('id')
                .eq('profession_id', professionId)
                .eq('prompt', q.prompt)
                .single();

            if (existingQ) {
                continue; // Skip duplicate
            }

            const { data: insertedQ, error: qErr } = await supabase
                .from('questions')
                .insert({
                    profession_id: professionId,
                    type: 'mcq',
                    difficulty: 1,
                    prompt: q.prompt,
                    explanation: q.explanation,
                })
                .select('id')
                .single();

            if (qErr) { console.error(`    ✗ Error inserting question:`, qErr.message); continue; }

            // Insert options
            const optionRows = q.options.map(([label, text, correct]) => ({
                question_id: insertedQ.id,
                label,
                option_text: text,
                is_correct: correct,
            }));

            const { error: oErr } = await supabase
                .from('question_options')
                .insert(optionRows);

            if (oErr) { console.error(`    ✗ Error inserting options:`, oErr.message); }
        }
        console.log(`  ✓ Done with ${prof.slug}`);
    }

    console.log('\n✅ Seeding complete!');
}

seed().catch(console.error);
