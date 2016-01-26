var Todo = require('./todo');

function todoFactory(text, isCompleted, dateCreated) {
  var values = {
    "text": text,
    "challenge": {},
    "priority": 1,
    "tags": {},
    "notes": "",
    "dateCreated": dateCreated,
    "checklist": [],
    "collapseChecklist": false,
    "completed": isCompleted,
    "type": "todo"
  };
  if (isCompleted) {
    values.dateCompleted = dateCreated;
  }
  return new Todo(values)
}

module.exports = todoFactory;
