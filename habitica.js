var request = require('request');
var Todo = require('./todo');
var options = require('./options');

function Habitica(credentials) {
  this.headers = {
    "x-api-key": credentials.apiKey,
    "x-api-user": credentials.userId
  }
}

Habitica.prototype.baseUrl = "https://habitica.com/api/v2";

Habitica.prototype.tasks = function(callback) {
  request({
    url: this.baseUrl + "/user/tasks",
    headers: this.headers
  }, callback);
}

Habitica.prototype.downloadTodos = function(callback) {
  this.tasks(function(err, resp, body) {
    if (err) throw err;
    var tasks = JSON.parse(body);
    // Create Todo instances for todos.
    // `tasks` also includes "rewards", "dailies", and "habits"
    var todos = tasks.reduce(function(todosObj, task) {
      if (task.type === "todo") {
        var todo = new Todo(task);
        todosObj.push(todo);
      }
      return todosObj;
    }, []);
    callback(todos);
  });
}

Habitica.prototype.createTodo = function(todo) {
  request({
    url: this.baseUrl + "/user/tasks",
    headers: this.headers,
    method: "POST",
    json: todo
  }, callback(err, resp, body));
}

Habitica.prototype.updatedTodos = function(time, callback) {
  this.downloadTodos(function(todos) {
    var updatedTodos = todos.filter(function(todo) {
      return todo.wasUpdatedSince(time);
    });
    callback(updatedTodos);
  });
}

module.exports = Habitica;
