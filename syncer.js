// options are values for dev purposes.
var options = require('./options');

var Dropbox = require('./dropbox');
var Habitica = require('./habitica');

var drop = new Dropbox("/todo/api_test.todo.txt", options.access_token);
var hab = new Habitica(options.habitica);

var overwritten = [];

function getNewTodos(callback) {
  var newTxtTodos, habTodos;
  var count = 2;

  drop.downloadTodos(todos => {
    newTxtTodos = todos;
    callbackOnCompletion()
  });
  hab.downloadTodos(todos => {
    habTodos = todos;
    callbackOnCompletion()
  });

  function callbackOnCompletion() {
    if (--count === 0) {
      callback({ newTxtTodos: newTxtTodos, habTodos: habTodos });
    }
  }
}

getNewTodos(todos => console.log(JSON.stringify(todos, null, 4)))
