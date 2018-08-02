import { Mongo } from 'meteor/mongo';

Images = new Mongo.Collection("images");

Images.allow({
	insert:function(userId, doc) {
		if(Meteor.user()) {
			//Force image to be owned by user
			doc.createdBy = userId;
			if (userId != doc.createdBy) {
				return false;
			} else {
				return true;
			}
		} else {
			return false;
		}	
	},
	remove:function(userId, doc) {
		return false;
	}

})
