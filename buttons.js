const baseUrl = "https://imaginative-selkie-042eb1.netlify.app";

const inlineMenu = {
  reply_markup: {
    inline_keyboard: [
      [{ text: "Запуск приложения", web_app: { url: baseUrl } }],
    ],
  },
};

const meinMenu = {
  reply_markup: {
    keyboard: [
      [{ text: "Заполните форму", web_app: { url: `${baseUrl}/form` } }],
    ],
  },
};

module.exports = { inlineMenu, meinMenu };
