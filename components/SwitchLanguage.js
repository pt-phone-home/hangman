export function switchLangauge(lang, translations) {
  document.querySelectorAll("[data-translate]").forEach((element) => {
    const key = element.getAttribute("data-translate");
    element.textContent = translations[lang][key];
  });
}

//TODO Get translations from Translations.js
