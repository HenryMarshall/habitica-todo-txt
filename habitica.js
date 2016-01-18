var request = require('request');
var options = require('./options');

function Habitica(credentials) {
  this.headers = {
    "x-api-key": credentials.apiKey,
    "x-api-user": credentials.userId
  }
}

Habitica.prototype.baseUrl = "https://habitica.com/api/v2";

// `tasks` also includes "rewards"
Habitica.prototype.tasks = function(callback) {
  request({
    url: this.baseUrl + "/user/tasks",
    headers: this.headers
  }, callback);
}

Habitica.prototype.todos = function(callback) {
  this.tasks(function(err, resp, body) {
    if (err) throw err;
    var tasks = JSON.parse(body);
    var todos = tasks.filter(function(task) {
      return task.type === "todo";
    });
    callback(todos);
  });
}

module.exports = Habitica;

var habit = new Habitica(options.habitica);
habit.todos(function(todos) {
  console.log(todos);
})
//habit.tasks(function(err, resp, body) {
//  if (err) throw err;
//  console.log(resp.statusCode, body);
//});
