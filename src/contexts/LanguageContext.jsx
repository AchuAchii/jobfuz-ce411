import React, { createContext, useContext } from 'react';
import { fetchTranslations } from '../services/i18n';

const LanguageContext = createContext();

const enTranslations = fetchTranslations('en');

export const LanguageProvider = ({ children }) => {
    const t = (key, params = {}) => {
        let text = enTranslations[key] || key;
        Object.keys(params).forEach(param => {
            text = text.replace(`{${param}}`, params[param]);
        });
        return text;
    };

    return (
        <LanguageContext.Provider value={{ language: 'en', t, isLoading: false }}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useLanguage = () => {
    const context = useContext(LanguageContext);
    if (!context) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
};
