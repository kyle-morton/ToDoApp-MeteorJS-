Tasks = new Mongo.Collection("tasks");

if (Meteor.isClient) {
  // This code only runs on the client
  Template.body.helpers({
    tasks: function () {
      if (Session.get("hideCompleted")) {
        // If hide completed is checked, filter tasks
        return Tasks.find({checked: {$ne: true}}, {sort: {createdAt: -1}});
      } else {
        // Otherwise, return all of the tasks
        return Tasks.find({}, {sort: {createdAt: -1}});
      }
    },
    hideCompleted: function () {
      return Session.get("hideCompleted");
    },
    incompleteCount: function(){
      return Tasks.find({checked: {$ne: true}}).count();
    }
  });
  
  Template.body.events({
    "submit .new-task": function(event){
      //prevent default browser form submit
      event.preventDefault();
      
      console.log("Event: " + event);
      
      //get value from form element
      var text = event.target.text.value;
      
      //insert task into collection
      Meteor.call("addTask", text);
      
      //clear form
      event.target.text.value = ""; 
    },
    "change .hide-completed input": function(event){
      Session.set("hideCompleted", event.target.checked);
    }
  });
  
  Template.task.events({
    "click .toggle-checked": function(){
        //set the checked property to the opposite of its current value
        Meteor.call("setChecked", this._id, !this.checked);
    },
    "click .delete": function(){
        Meteor.call("deleteTask", this._id);
    }
  });
  
  //use usernames instead of emails
  Accounts.ui.config({
    passwordSignupFields: "USERNAME_ONLY"
  });
}

//define method below to check if user logged in
//and allow CRUD if they are
Meteor.methods({
  addTask: function(text){
      //make sure user logged in
      if (!Meteor.userId()){
        throw new Meteor.Error("Not-Authorized!");
      }
      
      Tasks.insert({
        text: text,
        createdAt: new Date(),
        owner: Meteor.userId(), //_id of logged in user
        username: Meteor.user().username
      });
  },
  deleteTask: function(taskId){
    Tasks.remove(taskId);
  },
  setChecked: function (taskId, setChecked) {
    Tasks.update(taskId, {$set: {checked: setChecked}}); 
  }
});


if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}
