var data = require('./sample_data/txt_revisions.js');

if (data.length === 0) {
  var err = new Error("No revisions for this file provided. Does it exist?");
  throw err;
}
else if (data.length === 1) {
  // No comparison to do. This is either the first run, or you hoven't written
  // any updates to todo.txt since the last check.
  
  // TODO
}
else {
  for(var ii=data.length - 1; ii >= 1; --ii) {
    diff(data[ii], data[ii-1]);
  }
}

function diff(oldRevision, newRevision) {
  // TODO: You can potentially save cycles, by doing this elsewhere.
  var oldTodos = todosFromRevision(oldRevision);
  var newTodos = todosFromRevision(newRevision);

  //console.log("oldTodos: ", oldTodos);
  //console.log("newTodos: ", newTodos);


  oldLoop: for(var ii=0, oldLen=oldTodos.length; ii < oldLen; ii++) {
    var oldTodo = oldTodos[ii];
    for(var jj=0, newLen=newTodos.length; jj < newLen; jj++) {
      var newTodo = newTodos[jj];

      if (oldTodo.text === newTodo.text) {
        if (newTodo.isCompleted !== oldTodo.isCompleted) {
          if (newTodo.isCompleted) {
            console.log("completed: " + newTodo.text);
            // Todo completed
          }
          else {
            console.log("Uncompleted: " + oldTodo.text);
            // Todo uncompleted
          }
        }
        newTodos.splice(jj, 1);
        continue oldLoop;
      }
    };
    console.log("Deleted: " + oldTodo.text);
    // oldTodo deleted
  };

  newTodos.map(newTodo => {
    // newTodo created
    console.log("Created: " + newTodo.text);
  });
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
