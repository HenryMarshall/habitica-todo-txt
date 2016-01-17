var request = require('request');
var options = require('./options');

function Habitica(credentials) {
  this.headers = {
    "x-api-key": credentials.apiKey,
    "x-api-user": credentials.userId
  }
}

Habitica.prototype.baseUrl = "https://habitica.com/api/v2";

Habitica.prototype.tasks = function(callback, task) {
  if (task === undefined) {
    request({
      url: this.baseUrl + "/user/tasks",
      headers: this.headers
    }, callback);
  }
}

var habit = new Habitica(options.habitica);
habit.tasks(function(err, resp, body) {
  if (err) throw err;
  console.log(resp.statusCode, body);
});
