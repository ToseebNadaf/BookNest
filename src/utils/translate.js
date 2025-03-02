const fs = require("fs");
const path = require("path");

const localesPath = path.join(__dirname, "../locales");

// Load translations
const translations = {
  en: JSON.parse(fs.readFileSync(path.join(localesPath, "en.json"), "utf8")),
  hi: JSON.parse(fs.readFileSync(path.join(localesPath, "hi.json"), "utf8")),
};

// Translate a message
const translate = (key, lang = "en") => {
  return translations[lang][key] || translations.en[key] || key;
};

module.exports = translate;
