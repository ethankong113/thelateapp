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
  date: Date,
  time: String,
  graceperiod: String,
  location: String,
  guests: [{name: String, status: String}]
})

module.exports = {
  users: mongoose.model('Userinfo', UserSchema),
  events: mongoose.model('EventInfo', EventSchema)
}
