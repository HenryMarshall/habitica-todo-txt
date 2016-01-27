var config = require("./config");
var request = require("request");

function getToken(event, context, callback) {
  var params = {
    code: event.dropCode,
    grant_type: "authorization_code",
  }

  request({
    url: "https://api.dropboxapi.com/1/oauth2/token",
    method: "POST",
    auth: {
      user: config.client_id,
      pass: config.client_secret
    },
    form: params
  }, function(err, resp, body) {
    //context.succeed(JSON.stringify(body));
    //callback("dummy_token");
    //if (err) context.fail(err);
    var token = JSON.parse(body).access_token;
    callback(token);
  });
}

module.exports = getToken;
