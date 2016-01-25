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

Habitica.prototype.todos = function(callback) {
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

Habitica.prototype.updatedTodos = function(time, callback) {
  this.todos(function(todos) {
    var updatedTodos = todos.filter(function(todo) {
      return todo.wasUpdatedSince(time);
    });
    callback(updatedTodos);
  });
}

module.exports = Habitica;

var habit = new Habitica(options.habitica);
habit.updatedTodos(new Date("2016-01-18"), function(todos) {
  todos.forEach(function(todo) {
    console.log(todo);
  })
});
