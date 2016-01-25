var data = require('./sample_data/txt_revisions.js');

var oldTodos = todosFromRevision(data[1]);
var newTodos = todosFromRevision(data[0]);
console.log(JSON.stringify(diff(oldTodos, newTodos), null, 4));

function diff(oldTodos, newTodos) {
  var updates = {
    changed: [],
    created: [],
    deleted: []
  };

  oldLoop: for(var ii=0, oldLen=oldTodos.length; ii < oldLen; ii++) {
    var oldTodo = oldTodos[ii];
    for(var jj=0, newLen=newTodos.length; jj < newLen; jj++) {
      var newTodo = newTodos[jj];

      if (oldTodo.text === newTodo.text) {
        if (newTodo.isCompleted !== oldTodo.isCompleted) {
          updates.changed.push(newTodo);
        }
        newTodos.splice(jj, 1);
        continue oldLoop;
      }
    };
    updates.deleted.push(oldTodo);
  };

  newTodos.map(newTodo => {
    updates.created.push(newTodo);
  });

  return updates;
}

function todosFromRevision(revision) {
  //console.log("revision: ", revision);
  var lineDelimiter = /\r?\n/;
  var lines = revision.text.split(lineDelimiter);
  return lines.reduce((todos, line) => {
    if (line.trim() !== "") {
      var todo = todoFromLine(line);
      todo.timestamp = revision.server_modified;
      todos.push(todo);
    }
    return todos;
  }, []);
}

function todoFromLine(line) {
  var reg = /^(x )?(\d{4}-\d{2}-\d{2} )?(\d{4}-\d{2}-\d{2} )?(.*)/;
  var match = line.match(reg);
  var todo = {
    isCompleted: (match[1] === "x "),
    text: match[4]
  };
  return todo;
}
