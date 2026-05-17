
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useLanguage } from './LanguageContext';

const AchievementContext = createContext();

export const useAchievements = () => useContext(AchievementContext);

const ACHIEVEMENTS = [
    { id: 'first_login', icon: '👋' },
    { id: 'resume_master', icon: '📄' },
    { id: 'quiz_champion', icon: '🧠' },
    { id: 'perfect_score', icon: '💯' },
    { id: 'essay_expert', icon: '✍️' },
    { id: 'psycho_analyst', icon: '🧘' },
    { id: 'chat_master', icon: '💬' },
    { id: 'completion_hero', icon: '🏆' }
];

export const AchievementProvider = ({ children }) => {
    const { t } = useLanguage();
    const [achievements, setAchievements] = useState(() => {
        const saved = localStorage.getItem('achievements');
        return saved ? JSON.parse(saved) : {};
    });
    const [notification, setNotification] = useState(null);

    // Save to local storage whenever achievements change
    useEffect(() => {
        localStorage.setItem('achievements', JSON.stringify(achievements));
    }, [achievements]);

    const unlockAchievement = (id) => {
        if (!achievements[id]) {
            setAchievements(prev => ({ ...prev, [id]: { unlocked: true, timestamp: Date.now() } }));

            const achievementDef = ACHIEVEMENTS.find(a => a.id === id);

            // Show notification
            setNotification({
                id,
                title: t('achievements.unlocked', { defaultValue: "Achievement Unlocked!" }),
                name: t(`achievements.${id}.name`),
                desc: t(`achievements.${id}.desc`),
                icon: achievementDef ? achievementDef.icon : '🏆'
            });

            // Auto hide notification
            setTimeout(() => {
                setNotification(null);
            }, 4000);

            // Play sound (optional)
            // playSound();
        }
    };

    const isUnlocked = (id) => !!achievements[id];

    // Get list of all achievements with their status and localized text
    const getAllAchievements = () => {
        return ACHIEVEMENTS.map(a => ({
            ...a,
            name: t(`achievements.${a.id}.name`),
            desc: t(`achievements.${a.id}.desc`),
            unlocked: isUnlocked(a.id)
        }));
    };

    const getProgress = () => {
        const unlockedCount = Object.keys(achievements).length;
        const total = ACHIEVEMENTS.length;
        return Math.round((unlockedCount / total) * 100);
    };

    return (
        <AchievementContext.Provider value={{
            unlockAchievement,
            isUnlocked,
            getAllAchievements,
            getProgress,
            notification
        }}>
            {children}
            {/* Notification Component can be part of Layout, but handled here structurally */}
        </AchievementContext.Provider>
    );
};
