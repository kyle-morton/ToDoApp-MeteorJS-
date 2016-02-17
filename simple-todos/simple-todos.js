Tasks = new Mongo.Collection("tasks");

if (Meteor.isClient) {
  // This code only runs on the client
  Template.body.helpers({
    tasks: function () {
      //sort by newest tasks
      return Tasks.find({}, {sort: {createdAt: -1}});
    }
  });
  
  Template.body.events({
    "submit .new-task": function(event){
      //prevent default browser form submit
      event.preventDefault();
      
      console.log("Event: " + event);
      
      //get value from form element
      var text = event.target.text.value;
      
      //insert task into MDB collection
      Tasks.insert({
        text: text,
        createdAt: new Date()
      });
      
      //clear form
      event.target.text.value = "";
      
    }
  });
  
  Template.task.events({
    "click .toggle-checked": function(){
      //set the checked property to the opposite of its current value
      Tasks.update(this._id, {
        $set: {checked: !this.checked}
      });
    },
    "click .delete": function(){
      Tasks.remove(this._id);
    }
  });
  
  
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}
