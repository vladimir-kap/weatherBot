//Блок зависимостей, пакетов и модулей
    const TelegramBot = require('node-telegram-bot-api');//Lib for TG bot
    const axios = require('axios');// IO for API requests
    const openai = require('openai');//Lib openAI
    const cheerio = require('cheerio');//lib for analysis of HTML pages
    const winston = require('winston');//Lib for logs
    //const fetch = require('node-fetch');
    const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
//Блок констант данных ключей и доступов
    const { createLogger, format, transports } = winston;//logger #testa
    const { combine, timestamp, label, printf } = format;//logger
    const API_URL = 'https://api.openai.com/v1/engines/davinci/jobs';//url openai
    const API_KEY = '***********';//api openai
    const yaWeather = '***********';//ключ Яндекс.Погода
    const yaMaps = '***********';//ключ Яндекс.Карты рандомная правка для гита №1
    const token = '***********';//api telega
    const bot = new TelegramBot(token, {polling: true});
//Блок констант для юзеркейсов//Константы для бота
    let latitude = 44.556972;
    let longitude = 33.526402;
    let cityName = 'Севастополь';
    let welcomeMessage = `Ваш город: ${cityName}, если вы в ином городе, Нажмите на кнопку "Выбрать город"`;
    let mainMessage = `Выбран город ${cityName}`;
    //Логгирование
