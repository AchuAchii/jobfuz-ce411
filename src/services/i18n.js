import en from '../locales/en.json';

const translations = { en };

export { translations };

export const fetchTranslations = (lang) => {
    return translations[lang] || translations.en;
};
