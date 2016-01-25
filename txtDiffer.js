function txtDiffer(oldTodos, newTodos) {
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

module.exports = txtDiffer;
