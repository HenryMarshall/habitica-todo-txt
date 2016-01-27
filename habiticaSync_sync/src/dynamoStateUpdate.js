var doc = require('dynamodb-doc');
var dynamo = new doc.DynamoDB();

module.exports = function(event, context) {
  var data = {
    TableName: "HabiticaSync",
    Item: event
  }

  dynamo.putItem(data, function(err, resp) {
    if (err) context.fail(err);
    else context.succeed(resp);
  })
}
