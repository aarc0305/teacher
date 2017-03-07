var express = require('express');
var router = express.Router();
var passport=require('passport');

router.get('/signup', function(req, res, next) {
  var messages=req.flash('error');
  res.render('users/signup',{messages:messages,hasErrors:messages.length>0});
});
router.post('/signup',passport.authenticate('local-signup',{
  successRedirect:'/',
  failureRedirect:'/signup',
  failureFlash:true,

}));

router.get('/signin', function(req, res, next) {
  var messages=req.flash('error');
  //console.log(messages[1]);
    res.render('users/signin',{messages:messages,hasErrors:messages.length>0});
});

router.post('/signin',passport.authenticate('local-signin',{
  failureRedirect:'/signin',
  failureFlash:true,
}), function(req, res, next){
  if(req.session.oldUrl) {
    res.redirect(req.session.oldUrl);
  }
  else {
    console.log('首頁');
    res.redirect('/');
  }

});

router.get('/signout', function(req, res, next) {
  req.logout();
  res.redirect('/');
});

router.get('/delete',function(req,res,next){
    User.remove({}, function (err, resp) {
        if (err) throw err;
        console.log("success");
    });
});

module.exports = router;
