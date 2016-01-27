var run = require('./index');
var options = require('./options');

var event = {
  oldTxtTodos: options.txt.oldTodosText,
  todoPath: "/todo/api_test.todo.txt",
  dropToken: options.access_token,
  lastHabSync: options.habitica.lastHabSync,
  habApiKey: options.habitica.apiKey,
  habUserId: options.habitica.userId
};

console.log("about to run `run`");
console.log(event);

//run(event);
