var getToken = require('./getToken');

var event = {"habUserId":"5aa6c8d9-e904-4603-81d1-7f9626dfdda5","habApiKey":"1709f7fc-123d-4d15-824a-bffde4ae0b93",
  "dropCode":"5k3cYR2ZStUAAAAAAAAIG6G9QhcfsP8EhRqqJZoYGbE",

  "todoPath":"/todo/api_test.todo.txt"};
getToken(event, null, function(token) {
  console.log(token);
});
