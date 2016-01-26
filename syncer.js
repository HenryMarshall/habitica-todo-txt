// options are values for dev purposes.
var options = require('./options');
var oldTxtTodos = options.txt.oldTodos

var Dropbox = require('./dropbox');
var Habitica = require('./habitica');
var txtDiffer = require("./txtDiffer");
var habMatcher = require("./habMatcher");
var todoFactory = require("./todoFactory");

var drop = new Dropbox("/todo/api_test.todo.txt", options.access_token);
var hab = new Habitica(options.habitica);

var data = {
  newTxtTodos: options.txt.newTodos,
  oldTxtTodos: options.txt.oldTodos,
  habTodos: options.habitica.todos
}
sync(data)

function sync(data) {
  // TODO dateCompleted should use the metadata from the last write to dropbox.
  var dropboxDate = new Date().toISOString();

  var updatedTodos = txtDiffer(data.oldTxtTodos, data.newTxtTodos)
  var overwritten = [];

  updatedTodos.changed.forEach(todo => {
    var habTodo = habMatcher(todo, data.habTodos);
    if (habTodo) {
      if (todo.isCompleted) {
        habTodo.values.dateCompleted = dropboxDate;
      }
      else {
        delete habTodo.values.dateCompleted;
      }
      habTodo.values.completed = todo.isCompleted;
      console.log("updated: " + JSON.stringify(habTodo, null, 2));
      hab.updateTodo(habTodo);
      overwritten.push(habTodo.id);
    }
    // Even if there were only changes on the dropbox side of things, if no
    // match can be found on Habitica, we need to create the todo from scratch.
    else {
      updatedTodos.created.push(todo);
    }
  });

  updatedTodos.deleted.forEach(todo => {
    var habTodo = habMatcher(todo, data.habTodos);
    if (habTodo) {
      hab.deleteTodo(habTodo);
      console.log("deleted: " + JSON.stringify(habTodo, null, 2));
      overwritten.push(habTodo.id);
    }
  });

  updatedTodos.created.forEach(todo => {
    var habTodo = todoFactory(todo.text, todo.isCompleted, dropboxDate);
    console.log("created: " + JSON.stringify(habTodo, null, 2));
    hab.createTodo(habTodo);
  });



}

function fetchNewTodos(callback) {
  var data = {
    newTxtTodos: null,
    habTodos: null
  };
  var count = Object.keys(data).length;

  drop.downloadTodos(todos => {
    data.newTxtTodos = todos;
    callbackOnCompletion()
  });
  hab.downloadTodos(todos => {
    data.habTodos = todos;
    callbackOnCompletion()
  });

  function callbackOnCompletion() {
    if (--count === 0) {
      callback(data);
    }
  }
}
