
export const evaluateEssay = (essay, prompt = "") => {
    const text = essay.trim();
    const charCount = text.length;
    const wordCount = text.split(/\s+/).filter(Boolean).length;
    const sentences = (text.match(/[.!?]+/g) || []);
    const sentenceCount = sentences.length;
    const paragraphs = text.split(/\n\s*\n/).filter(p => p.trim().length > 0);

    let score = 0;
    const strengths = [];
    const improvements = [];

    // 1. Length assessment (20 pts)
    if (charCount >= 500) {
        score += 15;
    } else {
        score += Math.round((charCount / 500) * 15);
        improvements.push(`Essay is short at ${charCount} characters. Aim for at least 500 characters.`);
    }

    if (wordCount >= 300) {
        score += 5;
        strengths.push(`Solid word count (${wordCount} words)`);
    } else if (wordCount >= 150) {
        score += 3;
        improvements.push(`Word count is ${wordCount}. Target 300-600 words for a complete essay.`);
    } else {
        improvements.push(`Word count is only ${wordCount}. Expand significantly — aim for 300-600 words.`);
    }

    // 2. Structure: intro/body/conclusion detection (20 pts)
    const hasIntroMarkers = /(in this essay|this essay|i will discuss|the purpose|introduction|to begin)/i.test(text);
    const hasConclusionMarkers = /(in conclusion|to conclude|to summarize|in summary|overall|therefore|finally|as a result)/i.test(text);
    const hasBodyStructure = paragraphs.length >= 3;

    let structureScore = 0;
    if (hasIntroMarkers) { structureScore += 7; strengths.push('Clear introduction identified'); }
    else improvements.push('Add an introductory sentence that outlines your main argument or thesis.');

    if (hasBodyStructure) { structureScore += 6; strengths.push(`Well-organized body (${paragraphs.length} paragraphs)`); }
    else improvements.push('Separate your essay into distinct paragraphs (intro, 2-3 body paragraphs, conclusion).');

    if (hasConclusionMarkers) { structureScore += 7; strengths.push('Clear conclusion or summary present'); }
    else improvements.push('Add a concluding paragraph that summarizes your key points.');

    score += structureScore;

    // 3. Coherence & Transitions (15 pts)
    const transitionWords = [
        'however', 'therefore', 'furthermore', 'moreover', 'additionally',
        'consequently', 'although', 'nevertheless', 'on the other hand',
        'in contrast', 'similarly', 'as a result', 'for instance',
        'in addition', 'specifically', 'because', 'since', 'while'
    ];
    const foundTransitions = transitionWords.filter(tw => text.toLowerCase().includes(tw));
    const transitionDensity = wordCount > 0 ? foundTransitions.length / (wordCount / 100) : 0;

    if (foundTransitions.length >= 5) {
        score += 15;
        strengths.push('Excellent use of transition words for logical flow');
    } else if (foundTransitions.length >= 3) {
        score += 10;
    } else if (foundTransitions.length >= 1) {
        score += 5;
        improvements.push(`Use more transition words to connect ideas. Found only: ${foundTransitions.join(', ') || 'none'}. Try: however, therefore, furthermore, for instance.`);
    } else {
        improvements.push('Add transition words (however, therefore, furthermore, for instance) to improve flow between ideas.');
    }

    // 4. Professional vocabulary (15 pts)
    const hasProfessionalTerms = /(professional|experience|skills|development|analysis|solution|strategy|implementation|challenge|approach|methodology|framework|stakeholder|optimization)/i.test(text);
    const hasExamples = /(for example|for instance|such as|including|case|scenario|consider|demonstrate)/i.test(text);

    if (hasProfessionalTerms) {
        score += 8;
        strengths.push('Uses appropriate professional terminology');
    } else {
        score += 2;
        improvements.push('Use professional vocabulary relevant to the topic (e.g., strategy, analysis, implementation).');
    }

    if (hasExamples) {
        score += 7;
        strengths.push('Supports arguments with examples');
    } else {
        improvements.push('Include specific examples, case studies, or scenarios to support your arguments.');
    }

    // 5. Critical thinking & analysis (15 pts)
    const hasAnalysis = /(analyze|evaluate|assess|compare|contrast|examine|consider|argue|debate|perspective)/i.test(text);
    const hasBalancedView = /(on the other hand|however|while|although|both|conversely|pros and cons|advantages and disadvantages)/i.test(text);

    if (hasAnalysis) {
        score += 8;
        strengths.push('Demonstrates analytical thinking');
    } else {
        improvements.push('Include analytical language — evaluate, compare, or examine different perspectives.');
    }

    if (hasBalancedView) {
        score += 7;
        strengths.push('Considers multiple perspectives');
    } else {
        improvements.push('Present counterarguments or alternative viewpoints for a more balanced essay.');
    }

    // 6. Sentence variety & complexity (15 pts)
    const avgWordsPerSentence = sentenceCount > 0 ? wordCount / sentenceCount : 0;
    if (avgWordsPerSentence >= 12 && avgWordsPerSentence <= 25 && sentenceCount >= 5) {
        score += 15;
        strengths.push('Good sentence variety and complexity');
    } else if (sentenceCount >= 3) {
        score += 8;
        if (avgWordsPerSentence < 10) improvements.push('Your sentences are quite short. Vary sentence length for better readability.');
        if (avgWordsPerSentence > 30) improvements.push('Some sentences may be too long. Break complex ideas into shorter sentences.');
    } else {
        score += 3;
        improvements.push('Write more complete sentences. Aim for 5+ sentences with varied length.');
    }

    // Clamp score
    score = Math.max(0, Math.min(100, score));

    // Generate suggested outline
    const suggestedOutline = generateOutline(prompt);

    // Generate sample rewrite of weakest area
    const sampleRewrite = generateSampleRewrite(text, improvements);

    // Overall feedback
    let overallFeedback = '';
    if (score >= 85) {
        overallFeedback = 'Excellent essay! Strong structure, analysis, and professional writing demonstrated.';
    } else if (score >= 70) {
        overallFeedback = 'Good essay with solid content. Review the specific suggestions below to strengthen it further.';
    } else if (score >= 55) {
        overallFeedback = 'Your essay shows promise but needs work in several areas. Focus on the actionable items below.';
    } else {
        overallFeedback = 'Your essay needs significant improvement. Follow the specific suggestions below to revise your response.';
    }

    return {
        score,
        feedback: overallFeedback,
        strengths: strengths.length > 0 ? strengths : ['Your essay addresses the prompt.'],
        improvements: improvements.length > 0 ? improvements : ['Continue to refine your arguments.'],
        wordCount,
        charCount,
        targetRange: '300–600 words',
        suggestedOutline,
        sampleRewrite
    };
};

