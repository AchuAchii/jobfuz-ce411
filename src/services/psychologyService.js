
const QUESTIONS = [
    {
        id: 1,
        question: "How do you handle stress in high-pressure situations?",
        options: [
            { id: 'a', text: "I take deep breaths and prioritize tasks systematically", value: 100 },
            { id: 'b', text: "I work faster and multitask to get everything done", value: 80 },
            { id: 'c', text: "I ask for help from colleagues immediately", value: 85 },
            { id: 'd', text: "I step away briefly to clear my mind before continuing", value: 95 }
        ]
    },
    {
        id: 2,
        question: "What motivates you most in a professional setting?",
        options: [
            { id: 'a', text: "Recognition and career advancement opportunities", value: 85 },
            { id: 'b', text: "Solving complex problems and intellectual challenges", value: 100 },
            { id: 'c', text: "Collaborating with a supportive team environment", value: 90 },
            { id: 'd', text: "Making a meaningful impact and contributing to goals", value: 95 }
        ]
    },
    {
        id: 3,
        question: "How do you prefer to receive feedback?",
        options: [
            { id: 'a', text: "Direct and immediate, face-to-face discussions", value: 100 },
            { id: 'b', text: "Written feedback that I can review privately", value: 90 },
            { id: 'c', text: "Regular scheduled performance reviews", value: 95 },
            { id: 'd', text: "Informal check-ins and casual conversations", value: 85 }
        ]
    }
];

export const getPsychologyQuestions = () => QUESTIONS;

export const evaluatePsychology = (answers) => {
    // answers is array of selected option IDs ['a', 'b', 'c'] matching QUESTIONS indices
    let totalScore = 0;
    const results = [];

    answers.forEach((answerId, index) => {
        const question = QUESTIONS[index];
        if (!question) return;

        const selectedOption = question.options.find(opt => opt.id === answerId);
        const score = selectedOption ? selectedOption.value : 0;
        totalScore += score;

        // Feedback generation
        let feedback = "";
        let isGoodAnswer = score >= 90;

        // Simple feedback logic based on question index
        if (index === 0) { // Stress
            if (score >= 95) feedback = "Excellent! Systematic approach to stress management.";
            else feedback = "Consider developing systematic prioritization techniques.";
        } else if (index === 1) { // Motivation
            if (score >= 95) feedback = "Strong intrinsic motivation!";
            else feedback = "Good, but balancing extrinsic and intrinsic motivation is key.";
        } else if (index === 2) { // Feedback
            if (score >= 95) feedback = "Excellent! Openness to direct feedback.";
            else feedback = "Consider the value of interactive feedback for faster learning.";
        }

        results.push({
            questionIndex: index,
            question: question.question,
            userAnswer: selectedOption ? selectedOption.text : "No answer",
            score,
            feedback,
            isGoodAnswer
        });
    });

    const averageScore = Math.round(totalScore / QUESTIONS.length);

    let overallFeedback = '';
    if (averageScore >= 90) {
        overallFeedback = 'Outstanding! Your responses demonstrate strong emotional intelligence and professional maturity.';
    } else if (averageScore >= 85) {
        overallFeedback = 'Very good! You show good understanding of professional behaviors.';
    } else {
        overallFeedback = 'Good responses. Focus on developing stronger professional behaviors.';
    }

    return {
        score: averageScore,
        maxScore: 100,
        passed: averageScore >= 80,
        feedback: overallFeedback,
        results
    };
};
