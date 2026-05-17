
// Contains prompts and questions for 5 key professions

export const PROFESSIONS = [
    { id: 'software-dev', label: 'Software & Applications Developer', icon: 'Code' },
    { id: 'fintech', label: 'FinTech Engineer', icon: 'DollarSign' },
    { id: 'devops', label: 'DevOps Engineer', icon: 'Settings' },
    { id: 'data-analyst', label: 'Data Analyst', icon: 'BarChart' },
    { id: 'security', label: 'Information Security Analyst', icon: 'Shield' }
];

// Keywords used by resumeService for ATS matching
export const PROFESSION_KEYWORDS = {
    'software-dev': [
        'javascript', 'typescript', 'react', 'node.js', 'python', 'java', 'git',
        'agile', 'scrum', 'api', 'rest', 'database', 'sql', 'testing',
        'ci/cd', 'microservices', 'cloud', 'docker', 'aws', 'performance'
    ],
    'fintech': [
        'payment', 'banking', 'api', 'compliance', 'pci', 'kyc', 'aml',
        'blockchain', 'encryption', 'security', 'fintech', 'transaction',
        'regulatory', 'risk', 'audit', 'oauth', 'cloud', 'microservices',
        'scalability', 'data protection'
    ],
    'devops': [
        'kubernetes', 'docker', 'terraform', 'ci/cd', 'jenkins', 'aws', 'azure',
        'gcp', 'monitoring', 'prometheus', 'grafana', 'linux', 'ansible',
        'infrastructure', 'automation', 'pipeline', 'deployment', 'scaling',
        'load balancing', 'sla'
    ],
    'data-analyst': [
        'sql', 'python', 'r', 'tableau', 'power bi', 'excel', 'statistics',
        'visualization', 'etl', 'data warehouse', 'reporting', 'dashboard',
        'analytics', 'regression', 'machine learning', 'data quality',
        'a/b testing', 'kpi', 'data pipeline', 'dataset'
    ],
    'security': [
        'firewall', 'encryption', 'penetration testing', 'siem', 'intrusion detection',
        'vulnerability', 'compliance', 'iso 27001', 'nist', 'soc', 'incident response',
        'risk assessment', 'threat modeling', 'authentication', 'authorization',
        'vpn', 'ddos', 'owasp', 'zero trust', 'endpoint'
    ]
};

export const ESSAY_PROMPTS = {
    'software-dev': {
        prompt: "Discuss the importance of code quality and maintainability in software development. Explain how you approach writing clean, maintainable code and the impact it has on long-term project success. Consider factors such as code reviews, testing practices, and documentation.",
        minCharacters: 500
    },
    'fintech': {
        prompt: "Explain the critical importance of security and compliance in financial technology applications. Discuss how you would balance innovation with regulatory requirements, and describe best practices for protecting sensitive financial data in modern FinTech systems.",
        minCharacters: 500
    },
    'devops': {
        prompt: "Describe the role of automation and Infrastructure as Code (IaC) in modern software delivery. Explain how CI/CD pipelines improve development workflows and discuss the challenges and benefits of implementing DevOps practices in an organization.",
        minCharacters: 500
    },
    'data-analyst': {
        prompt: "Discuss the importance of data quality and accuracy in data analysis. Explain how you would ensure data integrity throughout the analysis process, from data collection to presenting insights. Consider the impact of poor data quality on business decisions.",
        minCharacters: 500
    },
    'security': {
        prompt: "Explain the concept of defense in depth in cybersecurity. Discuss multiple layers of security controls and how they work together to protect organizational assets. Consider both technical and human factors in building a comprehensive security strategy.",
        minCharacters: 500
    }
};

