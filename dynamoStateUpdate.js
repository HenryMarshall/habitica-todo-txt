module.exports = function(event) {
  var data = {
    TableName: "HabiticaSync",
    Item: event
  }

  dynamo.putItem(data, function(err, resp) {
    if (err) context.fail(err);
    else context.succeed(resp);
  })
}
