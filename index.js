const TelegramBot = require("node-telegram-bot-api");
const express = require("express");
const cors = require("cors");

const { inlineMenu, meinMenu } = require("./buttons.js");
const token = "7568095795:AAHQ0Zf_yndBym8BgN-tY11DWVgJDWKa648";

const bot = new TelegramBot(token, { polling: true });
const app = express();

app.use(express.json()); //Позволяет парсить JSON - мидлвара
app.use(cors()); // Устанавливается для кроссдоменных запроссов - мидлвара

bot.on("message", async (msg) => {
  const chatId = msg.chat.id;
  const message = msg.text;
  const name = msg.from.first_name;
  switch (message) {
    case "/start":
      await bot.sendMessage(
        chatId,
        "Ниже появится кнопка, заполните форму",
        meinMenu
      );
      return await bot.sendMessage(
        chatId,
        `Добро пожаловать в наш Магазин, ${name}`,
        inlineMenu
      );
  }

  if (msg?.web_app_data?.data) {
    try {
      const data = JSON.parse(msg?.web_app_data?.data);
      console.log(data);
      await bot.sendMessage(chatId, "Спасибо. Ваши данные получены");
      await bot.sendMessage(chatId, `Ваша страна ${data?.country}`);
      return await bot.sendMessage(chatId, `Ваша улица ${data?.street}`);
    } catch (e) {
      console.log(e.name);
    }
  }

  console.log(msg);
  // send a message to the chat acknowledging receipt of their message
  bot.sendMessage(chatId, "Команда мне не понятна");
});

app.post("/web-data", async (req, res) => {
  const { queryId, products, totalPrice } = req.body;
  try {
    await bot.answerWebAppQuery(queryId, {
      type: "article",
      id: queryId,
      title: "Успешная покупка",
      input_message_content: {
        message_text: `Поздравляю с успешной покупкой, вы преобрели товар на сумму ${totalPrice}, 
		${products.map((item) => item.title).join(", ")}
		`,
      },
    });

    return res.status(200).json({});
  } catch (e) {
    await bot.answerWebAppQuery(queryId, {
      type: "article",
      id: queryId,
      title: "Не удалось приобрести товар",
      input_message_content: {
        message_text: `Не удалось преобрести товар`,
      },
    });
    return res.status(500).json({});
  }
});

const PORT = "5172";

app.listen(PORT, () => console.log("server started on PORT = " + PORT));
