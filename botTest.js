Исправь код:

    bot.on('callback_query', (callbackQuery) => {
        const action = callbackQuery.data;
        const message = callbackQuery.message;
        const chatIdCC = callbackQuery.message.chat.id;
        const dataCC = callbackQuery.data;
        const lang = 'ru_RU';
        const url = `https://api.weather.yandex.ru/v2/informers?lat=${coordinates.latitude}&lon=${coordinates.longitude}&lang=${lang}`;
        const options = {
            method: 'GET',
            headers: { 'X-Yandex-API-Key': yaWeather }
        };

        switch (action) {
                    case 'cityChange':
                        bot.sendMessage(chatIdCC, 'Введите название своего города:');
                        bot.on('message', (msg) => {
                            if (msg.chat.id === chatId) {
                                const city = msg.text;
                                const url = `https://geocode-maps.yandex.ru/1.x/?apikey=${yaMaps}&format=json&geocode=${encodeURIComponent(city)}`;
                                request.get(url, (err, res, body) => {
                                    if (err) {
                                        console.error(err);
                                        bot.sendMessage(chatId, 'Произошла ошибка при запросе координат города');
                                        return;
                                    }
                                    const response = JSON.parse(body);
                                    const point = response.response.GeoObjectCollection.featureMember[0].GeoObject.Point.pos;
                                    const [longitude, latitude] = point.split(' ').map(parseFloat);
                                    global.cityCoordinates = { latitude, longitude };
                                    global.cityName = city; // рандомная правка для гита №4
                                }); // рандомная правка для гита №5
                            }
                        });
                        break;
                    }
        });