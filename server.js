var express = require('express'),
    app = express(),
    port = process.env.PORT || 3000,
    mongoose = require('mongoose'),
    cors = require('cors');
    bodyParser = require('body-parser');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/room_management');

app.use(bodyParser.urlencoded({limit: '50mb', extended: false }));
app.use(bodyParser.json({limit: '50mb'}));

app.use(cors());

var userRoutes = require('./api/routes/userRoutes');
var roomRoutes = require('./api/routes/roomRoutes');
var orderRoutes = require('./api/routes/orderRoutes');

userRoutes(app);
roomRoutes(app);
orderRoutes(app);

app.listen(port);

console.log('RESTful API server started on: ' + port);