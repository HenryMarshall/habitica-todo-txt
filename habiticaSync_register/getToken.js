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
    if (err) context.fail("dropbox request failed");

    body = JSON.parse(body);
    if (body.error) context.fail("dropbox auth failed");

    callback(body.access_token);
  });
}

module.exports = getToken;
