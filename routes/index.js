var express = require('express');
var router = express.Router();
var passport=require('passport');
var User=require('../models/user');
var Article=require('../models/article');
var Comment=require('../models/comment');


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Welcome to Distributed System and Network Lab' });
});
router.get('/professor', function(req, res, next) {
  res.render('professor', { title: 'Express' });
});
router.get('/research', function(req, res, next) {
  res.render('research', { title: 'Express' });
});
router.get('/members', function(req, res, next) {
  res.render('members', { title: 'Express' });
});

router.get('/chatroom', isLoggedIn, function(req, res, next) {
  req.session.oldUrl=null;

  Article.find(function(err,articles){
    console.log('進來了');
    if(err){
      console.log('something wrong');
    }
    //console.log(articles.length);
    if(articles.length===0){
      console.log('沒有文章');
    }
    console.log('有文章');
    articles=articles.reverse();
    res.render('chatroom', { title: '討論區', articles: articles});
  });
  
});
//使用者註冊、登入、登出

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


//討論區

router.get('/discussion_new', function(req, res, next) {
  res.render('discussion/new');
});

router.post('/discussion_create', function(req, res, next) {
  var title=req.body.title;
  var content=req.body.content;
  
  var newArticle=new Article();
  newArticle.title=title;
  newArticle.content=content;
  var date=new Date();
  var days=["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"]
  newArticle.createdYear=date.getFullYear();
  newArticle.createdMonth=date.getMonth()+1;
  newArticle.createdDate=date.getDate();
  newArticle.createdDay=days[date.getDay()];
  newArticle.save(function(err,article){
    if(err){
      console.log('無法發布文章');
      return;
    }
    console.log('成功發布');
  });
  res.redirect('/chatroom');
  

});

router.get('/discussion_delete',function(req,res,next){
    Article.remove({}, function (err, resp) {
        if (err) throw err;
        console.log("success");
    });
    Comment.remove({}, function (err, resp) {
        if (err) throw err;
        console.log("success");
    });
});

router.get('/discussion/:id',function(req,res,next){
    var articleId=req.params.id;
    Article.findById(articleId,function(err,article){
      if(err){
        console.log(err);
        console.log('找文章發生錯誤');
        return;
      }
      if(!article){
        console.log('找不到文章');
        return;
      }
      Comment.find({articleId:articleId},function(err,comments){
        if(err){
          console.log('找留言發生錯誤');
          return;
        }
        comments=comments.reverse();
        res.render('discussion/show',{
          article:article,
          comments:comments
        });
      });
      

    });
});

//討論區留言版
router.post('/comment_create',function(req,res,next){
    var articleId=req.body.article_id;
    var content_of_comment=req.body.content_of_comment;
    var user_of_comment=req.body.user_of_comment;
    console.log(articleId);

    var newComment=new Comment();
    newComment.user_of_comment=user_of_comment;
    newComment.content_of_comment=content_of_comment;
    newComment.articleId=articleId
    newComment.save(function(err,comment){
      if(err){
        console.log('無法留言');
        return;
      }
      console.log('成功留言');
      res.redirect('/discussion/'+articleId);
    });

    
});

/*router.post('/comment_create',function(req,res,next){
    var articleId=req.body.article_id;
    console.log(articleId);
    var content_of_comment=req.body.content_of_comment;
    var user_of_comment=req.body.user_of_comment;
    Article.findById(articleId,function(err,article){
      if(err){
        console.log('找文章發生錯誤');
        return;
      }
      if(!article){
        console.log('找不到文章');
        return;
      }
      article.comment.push({
        content_of_comment:content_of_comment,
        user_of_comment:user_of_comment
      });
      console.log(article.comment);
      article.update({comment:article.comment}, function(err, article){
        if(err){
          console.log('無法留言');
          return;
        }
        console.log('成功留言');
        
      });
      res.redirect('/'+articleId);

    });
});*/

function isLoggedIn(req,res,next){
  
  if(req.isAuthenticated()){
      return next();
  }
  req.session.oldUrl=req.url;
  console.log(req.session.oldUrl);
  res.redirect('/signin');

}

module.exports = router;