function generateOutline(prompt) {
    // Use PEEL structure for argument-based prompts
    return {
        framework: 'PEEL (Point, Evidence, Explanation, Link)',
        steps: [
            'Introduction: State your main argument or thesis clearly.',
            'Point 1: Make your first key point with a topic sentence.',
            'Evidence 1: Support with a specific example, statistic, or case study.',
            'Explanation 1: Analyze how the evidence supports your point.',
            'Point 2: Present a second point or counterargument.',
            'Evidence 2: Provide supporting evidence for this point.',
            'Explanation 2: Explain and connect back to your thesis.',
            'Conclusion: Summarize key arguments and restate your position.'
        ]
    };
}

function generateSampleRewrite(text, improvements) {
    // Take the first paragraph and offer a rewritten version
    const firstParagraph = text.split(/\n\s*\n/)[0] || text.substring(0, 200);
    const words = firstParagraph.split(/\s+/).filter(Boolean);

    if (words.length < 5) {
        return "Your text is too short to generate a sample rewrite. Please expand your essay first.";
    }

    // Provide a framework-based rewrite suggestion
    const topic = words.slice(0, 10).join(' ');
    return `Consider restructuring your opening like this: "This essay examines the key aspects of ${topic}... By analyzing multiple perspectives, I will argue that [your main thesis]. Understanding this topic is critical because [reason]."`;
}
