// server.js

// BASE SETUP
var mongoose   = require('mongoose');
mongoose.connect('mongodb://test:iamtest@ds047666.mlab.com:47666/iamteam');
var Crumb     = require('./app/models/crumb');
// =============================================================================

// call the packages we need
var express    = require('express');        // call express
var bb = require('express-busboy');
// var multer     = require('multer');
// var bodyParser = require('body-parser');
var app        = express();                 // define our app using express
//busboy settings on app
bb.extend(app, {
    upload: true,
    path: './uploads',
    allowedPath: /./,
    mimeTypeLimit: [
    'text/x-markdown',
    'application/javascript',
    'image/jpeg',
    'image/png'
]
});
var fs         = require('fs');



// configure app to use bodyParser()
// this will let us get the data from a POST
// app.use(bodyParser.urlencoded({ extended: true }));
// app.use(bodyParser.json());




var port = process.env.PORT || 8080;        // set our port

// ROUTING OUR HTML============
app.get('/', function(req, res) {
        res.sendfile(__dirname + '/index.html');
});

app.use("/uploads", express.static(__dirname + '/uploads'));
// ============================

// ROUTES FOR OUR API
// =============================================================================
var router = express.Router();              // get an instance of the express Router

// Order that we define router parts is IMPORTANT. They run in the order listed.

// middleware to use for all requests
router.use(function(req, res, next) {
    // do logging
    console.log('Something is happening.');
    next(); // make sure we go to the next routes and don't stop here
});

// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/', function(req, res) {
    res.json({ message: 'Welcome to the IAM team api!' });
});

// more routes for our API will happen here
// ----------------------------------------------------
//routes ending in 'crumbs'
router.route('/crumbs')

// create a crumb (accessed at POST http://localhost:8080/api/crumbs)
.post(function(req, res) {

    var crumb = new Crumb();      // create a new instance of the Crumb model
    console.log(req);
    crumb.name = req.body.name;  // set the crumbs name (comes from the request)
    crumb.course = req.body.course;
    // crumb.img.data = fs.readFileSync(req.files.image.file);
    crumb.img.contentType = req.files.image.mimetype;
    crumb.img.path = req.files.image.file;
    // save the crumb and check for errors
    crumb.save(function(err) {
        if (err)
        res.send(err);

        res.json({ message: 'Crumb created!' });
    })
})
    // get all the crumbs (accessed at GET http://localhost:8080/api/crumbs)
    .get(function(req, res) {
        Crumb.find(function(err, crumbs) {
            if (err)
            res.send(err);

            res.json(crumbs);
        });
    });

    router.route('/crumbs/:crumb_id')

    // get the crumb with that id (accessed at GET http://localhost:8080/api/crumb/:crumb_id)
    .get(function(req, res) {
        Crumb.findById(req.params.crumb_id, function(err, crumb) {
            if (err)
                res.send(err);

            res.json(crumb);
        });
    })

    .put(function(req, res) {

            // use our crumb model to find the crumb we want
            Crumb.findById(req.params.crumb_id, function(err, crumb) {

                if (err)
                    res.send(err);

                crumb.name = req.body.name;  // update the crumbs info
                crumb.course = req.body.course;
                // save the crumb
                crumb.save(function(err) {
                    if (err)
                        res.send(err);

                    res.json({ message: 'Crumb updated!' });
                });
            });
        })

        // delete the crumb with this id (accessed at DELETE http://localhost:8080/api/crumbs/:crumb_id)
        .delete(function(req, res) {
            Crumb.remove({
                _id: req.params.crumb_id
            }, function(err, crumb) {
                if (err)
                    res.send(err);

                res.json({ message: 'Crumb deleted' });
            });
        });



// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', router);

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Magic happens on port ' + port);
// =========================================================
