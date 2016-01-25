// options are values for dev purposes.
var options = require('./options');
var oldTxtTodos = options.txt.oldTodos

var Dropbox = require('./dropbox');
var Habitica = require('./habitica');

var drop = new Dropbox("/todo/api_test.todo.txt", options.access_token);
var hab = new Habitica(options.habitica);

var overwritten = [];
function sync(data) {
  
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

fetchNewTodos(todos => console.log(JSON.stringify(todos, null, 4)))
