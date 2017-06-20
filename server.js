const express = require('express')
const app = express()
var weather = require('weather-js');
var bodyParser = require('body-parser')

var fs = require('fs');
app.set('view engine', 'pug');
app.use(express.static('public'));
app.use(express.static('node_modules'));
app.use(bodyParser.json()); // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({ // to support URL-encoded bodies
    extended: true
}));

function saveFile(sFileName, sData) {
    fs.writeFile(sFileName, JSON.stringify(sData), (err) => {
        if (err) 
            throw err;
        console.log(sData);
    });
}
app
    .get('/', function (req, res) { //Render the main index with pug
        res.render('index')
    })
app.get('/api', function (req, res) {
    //Render the main index with pug
    fs
        .readFile('message.txt', 'utf8', function (err, data) {
            if (err) {
                return console.log(err);
            }
            res.json(data);
        });
})
app.post('/api', function (req, res) { //Render the main index with pug
    saveFile('message.txt', JSON.stringify(req.body));
})
app.post('/post', function (req, res) { //Render the main index with pug
    res.send('This is a post method');
})
app.get('/weather', function (req, res) {
    //Create local weather api from node
    weather
        .find({
            search: req.query.city,
            degreeType: 'F'
        }, function (err, result) {
            if (err) 
                console.log(err);
            res.json(JSON.stringify(result, null, 2));
        });
})
app.listen(3333, function () {
    console.log('Example app listening on port 3333!')
})
// playing with express and node var bodyParser = require('body-parser'); var
// request = require('request'); app.use(bodyParser.urlencoded({ extended: false
// }));   //add this line app.use(bodyParser.json());  //add this line
// app.get('/loadurl', function (req, res) {    request(req.query.site, function
// (error, response, body) {        res.send(body);    }); })