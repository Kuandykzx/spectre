module.exports = function(req, res, next) {

  // User is allowed, proceed to the next policy, 
  // or if this is the last policy, the controller
  if (req.session.me) {
    User.findOne({id: req.session.me}).exec(function (err, moderator){
	if(err)  {
		return res.negotiate(err);
	}
    if(moderator.isModerator) { 
    		return next();
    } else {
    	var postId = req.params.id;
    	Posts.findOne({id : postId}).exec(function (err, post){
    		if (err) return res.negotiate(err);
    		var author = moderator.name || moderator.email; 
    		if(author === post.author) {
    			return next();
    		} else return res.forbidden('he is not moderator');
    })
    }
});
  } else {
  	res.forbidden('not authorized');
  }

  // User is not allowed
  // (default res.forbidden() behavior can be overridden in `config/403.js`)
};