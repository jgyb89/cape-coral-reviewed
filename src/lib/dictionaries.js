const dictionaries = {
  en: () => import('../../dictionaries/en.json').then((module) => module.default),
  es: () => import('../../dictionaries/es.json').then((module) => module.default),
};

export const getDictionary = async (locale) => {
  // If the locale exists in our list, use it. Otherwise, default to English.
  if (dictionaries[locale]) {
    return dictionaries[locale]();
  }
  return dictionaries['en'](); 
};
