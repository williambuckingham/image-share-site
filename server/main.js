import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';

import '/lib/collection.js';




Meteor.startup(() => { 	
	if(Images.find().count() == 0) {
		for(var i=1; i<18; i++) {
			Images.insert(
    			{
      				img_src:"img_"+i+".jpg",
      				img_alt:"image number"+i
   				}
   			);
		}	
	}	
});
