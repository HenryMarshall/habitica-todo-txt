var sync = require('./syncer');
var txtParser = require('./txtParser');
var Todo = require('./todo');
var Dropbox = require('./dropbox');
var Habitica = require('./habitica');

function run(event, context) {
  var drop = new Dropbox(event.todoPath, event.dropToken)
  var hab = new Habitica({ apiKey: event.habApiKey, userId: event.habUserId });

  fetchData(event, (data) => {
    sync(data, drop, hab);
  });

  function fetchData(event, callback) {
    var data = {
      oldTxtTodos: txtParser(event.oldTxtTodos || ""),
      lastHabSync: new Date(event.lastHabSync || "2000-01-01"),
    };

    var asyncCount = 2;
    drop.downloadTodos(todosString => {
      data.newTxtString = todosString;
      data.newTxtTodos = txtParser(todosString);
      asyncComplete(data);
    });

    hab.downloadTodos(todos => {
      data.habTodos = todos;
      asyncComplete(data);
    });

    function asyncComplete(data) {
      if (--asyncCount <= 0) {
        callback(data);
      }
    }
  }
}

module.exports = run;
//exports.handler = run;
