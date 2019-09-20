export const Time = new Mongo.Collection("Time");

if (Meteor.isServer) {
    Meteor.methods({
        UpdateTime() {
            Time.upsert('currentTime', { $set: { time: new Date() } });
        },
    });

    Meteor.publish('Time', function () {
        return Time.find({});
    });
    
    Meteor.startup(() => {
      // Update the current time
      Meteor.call('UpdateTime');
      // Add a new doc on each start.
      Time.insert({ time: new Date() });
      // Print the current time from the database
      console.log(`The time is now ${Time.findOne().time}`);
    });
}
