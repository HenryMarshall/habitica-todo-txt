// options are values for dev purposes.
var options = require('./options');
var oldTxtTodos = options.txt.oldTodos

var Dropbox = require('./dropbox');
var Habitica = require('./habitica');
var txtDiffer = require("./txtDiffer");

var drop = new Dropbox("/todo/api_test.todo.txt", options.access_token);
var hab = new Habitica(options.habitica);

var data = {
  newTxtTodos: options.txt.newTodos,
  oldTxtTodos: options.txt.oldTodos,
  habTodos: options.habitica.todos
}
sync(data)

function sync(data) {
  var updatedTodos = txtDiffer(data.oldTxtTodos, data.newTxtTodos)
  // TODO: Habitica.createTodo
  updatedTodos.created.forEach(todo => Habitica.createTodo);

  var overwritten = [];

  // TODO dateCompleted should use the metadata from the last write to dropbox.
  var dateCompleted = new Date().toISOString();
  updatedTodos.changed.forEach(todo => {
    // TODO findHabTodo
    var habTodo = findHabTodo(todo, data.habTodos)
    if (todo.isCompleted) {
      habTodo.dateCompleted = dateCompleted;
    }
    else {
      delete existingHabTodo.dateCompleted;
    }
    // TODO Habitica.updateTodo
    Habitica.updateTodo(habTodo);
    overwritten.push(habTodo.id);
  });

  updatedTodos.deleted.forEach(todo => {
    // TODO findHabTodo
    var habTodo = findHabTodo(todo, data.habTodos);
    // TODO Habitica.deleteTodo
    Habitica.deleteTodo(habTodo);
    overwritten.push(habTodo.id);
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
