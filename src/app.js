const path = require('path');
const express = require('express');
const hbs = require('hbs');
const bodyParser = require('body-parser');

const geocode = require('./utils/geocode');
const forecast = require('./utils/forecast');

const app = express();
const port = process.env.PORT || 3000;

// Define paths for Express config
const publicDirectoryPath = path.join(__dirname, '../public');
const viewsPath = path.join(__dirname, '../templates/views');
const partialsPath = path.join(__dirname, '../templates/partials');

// Setup handlebars engine and views location
app.set('view engine', 'hbs');
app.set('views', viewsPath);
hbs.registerPartials(partialsPath);

// setup static directory to serve
app.use(express.static(publicDirectoryPath));

app.get('', (req, res) => {
    res.render('index', {
        title: 'Weather',
        name: 'Nano'
    });
});

app.post('/registerUser', (req, res) => {
    try {
        if (!req.header('token')) {
            return res.send({ error: 'Token not received!'});
        } else {
            var token = req.header('token');
            if (token !== '123123') {
                return res.send({ error: 'Wrong token!' });
            }
        }

        var user = req.body.user;
        var password = req.body.password;
    
        res.send({
            id: 12345,
            user,
            password
        });
        
    } catch (e) {
        res.send({ 'Error': e });
    }
});

app.get('/about', (req, res) => {
    res.render('about', {
        title: 'About me',
        name: 'Nano'
    });
});

app.get('/help', (req, res) => {
    res.render('help', {
        title: 'Help page',
        name: 'Nano',
        helpText: 'For more information, please contact us!'
    });
});

app.get('/weather', (req, res) => {
    if (!req.query.address) {
        return res.send({
            error: 'You must provide an address!'
        });
    }

    geocode(req.query.address, (error, { latitude, longitude, location } = {}) => {
        if (error) {
            return res.send({ error });
        }

        forecast(latitude, longitude, (error, forecastData) => {
            if (error) {
                return res.send({ error });
            }

            res.send({
                forecast: forecastData,
                location,
                address: req.query.address
            });
        });
    });
});

app.get('/products', (req, res) => {
    if (!req.query.search) {
        return res.send({
            error: 'You must provide a search term'
        });
    }

    console.log(req.query.search);
    res.send({
        products: []
    })
});

app.get('/help/*', (req, res) => {
    res.render('404', {
        title: 'Error 404!',
        name: 'Nano Reperger',
        errorMessage: 'Help article not found.'
    });
});

app.get('*' , (req, res) => {
    res.render('404', {
        title: 'Error 404!',
        name: 'Nano Reperger',
        errorMessage: 'Page not found.'
    });
});

app.listen(port, () => {
    console.log('Server is up on port ' + port);
});