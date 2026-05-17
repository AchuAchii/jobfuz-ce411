import { MCQ_QUESTIONS } from '../data/mcqQuestions';

/**
 * Fisher-Yates shuffle
 */
function shuffle(array) {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

/**
 * Get random questions for a profession
 */
export function getRandomQuestions(professionId, count = 10) {
    const pool = MCQ_QUESTIONS[professionId] || MCQ_QUESTIONS['software-dev'];
    const shuffled = shuffle(pool);
    return shuffled.slice(0, Math.min(count, shuffled.length));
}

/**
 * Grade a completed quiz
 * @param {Array} questions - array of question objects
 * @param {Array} answers - array of selected option indices (or null if unanswered)
 * @returns {Object} { score, total, percentage, passed, review }
 */
export function gradeQuiz(questions, answers) {
    let correct = 0;
    const review = questions.map((q, i) => {
        const userAnswer = answers[i];
        const isCorrect = userAnswer === q.correctIndex;
        if (isCorrect) correct++;
        return {
            question: q.question,
            options: q.options,
            correctIndex: q.correctIndex,
            userAnswer,
            isCorrect,
            explanation: q.explanation
        };
    });

    const total = questions.length;
    const percentage = Math.round((correct / total) * 100);

    return {
        score: correct,
        total,
        percentage,
        passed: percentage >= 70,
        review
    };
}
