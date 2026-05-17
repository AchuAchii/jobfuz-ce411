const GENERIC_QUESTIONS = [
    {
        id: 1,
        question: "How do you handle stress in high-pressure situations?",
        options: [
            { id: 'a', text: "I take deep breaths and prioritize tasks systematically", traits: ['organized', 'calm'] },
            { id: 'b', text: "I work faster and multitask to get everything done", traits: ['driven', 'action-oriented'] },
            { id: 'c', text: "I ask for help from colleagues immediately", traits: ['collaborative', 'communicative'] },
            { id: 'd', text: "I step away briefly to clear my mind before continuing", traits: ['self-aware', 'reflective'] }
        ]
    },
    {
        id: 2,
        question: "What motivates you most in a professional setting?",
        options: [
            { id: 'a', text: "Recognition and career advancement opportunities", traits: ['ambitious', 'goal-oriented'] },
            { id: 'b', text: "Solving complex problems and intellectual challenges", traits: ['analytical', 'curious'] },
            { id: 'c', text: "Collaborating with a supportive team environment", traits: ['collaborative', 'team-player'] },
            { id: 'd', text: "Making a meaningful impact and contributing to goals", traits: ['purpose-driven', 'impactful'] }
        ]
    },
    {
        id: 3,
        question: "How do you prefer to receive feedback?",
        options: [
            { id: 'a', text: "Direct and immediate, face-to-face discussions", traits: ['direct', 'open'] },
            { id: 'b', text: "Written feedback that I can review privately", traits: ['reflective', 'independent'] },
            { id: 'c', text: "Regular scheduled performance reviews", traits: ['structured', 'process-oriented'] },
            { id: 'd', text: "Informal check-ins and casual conversations", traits: ['adaptable', 'relationship-oriented'] }
        ]
    }
];

export const DISCLAIMER = "This questionnaire explores your professional tendencies and work preferences. It is not a clinical, psychological, or diagnostic assessment. Results are suggestive, not definitive.";

export const getWorkStyleQuestions = () => GENERIC_QUESTIONS;

export const evaluateWorkStyle = (answers) => {
    const questions = GENERIC_QUESTIONS;
    const traitCounts = {};
    const results = [];

    answers.forEach((answerId, index) => {
        const question = questions[index];
        if (!question) return;

        const selectedOption = question.options.find(opt => opt.id === answerId);
        if (selectedOption) {
            selectedOption.traits.forEach(trait => {
                traitCounts[trait] = (traitCounts[trait] || 0) + 1;
            });
        }

        // Generate tendency-based feedback (not diagnostic)
        let feedback = "";
        if (index === 0) {
            if (['a', 'd'].includes(answerId)) feedback = "You tend to approach stress with a measured, thoughtful response.";
            else if (answerId === 'b') feedback = "You tend to respond to pressure by increasing your output.";
            else feedback = "You tend to leverage your team when facing challenges.";
        } else if (index === 1) {
            if (['b'].includes(answerId)) feedback = "You tend to be energized by intellectual challenges and problem-solving.";
            else if (answerId === 'c') feedback = "You tend to thrive in collaborative environments.";
            else if (answerId === 'd') feedback = "You tend to be driven by purpose and meaningful impact.";
            else feedback = "You tend to be motivated by recognition and growth opportunities.";
        } else if (index === 2) {
            if (['a'].includes(answerId)) feedback = "You tend to prefer direct and transparent communication.";
            else if (answerId === 'b') feedback = "You tend to value time for reflection and independent processing.";
            else if (answerId === 'c') feedback = "You tend to appreciate structured feedback processes.";
            else feedback = "You tend to prefer informal and relationship-based communication.";
        }

        results.push({
            questionIndex: index,
            question: question.question,
            userAnswer: selectedOption ? selectedOption.text : "No answer",
            feedback,
            traits: selectedOption ? selectedOption.traits : []
        });
    });

    // Determine dominant traits
    const sortedTraits = Object.entries(traitCounts)
        .sort((a, b) => b[1] - a[1])
        .map(([trait]) => trait);

    const dominantTraits = sortedTraits.slice(0, 4);

    // Generate tendency-based overall feedback (NOT diagnostic)
    let summary = '';
    if (dominantTraits.includes('collaborative') || dominantTraits.includes('team-player')) {
        summary = 'You tend to thrive in collaborative settings and value teamwork. ';
    }
    if (dominantTraits.includes('analytical') || dominantTraits.includes('curious')) {
        summary += 'You tend to enjoy problem-solving and analytical challenges. ';
    }
    if (dominantTraits.includes('organized') || dominantTraits.includes('structured')) {
        summary += 'You tend to prefer structured approaches and clear processes. ';
    }
    if (dominantTraits.includes('driven') || dominantTraits.includes('ambitious')) {
        summary += 'You tend to be goal-oriented and driven by achievement. ';
    }
    if (dominantTraits.includes('reflective') || dominantTraits.includes('self-aware')) {
        summary += 'You tend to be thoughtful and self-aware in your approach. ';
    }

    if (!summary) {
        summary = 'You show a balanced mix of professional tendencies across different work dimensions.';
    }

    return {
        summary: summary.trim(),
        dominantTraits,
        results,
        disclaimer: DISCLAIMER
    };
};
