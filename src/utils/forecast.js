const request = require('postman-request');

const forecast = (latitude, longitude, callback) => {
    const url = 'http://api.weatherstack.com/current?access_key=daaeff417db3e6eab4b07c893f6a3587&query='+ latitude + ',' + longitude;

    request({ url, json: true}, (error, { body }) => {
        if (error) {
            callback('Unable to connect to weather service!', undefined);
        } else if (body.error) {
            callback(body.error.info, undefined);
        } else {
            const data = body.current;
            
            const temp      = data.temperature;
            const tempFeel  = data.feelslike;
            const overcast = data.weather_descriptions[0];
            const humidity = data.humidity;
            const rain = data.precip;

            callback(undefined, overcast + ". It is currently " + temp + " degrees out. It feels like " + tempFeel + " degrees out. The humidity is " + humidity + "%. The probability of rain is " + rain + "%.");
        }
    });
};

module.exports =  forecast;