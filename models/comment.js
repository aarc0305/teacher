var mongoose=require('mongoose');
var Schema=mongoose.Schema;

var commentSchema=new Schema({
	content_of_comment:{
		type:String,
		required:true
	},
	articleId:{
		type:String,
		required:true
	},
	user_of_comment:{
		type:String,
	}
	

});

module.exports=mongoose.model('Comment',commentSchema);