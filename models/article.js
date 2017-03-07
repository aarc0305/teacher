var mongoose=require('mongoose');
var Schema=mongoose.Schema;

var bcrypt=require('bcrypt-nodejs');



var articleSchema=new Schema({
	title:{
		type:String,
		required:true
	},
	content:{
		type:String,
		required:true
	},
	author:{
		type:String
	},
	createdYear:{
		type:String
	},
	createdMonth:{
		type:String
	},
	createdDate:{
		type:String
	},
	createdDay:{
		type:String
	}
	

});


module.exports=mongoose.model('Article',articleSchema);