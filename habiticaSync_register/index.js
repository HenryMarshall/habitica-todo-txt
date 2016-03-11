var getToken = require('./getToken');
var doc = require('dynamodb-doc');
var dynamo = new doc.DynamoDB();

exports.handler = function(event, context) {
  getToken(event, context, function(token) {
    var data = {
        TableName: "HabiticaSync",
        Item: {
            dropToken: token,
            habUserId: event.habUserId,
            habApiKey: event.habApiKey,
            todoPath: event.todoPath
        }
    };

    dynamo.putItem(data, function(err, resp) {
      if (err) context.fail("db write failed");
      context.succeed("user registered");
    });
  });
};
