var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/test');

var UserSchema = mongoose.Schema({
    username: String,
    password: String,
    email: String
});

var EventSchema = mongoose.Schema({
  host: String,
  title: String,
  date: String,
  time: String,
  graceperiod: String,
  location: String,
  guests: [{name: String, status: String}]
})

var FriendshipSchema = mongoose.Schema({
  userId: String,
  friends: [String]
})

module.exports = {
  users: mongoose.model('UserInfo', UserSchema),
  events: mongoose.model('EventInfo', EventSchema),
  friendships: mongoose.model('FriendshipInfo', FriendshipSchema)
}