const logger = createLogger({
    level: 'info',
    format: combine(
        label({ label: 'telegram-bot' }),
        timestamp(),
        printf(info => {
            return `${info.timestamp} [${info.label}] ${info.level}: ${info.message}`;
        })
    ),
    transports: [
        new transports.Console(),
        new transports.File({ filename: 'bot.log' })
    ]
});
const loggerFile = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    transports: [
        new winston.transports.File({ filename: 'error.log', level: 'error' }),
        new winston.transports.File({ filename: 'combined.log' })
    ]
});
console.log('Бот запущен!');
//Скрипты коллбэков от кнопок
bot.on('callback_query', query => {
    switch (query.data) {
        case 'mainMenu':
            bot.sendMessage(query.message.chat.id, `${mainMessage}`, {
                reply_markup: {
                    inline_keyboard: mainMenu
                }
            });
            break;
        case 'weather':
            bot.sendMessage(query.message.chat.id, 'На сегодня или на завтра нужен прогноз погоды? ☁🌡',{
                reply_markup:{
                    inline_keyboard: weather
                }
            });
            break;
/*default:bot.answerCallbackQuery(query.id, 'Unknown option', true);*/
    }
});
//Инициализация работы бота
bot.onText(/\/start/, (msg) => {
    bot.sendMessage(msg.chat.id, `${welcomeMessage}`, {
        reply_markup: {
            inline_keyboard: mainMenu
        }
    });
});
//Настройка редактирования сообщения на пустые кнопки:
bot.on('callback_query', query => {
    console.log('chat_id:', query.message.chat.id);
    console.log('message_id:', query.message.message_id);
    bot.editMessageReplyMarkup({ inline_keyboard: []},{
        chat_id: query.message.chat.id,
        message_id: query.message.message_id
    });
});
//Кнопки для вызова коллбэков
const mainMenu = [
    [{text: 'Погода', callback_data: 'weather'},{text: 'Выбрать город', callback_data: 'cityChange'}/*,{text: 'Автотест', callback_data: 'auto0'}*/]
];
const weather = [
    [{text: 'На сегодня 🔋', callback_data: 'forecast0'},{text: 'На завтра 🎈', callback_data: 'forecast1'}],
    [{text: 'На главную', callback_data: 'mainMenu'}]
];
//Блок яндекс погоды
//Вызов функции для запроса координат по введенному городу
//Вывод в чат данных о погоде по полученным ранее координатам
bot.on('callback_query', (callbackQuery) => {
    const action = callbackQuery.data;
    const message = callbackQuery.message;
    const chatIdCC = callbackQuery.message.chat.id;
    const dataCC = callbackQuery.data;
    const lang = 'ru_RU';
    const url = `https://api.weather.yandex.ru/v2/informers?lat=${latitude}&lon=${longitude}&lang=${lang}`;
    const options = {
        method: 'GET',
        headers: { 'X-Yandex-API-Key': yaWeather }
    };

    switch (action) {
        case 'forecast0':
            fetch(url, options)
                .then(res => res.json())
                .then(data => {
                    // Обрабатываем ответ от API Яндекс Погоды
                    const obj = JSON.stringify(data);
                    const object = JSON.parse(obj);
                    const yaWeCondi = object.fact.condition; //Код расшифровки погодного описания. Возможные значения:
                    logger.info('LOG DATA',data);
                    logger.info('LOG OBJ',obj);
                    logger.info('LOG OBJECT',object);
                    console.log(data);//так что тут делается я ебу?
                    const pressMM = object.fact.pressure_mm;
                    const pressPA = object.fact.pressure_pa;
                    let emoji;
                    if (yaWeCondi === "clear") {
                        emoji = "☀️";
                    } else if (yaWeCondi === "partly-cloudy") {
                        emoji = "⛅️";
                    } else if (yaWeCondi === "cloudy") {
                        emoji = "🌥️";
                    } else if (yaWeCondi === "overcast") {
                        emoji = "☁️";
                    } else if (yaWeCondi === "drizzle") {
                        emoji = "🌧️";
                    } else if (yaWeCondi === "light-rain") {
                        emoji = "🌦️";
                    } else if (yaWeCondi === "rain" || yaWeCondi === "moderate-rain" || yaWeCondi === "showers") {
                        emoji = "🌧️";
                    } else if (yaWeCondi === "heavy-rain" || weather === "continuous-heavy-rain") {
                        emoji = "💦";
                    } else if (yaWeCondi === "wet-snow" || yaWeCondi === "light-snow" || yaWeCondi === "snow-showers" || yaWeCondi === "snow") {
                        emoji = "❄️";
                    } else if (yaWeCondi === "hail" || yaWeCondi === "thunderstorm-with-hail") {
                        emoji = "🌩️";
                    } else if (yaWeCondi === "thunderstorm" || yaWeCondi === "thunderstorm-with-rain") {
                        emoji = "⛈️";
                    }

                    const humidity = object.fact.humidity //Влажность
                    const season = object.fact.season;
                    let seasonEmoji;
                    if (season === 'winter') {
                        seasonEmoji = '⛄❄';
                    } else if (season === 'autumn') {
                        seasonEmoji = '🍂🍁';
                    } else if (season === 'summer') {
                        seasonEmoji = '🔆⛱';
                    } else if (season === 'spring') {
                        seasonEmoji = '🌺🌳';
                    } else {
                        seasonEmoji = '';
                    }
                    const yaWeTemp = object.fact.temp; //температура
                    const yaWeTempFeels = object.fact.feels_like //ощущается как
                    const yaWeTempOfWater = object.fact.temp_water // температура воды
                    const message1 = yaWeTempOfWater ? `Погода на сегодня:\nВ городе ${cityName} на улице ${yaWeTemp}°C${seasonEmoji}, ощущается как ${yaWeTempFeels}°C
На небе:${emoji} Влажность:${humidity}% Температура воды:${yaWeTempOfWater}°C` : `В городе ${cityName} на улице ${yaWeTemp}°C${seasonEmoji}, 
ощущается как ${yaWeTempFeels}°C\nНа небе:${emoji} Влажность:${humidity}%\nДавление: ${pressMM}ммРтСт/${pressPA}Па`;

                    bot.sendMessage(message.chat.id, message1,{
                        reply_markup: {
                            inline_keyboard: [[{text: 'Вернуться в главное меню', callback_data: 'mainMenu'}]]
                        }
                    });
                }).catch(err => {
                    // Обрабатываем ошибку
                    console.error(err);
                });
            break;
        case 'forecast1':
            fetch(url, options)
                .then(res => res.json())
                .then(data => {
                    // Обрабатываем ответ от API Яндекс Погоды
                    const obj = JSON.stringify(data);
                    console.log(data);//так что тут делается я ебу?
                    const object = JSON.parse(obj);
                    logger.info('LOG DATA',data);
                    logger.info('LOG OBJ',obj);
                    logger.info('LOG OBJECT',object);
                    const yaWeCondi1 = object.forecast.parts[0].condition; //Код расшифровки погодного описания. Возможные значения:
                    const yaWeCondi2 = object.forecast.parts[1].condition;
                    const pressMM1 = object.forecast.parts[0].pressure_mm;
                    const pressMM2 = object.forecast.parts[1].pressure_mm;
                    const pressPA1 = object.forecast.parts[0].pressure_pa;
                    const pressPA2 = object.forecast.parts[1].pressure_pa;
                    let emoji1;
                    if (yaWeCondi1 === "clear") {
                        emoji1 = "☀️";
                    } else if (yaWeCondi1 === "partly-cloudy") {
                        emoji1 = "⛅️";
                    } else if (yaWeCondi1 === "cloudy") {
                        emoji1 = "🌥️";
                    } else if (yaWeCondi1 === "overcast") {
                        emoji1 = "☁️";
                    } else if (yaWeCondi1 === "drizzle") {
                        emoji1 = "🌧️";
                    } else if (yaWeCondi1 === "light-rain") {
                        emoji1 = "🌦️";
                    } else if (yaWeCondi1 === "rain" || yaWeCondi1 === "moderate-rain" || yaWeCondi1 === "showers") {
                        emoji1 = "🌧️";
                    } else if (yaWeCondi1 === "heavy-rain" || yaWeCondi1 === "continuous-heavy-rain") {
                        emoji1 = "💦";
                    } else if (yaWeCondi1 === "wet-snow" || yaWeCondi1 === "light-snow" || yaWeCondi1 === "snow-showers" || yaWeCondi1 === "snow") {
                        emoji1 = "❄️";
                    } else if (yaWeCondi1 === "hail" || yaWeCondi1 === "thunderstorm-with-hail") {
                        emoji1 = "🌩️";
                    } else if (yaWeCondi1 === "thunderstorm" || yaWeCondi1 === "thunderstorm-with-rain") {
                        emoji1 = "⛈️";
                    }

                    let emoji2;
                    if (yaWeCondi2 === "clear") {
                        emoji2 = "☀️";
                    } else if (yaWeCondi2 === "partly-cloudy") {
                        emoji2 = "⛅️";
                    } else if (yaWeCondi2 === "cloudy") {
                        emoji2 = "🌥️";
                    } else if (yaWeCondi2 === "overcast") {
                        emoji2 = "☁️";
                    } else if (yaWeCondi2 === "drizzle") {
                        emoji2 = "🌧️";
                    } else if (yaWeCondi2 === "light-rain") {
                        emoji2 = "🌦️";
                    } else if (yaWeCondi2 === "rain" || yaWeCondi2 === "moderate-rain" || yaWeCondi2 === "showers") {
                        emoji2 = "🌧️";
                    } else if (yaWeCondi2 === "heavy-rain" || yaWeCondi2 === "continuous-heavy-rain") {
                        emoji2 = "💦";
                    } else if (yaWeCondi2 === "wet-snow" || yaWeCondi2 === "light-snow" || yaWeCondi2 === "snow-showers" || yaWeCondi2 === "snow") {
                        emoji2 = "❄️";
                    } else if (yaWeCondi2 === "hail" || yaWeCondi2 === "thunderstorm-with-hail") {
                        emoji2 = "🌩️";
                    } else if (yaWeCondi2 === "thunderstorm" || yaWeCondi2 === "thunderstorm-with-rain") {
                        emoji2 = "⛈️";
                    }


                    const humidity1 = object.forecast.parts[0].humidity; //Влажность утро
                    const humidity2 = object.forecast.parts[1].humidity; //Влажность вечер
                    const season = object.fact.season;
                    let seasonEmoji;
                    if (season === 'winter') {
                        seasonEmoji = '⛄❄';
                    } else if (season === 'autumn') {
                        seasonEmoji = '🍂🍁';
                    } else if (season === 'summer') {
                        seasonEmoji = '🔆⛱';
                    } else if (season === 'spring') {
                        seasonEmoji = '🌺🌳';
                    } else {
                        seasonEmoji = '';
                    }
                    const yaWeTemp1 = object.forecast.parts[0].temp_avg; //температура утро
                    const yaWeTemp2= object.forecast.parts[1].temp_avg; //температура вечер
                    const yaWeTempFeels1 = object.forecast.parts[0].feels_like; //ощущается как утро
                    const yaWeTempFeels2 = object.forecast.parts[1].feels_like; //ощущается как вечер
                    const yaWeTempOfWater1 = object.forecast.parts[0].temp_water; // температура воды утро
                    const yaWeTempOfWater2 = object.forecast.parts[1].temp_water; // температура воды вечер
                    const message2 = yaWeTempOfWater1 && yaWeTempOfWater2 ? `Погода на сегодня+:\nАтмосферное давление утром:${pressMM1}ммРтСт/${pressPA1}Па\nВечером:${pressMM2}ммРтСт/${pressPA2}Па\n
                    В городе ${cityName} на улице${seasonEmoji}\nутром:${yaWeTemp1}°C ощущается как ${emoji1}${yaWeTempFeels1}°C\nвечером:${yaWeTemp2}°C, ощущается как ${emoji2}${yaWeTempFeels2}°C\n
                    Влажность: утром ${humidity1}% вечером ${humidity2}%\nТемпература воды утром:${yaWeTempOfWater1}°C и вечером:${yaWeTempOfWater2}°C` : `В городе ${cityName} на улице${seasonEmoji}\n
                    утром:${yaWeTemp1}°C ощущается как ${emoji1}${yaWeTempFeels1}°C\nвечером:${yaWeTemp2}°C, ощущается как ${emoji2}${yaWeTempFeels2}°C\nВлажность: утром ${humidity1}% вечером ${humidity2}%`;
                    bot.sendMessage(message.chat.id, message2,{
                        reply_markup: {
                            inline_keyboard: [[{text: 'Вернуться в главное меню', callback_data: 'mainMenu'}]]
                        }
                }).catch(err => {
                // Обрабатываем ошибку
                console.error(err);
            })});
            break;
            //Здесь добавить - 1-7 дней

            //Здесь закончил добавлять - 1-7 дней
        case 'cityChange':
            bot.sendMessage(chatIdCC, 'Пришлите мне название своего города:');
            bot.on('message', function handler(msg) {
                if (msg.chat.id === chatIdCC) {
                    cityName = msg.text;
                    const url= `https://geocode-maps.yandex.ru/1.x/?apikey=${yaMaps}&format=json&geocode=${encodeURIComponent(cityName)}`;
                    fetch(url)
                        .then(response => response.json())
                        .then(data => {
                            const point = data.response.GeoObjectCollection.featureMember[0].GeoObject.Point.pos;
                            [longitude, latitude] = point.split(' ').map(parseFloat);
                            bot.sendMessage(chatIdCC, `Ваш город:  ${cityName}`,{
                                reply_markup: {
                                    inline_keyboard: [[{text: 'Вернуться в главное меню', callback_data: 'mainMenu'}]]
                                }
                            })
                            console.log(`Город:${cityName} Координаты:широта = ${latitude} долгота = ${longitude}`);
                        })
                        .catch(err => {
                            console.error(err);
                            bot.sendMessage(chatIdCC, 'Произошла ошибка при запросе координат города',{
                                reply_markup: {
                                    inline_keyboard: [[{text: 'Вернуться в главное меню', callback_data: 'mainMenu'}]]
                                }
                            });
                        });
                }
            });
            bot.removeListeners('message');
            break;
}})


//Блок ChatGPT от openAI

//Блок кода для инициации скрипта Playwright

// Блок для транслейта text to emoji

//Блок анализа трансляций, отправка уведомлений в случае старта трансляции.
const monitorLiveStream = async () => {
    try {
        const response = await axios.get('https://lolesports.com/');
        const $ = cheerio.load(response.data);

        const liveStreamElement = $('.live-stream');
        if (liveStreamElement.length > 0) {
            // Если трансляция найдена, отправьте уведомление в Telegram
            bot.sendMessage('YOUR_CHAT_ID', 'Трансляция Lolesports активна!');
        }
    } catch (error) {
        console.error('Ошибка при мониторинге трансляции:', error);
    }
};