// Renamed from PSYCHOLOGY_QUESTIONS
export const WORKSTYLE_QUESTIONS = {
    'software-dev': [
        {
            question: "How do you approach debugging a complex bug that's affecting production?",
            options: [
                "I systematically trace through logs and use debugging tools to isolate the issue",
                "I immediately start changing code to try different solutions",
                "I ask the team for help right away",
                "I document the issue and escalate to senior developers"
            ]
        },
        {
            question: "What motivates you most in software development?",
            options: [
                "Learning new technologies and frameworks",
                "Solving complex technical challenges",
                "Delivering features that users love",
                "Building scalable and efficient systems"
            ]
        },
        {
            question: "How do you handle conflicting requirements from different stakeholders?",
            options: [
                "I analyze the requirements and propose a balanced solution",
                "I prioritize based on who has more authority",
                "I ask stakeholders to resolve conflicts before I start",
                "I implement what seems most technically sound"
            ]
        }
    ],
    'fintech': [
        {
            question: "How do you handle the pressure of working with financial systems where errors can have serious consequences?",
            options: [
                "I follow strict testing and validation processes to ensure accuracy",
                "I work faster to meet deadlines",
                "I rely on automated systems to catch errors",
                "I double-check everything manually before deployment"
            ]
        },
        {
            question: "What's most important when building financial software?",
            options: [
                "Security and compliance with regulations",
                "User experience and modern design",
                "Fast development and quick releases",
                "Innovative features and cutting-edge technology"
            ]
        },
        {
            question: "How do you approach implementing new features in a regulated financial environment?",
            options: [
                "I ensure compliance requirements are met first, then implement features",
                "I implement features quickly and add compliance later",
                "I avoid new features to minimize risk",
                "I focus on user experience and worry about compliance separately"
            ]
        }
    ],
    'devops': [
        {
            question: "How do you handle a production incident that's affecting multiple services?",
            options: [
                "I systematically investigate logs and metrics to identify root cause",
                "I immediately restart services to restore functionality",
                "I escalate to the development team right away",
                "I document the incident and wait for instructions"
            ]
        },
        {
            question: "What's most important in a DevOps role?",
            options: [
                "Automation and reducing manual work",
                "Fast deployment and frequent releases",
                "System stability and reliability",
                "Learning new tools and technologies"
            ]
        },
        {
            question: "How do you balance speed of deployment with system stability?",
            options: [
                "I implement comprehensive testing and monitoring to enable safe rapid deployments",
                "I prioritize speed and fix issues as they arise",
                "I prioritize stability and deploy less frequently",
                "I let the development team decide deployment frequency"
            ]
        }
    ],
    'data-analyst': [
        {
            question: "How do you handle conflicting data from different sources?",
            options: [
                "I investigate data quality, identify discrepancies, and reconcile differences",
                "I use the most recent data source",
                "I average the conflicting values",
                "I ask stakeholders which source to trust"
            ]
        },
        {
            question: "What's most important in data analysis?",
            options: [
                "Data accuracy and quality",
                "Speed of analysis and quick insights",
                "Beautiful visualizations and presentations",
                "Using the latest analytical tools"
            ]
        },
        {
            question: "How do you communicate findings when data contradicts stakeholder expectations?",
            options: [
                "I present the data objectively with clear methodology and offer to investigate further",
                "I adjust the analysis to match expectations",
                "I present only data that supports stakeholder views",
                "I avoid presenting contradictory findings"
            ]
        }
    ],
    'security': [
        {
            question: "How do you handle discovering a security vulnerability in a critical system?",
            options: [
                "I immediately document the vulnerability, assess risk, and follow incident response procedures",
                "I fix it immediately without documentation",
                "I report it and wait for approval before taking action",
                "I keep it confidential to avoid causing alarm"
            ]
        },
        {
            question: "What's most important in information security?",
            options: [
                "Preventing security breaches and protecting assets",
                "Implementing the latest security technologies",
                "Minimizing security controls to improve user experience",
                "Compliance with security standards and regulations"
            ]
        },
        {
            question: "How do you balance security requirements with business needs?",
            options: [
                "I work with stakeholders to find secure solutions that enable business objectives",
                "I prioritize security over all business needs",
                "I prioritize business needs and add security later",
                "I let business stakeholders make security decisions"
            ]
        }
    ]
};

export const INTERVIEW_PROMPTS = {
    'software-dev': {
        initialMessage: "Hello! I'm your AI interviewer. I'll ask you questions about your software development experience, technical skills, and approach to building applications. Let's get started!",
        questions: [
            "Can you tell me about a challenging technical problem you've solved recently?",
            "How do you stay updated with the latest technologies and best practices in software development?",
            "Describe your experience with code reviews and collaboration in a development team.",
            "What's your approach to testing and ensuring code quality?",
            "How do you handle technical debt in a project?"
        ]
    },
    'fintech': {
        initialMessage: "Hello! I'm your AI interviewer. I'll ask you about your experience with financial technology, security practices, and how you approach building secure financial systems. Let's begin!",
        questions: [
            "Can you describe your experience working with financial systems and compliance requirements?",
            "How do you ensure security and accuracy when handling financial transactions?",
            "What's your approach to balancing innovation with regulatory compliance in FinTech?",
            "Describe a time when you had to implement security measures in a financial application.",
            "How do you stay informed about financial regulations and security standards?"
        ]
    },
    'devops': {
        initialMessage: "Hello! I'm your AI interviewer. I'll ask you about your DevOps experience, automation practices, and how you manage infrastructure and deployments. Let's start!",
        questions: [
            "Can you describe your experience with CI/CD pipelines and automation?",
            "How do you handle infrastructure scaling and monitoring in production?",
            "What's your approach to incident response and system reliability?",
            "Describe your experience with containerization and orchestration tools.",
            "How do you balance deployment speed with system stability?"
        ]
    },
    'data-analyst': {
        initialMessage: "Hello! I'm your AI interviewer. I'll ask you about your data analysis experience, analytical skills, and how you derive insights from data. Let's get started!",
        questions: [
            "Can you describe a data analysis project where you found meaningful insights?",
            "How do you ensure data quality and accuracy in your analysis?",
            "What's your approach to communicating data findings to non-technical stakeholders?",
            "Describe your experience with data visualization and reporting tools.",
            "How do you handle missing or incomplete data in your analysis?"
        ]
    },
    'security': {
        initialMessage: "Hello! I'm your AI interviewer. I'll ask you about your cybersecurity experience, threat analysis, and how you protect organizational assets. Let's begin!",
        questions: [
            "Can you describe your experience with security incident response and threat detection?",
            "How do you stay updated with the latest security threats and vulnerabilities?",
            "What's your approach to implementing security controls without hindering business operations?",
            "Describe a security assessment or penetration testing experience you've had.",
            "How do you balance security requirements with user experience and business needs?"
        ]
    }
};
