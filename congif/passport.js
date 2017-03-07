var User=require('../models/user');
var passport=require('passport');
var LocalStrategy=require('passport-local').Strategy;

passport.serializeUser(function(user,done){
	done(null,user.id);
});
passport.deserializeUser(function(id,done){
	User.findById(id,function(err,user){
		done(err,user);
	});
});

passport.use('local-signup',new LocalStrategy({
	usernameField: 'email',
	passwordField: 'password',
	passReqToCallback: true
},function(req,email,password,done){
	req.checkBody('email','這不是email喔').isEmail();
	req.checkBody('password','密碼太短囉').isLength({min:4});
	var errors=req.validationErrors();
	if(errors){
	    var messages=[];
	    errors.forEach(function(error){
	          messages.push(error['msg']);
	    });
	    console.log(messages);
	    return done(null,false,req.flash('error',messages));
	    
	}
	User.findOne({'email':email},function(err,user){
		if(err){
			console.log('there is something wrong');
			return done(null,false);
		} 
		if(user){
			return done(null,false,req.flash('error',['email已經被用過囉']));
		}  
		var newUser=new User();
      	newUser.email=email;
      	if(password!==req.body.confirm_password){
      		return done(null,false,req.flash('error',['password要和confirm password一樣']));
      	}
      	newUser.password=newUser.encryptPassword(password);
      	newUser.save(function(err,user){
      		if(err) {
      			console.log('there is something wrong when creating');
      			return done(err);
      		}
            console.log('success');      
      		return done(null,user);
      	});
	});
}));

passport.use('local-signin',new LocalStrategy({
	usernameField: 'email',
	passwordField: 'password',
	passReqToCallback: true
},function(req,email,password,done){
 	req.checkBody('email','這不是email喔').isEmail();
	req.checkBody('password','密碼太短囉').isLength({min:4});
	var errors=req.validationErrors();
	if(errors){
	    var messages=[];
	    errors.forEach(function(error){
	          messages.push(error['msg']);
	    });
	    console.log(messages);
	    return done(null,false,req.flash('error',messages));
	    

	}
	User.findOne({'email':email},function(err,user){
		if(err){
			console.log('there is something wrong');
			return done(err);
		} 
		if(!user){
			return done(null,false,req.flash('error',['email沒被註冊過']));
		}
		if(!user.validPassword(password)){
			  return done(null,false,req.flash('error',['密碼錯了喔']));
        }  
        console.log("signin success");
		return done(null,user);
	});
}));
