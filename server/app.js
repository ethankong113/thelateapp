var http = require('http');
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var path = require('path');
var User = require('./db/controller').users
var Event = require('./db/controller').events
var Friendship = require('./db/controller').friendships

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "../bower_components")));
app.use(express.static(path.join(__dirname, "../client")));

var port = process.env.PORT || 8080;
var currentUser = {
  username: "heyworld",
  userId: "57450fab78822a2c23e13f79"
}

app.get('/', function(req,res){
  res.sendFile(path.join(__dirname, "../client/login/login.html"))
})

app.post('/login', function(req,res) {
  User.findOne({'username': req.body.username},
      '_id password', function(err, loginUser) {
        if (err) {
          console.log(err)
        } else {
          if (loginUser.password != req.body.password) {
            console.log('Password is invalid.')
            res.redirect('/')
          } else {
            currentUser.username = req.body.username
            currentUser.userId = loginUser._id
            res.redirect('/main')
          }
        }
      })
})

app.post('/signup', function(req,res){
  var newUser = new User()
  newUser.username = req.body.username
  newUser.password = req.body.password
  newUser.email = req.body.email
  newUser.save(function(err, results){
    if (err){
      console.log(err)
      res.redirect('/')
    } else {
      console.log("Saved: " + results)
      res.redirect('/')
    }
  })
})

app.get('/main', function(req, res){
  res.sendFile(path.join(__dirname, "../client/main/index.html"))
})

app.post('/createevent', function(req,res){
  var newEvent = new Event()
  newEvent.host = currentUser.userId
  newEvent.title = req.body.title
  newEvent.date = req.body.date
  newEvent.time = req.body.time
  newEvent.graceperiod = req.body.graceperiod
  newEvent.location = req.body.location
  for (var i = 0; i <= req.body.guests.length; i++){
    //We are using less than or equal to because we need an extra slot to add in the host himself.
    if (req.body.guests[i] == req.body.guests[req.body.guests.length]) {
      newEvent.guests[i] = {name: currentUser.username, status: 'Coming'}
    } else {
      newEvent.guests[i] = {name: req.body.guests[i].guest, status: req.body.guests[i].status}
    }
  }
  newEvent.save(function(err, results) {
    if (err) {
      console.log(err)
      res.json(err)
    } else {
      console.log("Saved: " + results)
      res.json("Database has saved the event successfully.")
    }
  })
})

app.post('/checkin', function(req,res){
  Event.findOne({$and:[{'_id': req.body.eventId}]},
  'guests', function(err, data){
    for(var i=0; i< data.guests.length; i++){
      if(currentUser.username == data.guests[i].name){
        Event.update({'guests._id': data.guests[i]._id}, {
          'guests.$.status': req.body.status
        }, function(err, results){
          if (err) {
            console.log(err)
          } else {
            res.send(currentUser.username)
          }
        })
      }
    }
  })
})

app.get('/geteventlist', function(req,res) {
  console.log("We have received a request from frontend")
  Event.find({'host': currentUser.userId},
  'title data time location _id', function(err, data){
    if (err) {
      console.log(err)
    } else {
      console.log(data)
      res.json(data)
    }
  })
})

app.get('/searchfriends', function(req,res) {
  console.log("We have received a requst from frontend")
  User.find({'username': {'$regex': req.query.keyword}},
  'username', function(err, data) {
      if(err) {
        console.log(err)
      } else {
        console.log(data)
        res.json(data)
      }
  })
})

app.get('/getfriends', function(req,res) {
  console.log("We have received a request from frontend")
  Friendship.findOne({'userId': currentUser.userId}, 'friends', function(err, data){
    if (err) {
      console.log(err)
    } else {
      console.log(data)
      var friendList = []
      for (var i = 0; i < data.friends.length; i++) {
        if (data.friends[i] != data.friends[data.friends.length - 1]) {
          User.findOne({'_id': data.friends[i]}, 'username', function(err, results) {
            friendList.push(results.username)
          })
        } else {
          User.findOne({'_id': data.friends[i]}, 'username', function(err, results) {
            friendList.push(results.username)
            res.json(friendList)
          })
        }
      }
    }
  })
})

app.post('/addfriend', function(req,res) {
  Friendship.findOne({'userId': currentUser.userId}, 'friends', function(err, data){
    if (err) {
      console.log(err)
    } else {
      if (data) {
        console.log("This is returing the list of friends before we loop it through: " + data)
        for (var i=0; i<data.friends.length; i++) {
          if (data.friends[i] == req.body.friendId) {
            console.log("We found your friendship")
            res.json(data.friends[i])
          } else if (data.friends[i] == data.friends[data.friends.length]) {
            console.log("We didn't find a match")
            console.log("And so we are creating an entry.")
            Friendship.findOne({'userId': currentUser.userId},
            'friends', function(err, update) {
              if (err) {
                console.log(err)
              } else {
                console.log(update)
                res.json(update)
              }
            })
          }
        }
      } else {
        var newFriendship = new Friendship()
        newFriendship.userId = currentUser.userId
        newFriendship.friends[0] = req.body.friendId
        newFriendship.save(function(err, data) {
          if (err) {
            console.log(err)
          } else {
            console.log("We made a new friend")
            console.log(data)
          }
        })
      }
    }
  })
})

app.get('/eventdetail/:id', function(req,res){
  console.log(req.params.id)
  Event.findOne({'_id': req.params.id},
  'host title date time graceperiod location guests', function(err, data){
    if (err) {
      console.log(err)
      res.send(err);
    } else {
      console.log("Data retrieved successfully.")
      res.json(data);
    }
  })
})

app.listen(port, function(){
  console.log("Server is running on " + port);
});
