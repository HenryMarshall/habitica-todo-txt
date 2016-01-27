// options are values for dev purposes.
//var options = require('./options');

var txtDiffer = require("./txtDiffer");
var habMatcher = require("./habMatcher");
var todoFactory = require("./todoFactory");

//var drop = new Dropbox("/todo/api_test.todo.txt", options.access_token);
//var hab = new Habitica(options.habitica);
//
//var data = {
//  newTxtTodos: options.txt.newTodos,
//  oldTxtTodos: options.txt.oldTodos,
//  txtString: options.txt.newTodosText,
//  lastHabSync: new Date(options.habitica.lastHabSync),
//  habTodos: options.habitica.todos.map(todo => new Todo(todo))
//}
//sync(data)

function sync(data, drop, hab) {
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
      hab.updateTodo(habTodo);
      overwritten.push(habTodo.values.id);
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
      overwritten.push(habTodo.values.id);
    }
  });

  updatedTodos.created.forEach(todo => {
    var habTodo = todoFactory(todo.text, todo.isCompleted, dropboxDate);
    hab.createTodo(habTodo);
  });


  // Now we sync todos from habitica to todo.txt
  var linesToAdd = [];
  var lastHabSync = data.lastHabSync;
  var txtString = data.newTxtString;
  data.habTodos.forEach(habTodo => {
    var todoOverwritten = overwritten.indexOf(habTodo.values.id) !== -1;
    if (habTodo.wasUpdatedSince(lastHabSync) && !todoOverwritten) {
      if (txtString.indexOf(habTodo.values.text) !== -1) {
        var reg = new RegExp("^.*" + habTodo.values.text + "$", "m");
        txtString = txtString.replace(reg, habTodo.toString());
      }
      else {
        linesToAdd.push(habTodo.toString());
      }
    }
  });
  
  todosToAppend = linesToAdd.join("\n");
  txtString += "\n" + todosToAppend;
  txtString = txtString.replace(/\n{2,}/, "\n");
  drop.uploadTodos(txtString, (err, resp, body) => {
    console.log(JSON.stringify(resp, null, 2));
    console.log(JSON.stringify(body, null, 2));
  })
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

module.exports = sync;
