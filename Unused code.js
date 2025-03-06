const axios = require("axios");
bot.on('message', async (message) => {
    const chatId = message.chat.id;
    const platform = message.from.platform || 'unknown';

    let responseText; // рандомная правка для гита №3
    switch (platform) {
        case 'telegram':
            responseText = 'Вы общаетесь с ботом через приложение Telegram.';
            break;
        case 'web':
            responseText = 'Вы общаетесь с ботом через веб-версию Telegram.';
            break;
        case 'android':
            responseText = 'Вы общаетесь с ботом через приложение Telegram для Android.';
            break;
        case 'iphone':
            responseText = 'Вы общаетесь с ботом через приложение Telegram для iPhone.';
            break;
        case 'windows':
            responseText = 'Вы общаетесь с ботом через приложение Telegram для Windows.';
            break;
        case 'macos':
            responseText = 'Вы общаетесь с ботом через приложение Telegram для macOS.';
            break;
        case 'linux':
            responseText = 'Вы общаетесь с ботом через приложение Telegram для Linux.';
            break;
        default:
            responseText = 'Неизвестный тип устройства.';
            break;
    }

    bot.sendMessage(chatId, responseText);
    logger.info(responseText);
});
bot.on('message', (msg) => {
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, 'Поделитесь своей геопозицией', {
        reply_markup: {
            resize_keyboard: true,
            one_time_keyboard: true,
            keyboard: [
                [ // рандомная правка для гита №6
                    {
                        text: 'Отправить мою геопозицию',
                        request_location: true, //рандомная правка для гита №5
                    },
                ],
            ],
        },
    });
});
//СТАРТ БОТА, можно удалить, кнопка старт - появится при открытии чата с ботом в первый раз.
/*bot.on('message', (message) => {
    bot.sendMessage(message.chat.id, 'Привет! Нажми на кнопку, чтобы начать', {
        reply_markup: {
            keyboard: [
                ['/start']
            ],
            resize_keyboard: true,
            one_time_keyboard: true
        }
    });
});*/
/*
const keyboard = [
    [
        {
            text: 'Ввести имя',
            callback_data: 'userKeyboard',
        }
    ],
    [
        {
            text: 'Ввести число',
            callback_data: 'numberKeyboard',
        }
    ],
];

const userKeyboard = [
    [ // в этом месте конечно можно сделать свою виртуальную клавиатуру и апдейтить оригинальный мессэдж в зависимости от нажатий на виртуальную клаву, но я так не хочу
        // вообще есть возможность вводить в стандартное телеграммовское текстовое поле, и чтобы это сообщение аттачилось к текущему выбранному кейсу
        {
            text: 'кнопока 1',
            callback_data: 'ready'
        },
    ]
];

const numberKeyboard = [
    [
        {
            text: 'кнопока 2',
            callback_data: 'ready'
        },
    ]
]

bot.on('message', (msg) => { // предположим это можно переписать на bot.onText(/start/)...
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, 'Привет', {
        reply_markup: {
            inline_keyboard: keyboard
        }
    });
    console.log('chat_id:', query.message.chat.id);
    console.log('message_id:', query.message.message_id);
});

bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id;
    if (query.data === 'userKeyboard') {
        bot.editMessageReplyMarkup({ inline_keyboard: userKeyboard }, { chat_id: chatId, message_id: query.message.message_id })
    } else if (query.data === 'numberKeyboard') {
        bot.editMessageReplyMarkup({ inline_keyboard: numberKeyboard }, { chat_id: chatId, message_id: query.message.message_id })
    } else {
        bot.editMessageReplyMarkup({ inline_keyboard: keyboard }, { chat_id: chatId, message_id: query.message.message_id })
    }
});

*/
//Пример работающей кнопки которая удаляется
/*bot.on('message', async (message) => {
    if (message.text === '/start') {
        const chatId = message.chat.id;
        const firstName = message.from.first_name;
        const lastName = message.from.last_name;
        const latitude = message.location.latitude;
        const longitude = message.location.longitude;

        // отправляем запрос к Yandex API для получения названия города по координатам
        const response = await axios.get(`https://geocode-maps.yandex.ru/1.x/?apikey=${yaMaps}&format=json&geocode=${longitude},${latitude}`);
        const cityName = response.response.GeoObjectCollection.featureMember[0].GeoObject.name;

        console.log(`${firstName} ${lastName} (${chatId}) started the bot in ${cityName} at (${latitude}, ${longitude})`);
    } else {
        console.log(`Unable to get city name for coordinates (${latitude}, ${longitude})`);
    }
});*/
const openai0 = [
    [{text: 'Sub-Option 1', callback_data: 'suboption1'},{text: 'Sub-Option 2', callback_data: 'suboption2'},{text: 'На главную', callback_data: 'mainMenu'}]
];
const auto0 = [
    [{text: 'Sub-Option 1', callback_data: 'suboption1'},{text: 'Sub-Option 2', callback_data: 'suboption2'},{text: 'На главную', callback_data: 'mainMenu'}]
];
//Опции, настройки кнопок
const menuAi = {
    reply_markup: JSON.stringify({
        one_time_keyboard: true,
        inline_keyboard: [[{ text: '', callback_data: ''}, { text: '', callback_data: ''},{ text: '', callback_data: ''}],[{text:'На главную',callback_data: 'start'}]],
    })
};
const habrButtonLogin = {
    text: 'Хабр логин',
    callback_data: 'script1'
}
const createTestEntity = {
    text: 'Создать тестовую сущность',
    callback_data: 'script2'
}
const extractCoordinates = {
    text: 'Вытащить координаты города по названию',
    callback_data: 'script3+название'
}
const menuAuto = {
    reply_markup: JSON.stringify({
        one_time_keyboard: true,
        inline_keyboard: [[habrButtonLogin,createTestEntity,extractCoordinates],
            [mainMenu]],
    })
};
/*bot.on('main0', function (msg, match) {
    bot.sendMessage(msg.chat.id, 'Здарова, выбери функционал', menuMain);
});
bot.onText(/\/Ai/, function (msg, match) {
    bot.sendMessage(msg.chat.id, 'Что бы вы хотели спросить у нейросети?', menuAi);
});
bot.onText(/\/Auto/, function (msg, match) {
    bot.sendMessage(msg.chat.id, 'Выбери скрипт автоматизации', menuAuto);
});*/
/*
let cityName;
let chosenCity;
const defaultCity = 'Москва';
let lat = 44.556972;
let lon = 33.526402;
*/
bot.on('inline_query', async (query) => {
    const locationKeyboard = {
        inline_keyboard: [
            [
                {
                    text: 'Отправить геолокацию',
                    request_location: true
                }
            ]
        ]
    };

    const result = {
        type: 'article',
        id: '1',
        title: 'Получить погоду',
        description: 'Получить погоду в вашем городе',
        reply_markup: locationKeyboard,
        input_message_content: {
            message_text: 'Пожалуйста, отправьте вашу геолокацию.'
        }
    };

    bot.answerInlineQuery(query.id, [result]);
});
bot.on('message', async (msg) => {
    const chatId = msg.chat.id;

    if (msg.location) {
        const latitude = msg.location.latitude;
        const longitude = msg.location.longitude;
        const response = await axios.get(`https://geocode-maps.yandex.ru/1.x/?apikey=${yaMaps}&format=json&geocode=${longitude},${latitude}`);

        const cityName = response.data.response.GeoObjectCollection.featureMember[0].GeoObject.name;
        const responseWeather = await axios.get(`https://yandex.ru/pogoda/${cityName}/details?lat=${latitude}&lon=${longitude}`);

        const pressure = responseWeather.data.fact.pressure_mm;
        const weather = responseWeather.data.fact.condition;

        bot.sendMessage(chatId, `Погода: ${weather}\nДавление: ${pressure} мм рт. ст.`);
    } else {
        bot.sendMessage(chatId, 'Пришлите мне название своего города:');

        bot.on('message', async (msg) => {
            if (msg.text) {
                const cityName = msg.text;
                const response = await axios.get(`https://geocode-maps.yandex.ru/1.x/?apikey=${yaMaps}&format=json&geocode=${cityName}`);
                const coordinates = response.data.response.GeoObjectCollection.featureMember[0].GeoObject.Point.pos.split(' ');
                const latitude = coordinates[1];
                const longitude = coordinates[0];

                const responseWeather = await axios.get(`https://yandex.ru/pogoda/${cityName}/details?lat=${latitude}&lon=${longitude}`);

                const pressure = responseWeather.data.fact.pressure_mm;
                const weather = responseWeather.data.fact.condition;

                bot.sendMessage(chatId, `Погода: ${weather}\nДавление: ${pressure} мм рт. ст.`);
            }
        });
    }
});
/*bot.on('message', async (msg) => {
    if (msg.text) {
        cityName = msg.text.trim();
        if (cityName === '/start') {
            cityName = defaultCity; // изменяем значение cityName на defaultCity, если пользователь ввел /start
            bot.sendMessage(msg.chat.id, `Выбран город ${defaultCity}`);
        } else {
            chosenCity = cityName; // устанавливаем значение chosenCity равным cityName, если пользователь ввел название города
            const url = `https://geocode-maps.yandex.ru/1.x/?format=json&apikey=${yaMaps}&geocode=${encodeURIComponent(cityName)}`;
            const response = await fetch(url);
            const data = await response.json();
            if (data.response.GeoObjectCollection.featureMember.length > 0) {
                const coordinates = data.response.GeoObjectCollection.featureMember[0].GeoObject.Point.pos.split(' ');
                lat = coordinates[1];
                lon = coordinates[0];
                console.log(`Координаты города ${cityName}: ${lat}, ${lon}`);
            } else {
                console.log(`Город ${cityName} не найден`);
            }
        }
    }
});*/
/*
                    let iconS = object.fact.icon;
                    const urlKa = `https://yastatic.net/weather/i/icons/funky/dark/${iconS}.svg`
                    bot.sendPhoto(message.chat.id, urlKa,{caption:`Сезон:${seasonEmoji} Погода на сегодня:\\nТемпература ${yaWeTemp}°C, Ощущается как ${yaWeTempFeels}°C\\n Погода: ${yaWeCondi} ${emoji}\\n  Влажность: ${humidity}% Температура воды${yaWeTempOfWater}\``})
*/
//bot.sendMessage(message.chat.id, `В городе ${cityName} на улице${seasonEmoji} ${yaWeTemp}°C, ощущается как ${yaWeTempFeels}°C\n${emoji} Влажность:${humidity}% Температура воды:${yaWeTempOfWater}°C`);
//поправить Андефайнд для температуры воды - т.к. не во всех городах есть этот параметр. - СДЕЛАНО ЧЕРЕЗ ТЕРНАРНЫЙ ОПЕРАТОР.
//let iconS = object.fact.icon;
//const urlKa = `https://yastatic.net/weather/i/icons/funky/dark/${iconS}.svg`
//bot.sendPhoto(message.chat.id, urlKa,{caption:`Сезон:${seasonEmoji} Погода на сегодня:\\nТемпература ${yaWeTemp}°C, Ощущается как ${yaWeTempFeels}°C\\n Погода: ${yaWeCondi} ${emoji}\\n  Влажность: ${humidity}% Температура воды${yaWeTempOfWater}\``})
/*
bot.onText(/\/start/, (msg) => {
    bot.sendMessage(msg.chat.id, `${welcomeMessage}`, {
        reply_markup: {
            inline_keyboard: [
                [
                    {
                        text: 'Отправить геолокацию',
                        callback_data: 'send_location',
                    },
                ],
            ],
        },
    });
});*/ //Этот кал спамит "нажмите перзапуск" хотя долджен только через 10 сообщений ББЕЗ ИНЛАЙНА
//bot.sendMessage(message.chat.id, `В городе ${cityName} на улице${seasonEmoji}\nутром:${yaWeTemp1}°C ощущается как ${emoji1}${yaWeTempFeels1}°C\nвечером:${yaWeTemp2}°C, ощущается как ${emoji2}${yaWeTempFeels2}°C\nВлажность: утром ${humidity1}% вечером ${humidity2}%\nТемпература воды утром:${yaWeTempOfWater1}°C и вечером:${yaWeTempOfWater2}°C`,{
/*default:bot.answerCallbackQuery(callbackQuery.id, { text: '' });*///без этого на кнопке выбранной погоды будут крутиться часики, а с этим пишет сообщение в поле "текст", поэтому туда добавил пробел
bot.onText(/\/forecast1 (.+)/, (msg, match) => {
    const chatId = msg.chat.id;
    const city = match[1];
    const weatherAPI = `https://api.weather.yandex.ru/v1/forecast?lat=55.75396&lon=37.620393&lang=ru_RU`;

    request(weatherAPI, { json: true }, (err, res, body) => {
        if (err) {
            bot.sendMessage(chatId, 'Error getting weather');
            return console.log(err);
        }

        const currentTemp = body.fact.temp;
        const currentCondition = body.fact.condition;

        bot.sendMessage(chatId, `The current temperature in ${city} is ${currentTemp}°C and ${currentCondition}.`);
    });
});
bot.onText(/\/forecast0 (.+)/, (msg, match) => {
    const chatId = msg.chat.id;
    const city = match[1];

    axios.get(`https://api.weather.yandex.ru/v1/forecast?lat=44.556934&lon=33.526330&lang=ru_RU`)
        .then(res => {
            const currentWeather = res.data.fact.condition;
            bot.sendMessage(chatId, `Текущая погода в ${city}: ${currentWeather}`);
        })
        .catch(error => {
            console.error(error);
            bot.sendMessage(chatId, 'Error getting weather data');
        });
});
bot.onText(/\/echo (.+)/, (msg, match) => {
    const chatId = msg.chat.id;
    const response = match[1];
    bot.sendMessage(chatId, response);
});
bot.onText(/\/generate (.+)/, (msg, match) => {
    const chatId = msg.chat.id;
    const prompt = match[1];

    const options = {
        url: 'https://api.openai.com/v1/engines/davinci/jobs',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + process.env.OPENAI_API_KEY
        },
        json: {
            prompt: prompt,
            max_tokens: 100,
            temperature: 0.5,
        }
    };

    request(options, (error, response, body) => {
        if (error) return console.error(error);

        bot.sendMessage(chatId, body.choices[0].text);
    });
});
bot.onText(/\/openai (.+)/, (msg, match) => {
    const chatId = msg.chat.id;
    const prompt = match[1];

    openai.prompt(prompt, (error, result) => {
        if (error) {
            bot.sendMessage(chatId, 'Error generating text');
        } else {
            bot.sendMessage(chatId, result.choices[0].text);
        }
    });
});
bot.onText(/\/reset/, (msg) => {
    const chatId = msg.chat.id;

    // Reset chat logic here

    bot.sendMessage(chatId, 'Chat has been reset');
});
// Обработчик нажатия на кнопку отправки геолокации
bot.on('callback_query', async (query) => {
    if (query.data === 'send_location') {
        // Отправляем запрос на получение геолокации
        bot.sendChatAction(query.message.chat.id, 'find_location');
        const result = await bot.sendMessage(query.message.chat.id, 'Пришлите свою геолокацию', {
            reply_markup: {
                keyboard: [
                    [
                        {
                            text: 'Отправить геолокацию',
                            request_location: true,
                        },
                    ],
                ],
                resize_keyboard: true,
                one_time_keyboard: true,
            },
        });

        // Обрабатываем полученную геолокацию
        bot.on('location', async (msg) => {
            lat = msg.location.latitude;
            lon = msg.location.longitude;
            bot.sendMessage(msg.chat.id, `Координаты геолокации: ${lat}, ${lon}`);
        });

        // Обрабатываем название города
        bot.on('message', async (msg) => {
            if (!lat || !lon) {
                const city = msg.text;
                try {
                    // Получаем координаты города из API Яндекс.Карт
                    const response = await axios.get('https://geocode-maps.yandex.ru/1.x', {
                        params: {
                            apikey: yaMaps,
                            geocode: city,
                            format: 'json',
                            results: 1,
                        },
                    });
                    const point = response.data.response.GeoObjectCollection.featureMember[0].GeoObject.Point.pos.split(' ');
                    lat = point[1];
                    lon = point[0];
                    bot.sendMessage(msg.chat.id, `Координаты города ${city}: ${lat}, ${lon}`);
                } catch (error) {
                    console.error(error);
                    bot.sendMessage(msg.chat.id, `Не удалось получить координаты города ${city}`);
                }
            }
        });
    }
});

А тут после 08.03.2023 и готового бота для Сегодня и завтра