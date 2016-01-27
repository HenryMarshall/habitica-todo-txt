var txtDiffer = require("./txtDiffer");
var habMatcher = require("./habMatcher");
var todoFactory = require("./todoFactory");
var dynamoStateUpdate = require("./dynamoStateUpdate");

function sync(data, event, drop, hab) {
  var asyncStatus = {
    txtUploaded: false,
    habCreated: false,
    habChanged: false,
    habDeleted: false
  };
  var txtString = data.newTxtString;

  // TODO dateCompleted should use the metadata from the last write to dropbox.
  var dropboxDate = new Date().toISOString();

  var updatedTodos = txtDiffer(data.oldTxtTodos, data.newTxtTodos)
  var overwritten = [];

  var changedCount = updatedTodos.changed.length;
  if (changedCount === 0) asyncStatus.habChanged = true;
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
      overwritten.push(habTodo.values.id);
      hab.updateTodo(habTodo, () => {
        changedCount = asyncComplete(changedCount, "habChanged");
      });
    }
    // Even if there were only changes on the dropbox side of things, if no
    // match can be found on Habitica, we need to create the todo from scratch.
    else {
      updatedTodos.created.push(todo);
      changedCount = asyncComplete(changedCount, "habChanged");
    }
  });


  var deletedCount = updatedTodos.deleted.length;
  if (deletedCount === 0) asyncStatus.habDeleted = true;
  updatedTodos.deleted.forEach(todo => {
    var habTodo = habMatcher(todo, data.habTodos);
    if (habTodo) {
      overwritten.push(habTodo.values.id);
      hab.deleteTodo(habTodo, () => {
        deletedCount = asyncComplete(deletedCount, "habDeleted");
      });
    }
    else {
      deletedCount = asyncComplete(deletedCount, "habDeleted");
    }
  });

  // TODO: DRY this out
  var createdCount = updatedTodos.created.length;
  if (createdCount === 0) asyncStatus.habCreated = true;
  updatedTodos.created.forEach(todo => {
    var habTodo = todoFactory(todo.text, todo.isCompleted, dropboxDate);
    hab.createTodo(habTodo, () => {
      createdCount = asyncComplete(createdCount, "habCreated");
    });
  });


  // Now we sync todos from habitica to todo.txt
  var linesToAdd = [];
  var lastHabSync = data.lastHabSync;
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
    event.oldTxtTodos = txtString;
    // The txtUploaded values uniquely doesn't have a count so pass in 0
    asyncComplete(0, "txtUploaded");
  });

  asyncComplete(0, "noUpdates");

  function asyncComplete(counter, type) {
    if (--counter <= 0) {
      asyncStatus[type] = true;
      var keys = Object.keys(asyncStatus);
      if (keys.every(key => asyncStatus[key])){
        event.habLastSync = new Date().toISOString();
        dynamoStateUpdate(event);
      }
    }
    return counter;
  }
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
