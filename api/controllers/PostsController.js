/**
 * PostsController
 *
 * @description :: Server-side logic for managing Posts
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	list:function(req, res){
        Posts.find({}).exec(function(err, posts){
            if(err){
                res.send(500, {error: 'Database Error'});
            }
            res.view('list', {posts:posts});
        });
    },
    add: function(req, res){
        res.view('add');
    },
    create:function(req, res){
        var title = req.body.title;
        var body = req.body.body;
        User.findOne({id : req.session.me}).exec(function (err, user){
        	if (err) res.negotiate(err);

        	Posts.create({title:title, body:body, author: user.name || user.email}).exec(function(err){
            if(err){
                res.send(500, {error: 'Database Error'});
            }
            	res.redirect('/posts/list');
        		
        	});
    	});
    },

    delete: function(req, res){
        
        Posts.destroy({id:req.params.id}).exec(function(err){
            if(err){
                res.send(500, {error: 'Database Error'});
            }
            	res.redirect('/posts/list');
        });

        return false;
    },

    edit: function(req, res){
        Posts.findOne({id:req.params.id}).exec(function(err, post){
            if(err){
            	console.log(err);
                res.send(500, {error: 'Database Error'});
            }
            res.view('edit', {post:post});
        });
    },
    update: function(req, res){
        var title = req.body.title;
        var body = req.body.body;

        Posts.update({id: req.params.id},{title:title, body:body}).exec(function(err){
            if(err){
                res.send(500, {error: 'Database Error'});
            }

            res.redirect('/posts/list');
        });

        return false;
    }
};

