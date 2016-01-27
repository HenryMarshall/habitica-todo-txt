var getToken = require('./getToken');
var doc = require('dynamodb-doc');
var dynamo = new doc.DynamoDB();

exports.handler = function(event, context) {
  //context.succeed(JSON.stringify(event));
  getToken(event, context, function(token) {
    //event.dropToken = "token";
    //delete event.dropCode;

    var data = {
        TableName: "HabiticaSync",
        Item: {
            dropToken: token,
            habUserId: event.habUserId,
            habApiKey: event.habApiKey,
            todoPath: event.todoPath
        }
    };

    //context.succeed([token, data]);
    
    dynamo.putItem(data, function(err, resp) {
      //context.succeed("should'd run");
      //if (err) context.fail(err);
      // else 
      context.succeed("user registered - 17:19");
    });
  });
};
