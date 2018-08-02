import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { Session } from 'meteor/session';

import './main.html';
import '/lib/collection.js';

Router.configure({
	layoutTemplate: 'ApplicationLayout'
});

Router.route('/', function () {
  this.render('welcome', {
  	to:"main"
  });
});

Router.route('/images', function () {
  this.render('navbar', {
  	to:"navbar"
  });
  this.render('images', {
  	to:"main"
  });
});

Router.route('/image/:_id', function () {
  this.render('navbar', {
  	to:"navbar"
  });
  this.render('image', {
  	to:"main",
  	data: function(){
  		return Images.findOne({_id:this.params._id});
  	}
  });
});




Session.set("imageLimit", 8);
lastScrollTop = 0;

$(window).scroll(function(event){
	if($(window).scrollTop() + $(window).height() > $(document).height() - 100) {
		var scrollTop = $(this).scrollTop();
		if(scrollTop > lastScrollTop) {
			Session.set("imageLimit", Session.get("imageLimit") + 4);
		} 
		lastScrollTop = scrollTop;
	}
});




Accounts.ui.config({
	passwordSignupFields: 'USERNAME_AND_EMAIL'
});




Template.images.helpers({
	images:function(){
		if(Session.get("userFilter")) {
			console.log("returned true")
			return Images.find({createdBy:Session.get("userFilter")}, {sort:{createdOn:-1, rating:-1}});
		} else {
			return Images.find({}, {sort:{createdOn:-1, rating:-1}, limit:Session.get("imageLimit")});
		}	
	},

	filtering_images:function(){
		if(Session.get("userFilter")) {
			return true;
		}
		return false;
	},

	getFilterUser:function(){
		if(Session.get("userFilter")) {
			var user = Meteor.users.findOne({_id:Session.get("userFilter")});
			return user.username;
		}
		return false;
	},
	
	getUser:function(user_id){
		var user = Meteor.users.findOne({_id:user_id});
		if(user) {
			return user.username;
		}
		return "anon";
	}
});




Template.body.helpers({username: function() {
	if(Meteor.user()) {
		return Meteor.user().username;
	}
	return "anonymous internet user";
}
});




Template.images.events({
	'click .js-del-image': function(event){
		var image_id = this._id;
		$("#"+image_id).hide('slow', function() {
			Images.remove({"_id": image_id});
		});	
	},
	'click .js-rate-image': function(event) {
		var rating = $(event.currentTarget).data("userrating");
		var image_id = this.id;

		Images.update({_id:image_id}, {$set: {rating:rating}});
	},
	'click .js-show-image-form':function(event) {
		$("#image_add_form").modal('show');
	},
	'click .js-set-image-filter':function(event) {
		Session.set("userFilter", this.createdBy);
	},
	'click .js-unset-image-filter':function(event) {
		Session.set("userFilter", undefined);
	}
});




Template.image_add_form.events({
	'submit.js-add-image': function(event){
		var img_src, img_alt;
		img_src = event.target.img_src.value;
		img_alt = event.target.img_alt.value;
		if(Meteor.user()) {
			Images.insert(
				{
					img_src:img_src,
					img_alt:img_alt,
					createdOn:new Date(),
					createdBy:Meteor.user()._id,
				}
			);
		}
		$("#image_add_form").modal('dismiss');
		return false;
	}
});






