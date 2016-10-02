// server.js

// BASE SETUP
var mongoose   = require('mongoose');       // orm for working with mondodb
mongoose.connect('mongodb://<dbuser>:<dbpassword>@ds047666.mlab.com:47666/iamteam');
var Crumb      = require('./app/models/crumb'); // Our schema model

var express    = require('express');        // call express= Our node.js framework
var bb = require('express-busboy');         // call express-busboy= file upload parsing module
var app        = express();                 // create our app as an instance of express

//apply express-busboy settings on app instance
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

var port = process.env.PORT || 8080;

// ROUTING OUR HTML============
app.get('/', function(req, res) {
        res.sendfile(__dirname + '/app/index.html');
});

app.use("/uploads", express.static(__dirname + '/uploads'));
// ============================

// ROUTES FOR OUR API
// =============================================================================
var router = express.Router();              // get an instance of the express Router

// Router parts run in the order listed.

// middleware for all requests
router.use(function(req, res, next) {
    // console.log('Something is happening.');
    next(); // make sure we go to the next routes and don't stop here
});

// accessed at GET http://localhost:8080/api
router.get('/', function(req, res) {
    res.json({ message: 'Welcome to the IAM team api!' });
});

// more routes for our API will happen here
// ----------------------------------------------------
//routes ending in 'crumbs'
router.route('/crumbs')

// POST http://localhost:8080/api/crumbs for creating crumbs
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
    // accessed at GET http://localhost:8080/api/crumbs
    .get(function(req, res) {
        Crumb.find(function(err, crumbs) {
            if (err)
            res.send(err);

            res.json(crumbs);
        });
    });

    router.route('/crumbs/:crumb_id')

    // GET http://localhost:8080/api/crumb/:crumb_id crumb by id
    .get(function(req, res) {
        Crumb.findById(req.params.crumb_id, function(err, crumb) {
            if (err)
                res.send(err);

            res.json(crumb);
        });
    })

    .put(function(req, res) {
            // use crumb model to find the specific crumb
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

        // accessed at DELETE http://localhost:8080/api/crumbs/:crumb_id
        .delete(function(req, res) {
            Crumb.remove({
                _id: req.params.crumb_id
            }, function(err, crumb) {
                if (err)
                    res.send(err);

                res.json({ message: 'Crumb deleted' });
            });
        });

// REGISTER OUR ROUTES =========================
// all of our api routes will be prefixed with /api/
app.use('/api', router);

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Listening on ' + port);
// =========================================================
