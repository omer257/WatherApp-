const express = require('express')
const app = express()
var weather = require('weather-js');

app.use(express.static('public'));

app.use(express.static('node_modules'));


app.get('/weather', function (req, res) {
    weather.find({
        search: req.query.city,
        degreeType: 'F'
    }, function (err, result) {
        if (err) console.log(err);
        console.log(JSON.stringify(result, null, 2));
        res.send(JSON.stringify(result, null, 2));
    });

})

app.get('/dog', function (req, res) {
    res.send(req.query.city);
})

app.listen(3000, function () {
    console.log('Example app listening on port 3000!')
})
