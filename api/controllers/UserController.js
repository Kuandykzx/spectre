/**
 * UserController
 *
 * @description :: Server-side logic for managing Users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	login: function(req,res){
		User.findOne({email:req.param('email')}).exec(function(err, user){
            if(err){
                res.send(500, {error: 'User not found!'});
            }
            req.session.me = user.id;
            req.session.name = user.name || user.email; 

            res.redirect('/');
        });	
	},

	signup: function (req,res) {
	User.create({
	  name: req.param('name'),
      email: req.param('email'),
      password: req.param('password'),
      isModerator: false,
      isAdmin: false
    }, function (err, user) {
      // res.negotiate() will determine if this is a validation error
      // or some kind of unexpected server error, then call `res.badRequest()`
      // or `res.serverError()` accordingly.
      if (err) return res.negotiate(err);

      // Go ahead and log this user in as well.
      // We do this by "remembering" the user in the session.
      // Subsequent requests from this user agent will have `req.session.me` set.
      req.session.me = user.id;
      req.session.name = user.name || user.email;

      // If this is not an HTML-wanting browser, e.g. AJAX/sockets/cURL/etc.,
      // send a 200 response letting the user agent know the signup was successful.
      if (req.wantsJSON) {
        return res.ok('Signup successful!');
      }

      // Otherwise if this is an HTML-wanting browser, redirect to /welcome.
      return res.redirect('/');
    });
	},

	logout: function(req,res){
		req.session.me = null;
		req.session.name = null;

    // If this is not an HTML-wanting browser, e.g. AJAX/sockets/cURL/etc.,
    // send a simple response letting the user agent know they were logged out
    // successfully.
    if (req.wantsJSON) {
      return res.ok('Logged out successfully!');
    }

    // Otherwise if this is an HTML-wanting browser, do a redirect.
    return res.redirect('/');
	},

	updateAdmin: function (req,res){
		User.findOne({id :req.body.id}).exec(function (err, user){
			if (err) return res.negotiate(err);
			user.isAdmin = req.body.isAdmin;
			user.save();
		});  
	},

	administration: function(req,res) {
		User.find().exec(function (err,users){
			if(err) res.negotiate(err);
			if (users.length === 0) return res.notFound();
			var updatedUsers = _.map(users, function(user){

        user = {
          id: user.id,
          name: user.name,
          email: user.email,
          isAdmin: user.isAdmin,
          isModerator: user.isModerator,
        };

        return user;
      });
		res.view('administration', {users:updatedUsers});
		})
	}

};

