// includes classes it requires in this case its express and mongoose
var express = require('express');
var mongoose = require('mongoose');

// ---
// ---
// ---
// Create a new mongoose.Schema object that contains the name, user and pass
var UserSchema = new mongoose.Schema({
	name: String,
	user: String,
	pass: String
});

// ---
// With the mongoose.schema object UserSchema we create a data model called User
var User = mongoose.model('User', UserSchema);

// ---
// Iterate thru the list of array of arrays to create users for this instance.
[['Administrator', 'admin', 'admin'], ['User', 'user', 'user'], ['Jules', 'bad', 'guy']].forEach(function (cred) {
	var instance = new User();

	// ---

	instance.name = cred[0];
	instance.user = cred[1];
	instance.pass = cred[2];

	// ---

	instance.save();
});

// ---
// ---
// ---
// Now we create the view of the application by initializing a express object
var app = express();

// ---
// sets the views to the current directory
app.set('views', __dirname);
// sets the view engine to jade
app.set('view engine', 'jade');

// ---
// Static route to the actual directory containing the js file
app.use("/angular.js", express.static(__dirname + "/node_modules/angular/lib/angular.js"));
// now we include a new class body-parser to parse incoming traffic
app.use(require('body-parser').json());

// ---
// Routes HTTP GET requests to the specified path with the specified callback functions. In this case it will look for index.jade
app.get('/', function(req, res) {
	res.render('index', {});
});
// Routes HTTP POST requests to the specified path with the specified callback functions. in this case it will look for index.jade and pass the message depending on the validation.
app.post('/', function (req, res) {
    // Attempts to find a user with given data
    User.findOne({ user: req.body.user, pass: req.body.pass }, function (err, user) {
        // If an error occures it returns a 500 status with an error message
		if (err) {
			return res.status(500).send({message: err.message});
		}

		// ---
        // if no user is found with the data given it returns a 500 status with the message "Sorry!"
		if (!user) {
			return res.status(500).send({message: 'Sorry!'});
		}

		// ---
        // if no problems a 200 status code is returned with a messages saying welcome back {$username}
		return res.status(200).send({message: 'Welcome back ' + user.name + '!!!'});
	});
});

// ---
// start the server to listen on port 49090 while mongoose connects to the database and will print out the port its listening on.
var server = app.listen(49090, function () {
	mongoose.connect('mongodb://localhost/acme-no-login');

	// ---

	console.log('listening on port %d', server.address().port);
});

// ---
