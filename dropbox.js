var request = require("request");
var options = require("./options");

var dropbox = {
  downloadTodo: function(path) {
    var path = path || "/todo/todo.txt";
    request({
      url: "https://content.dropboxapi.com/2/files/download",
      headers: {
        Authorization: "Bearer " + options.access_token,
        "Dropbox-API-Arg": JSON.stringify({
          "path": path
        })
      }
    }, logResponse)
  },

  metadataTodo: function(path) {
    var path = path || "/todo/todo.txt";
    request.post({
      url: "https://api.dropboxapi.com/2/files/get_metadata",
      headers: {
        "Authorization": "Bearer " + options.access_token,
        "Content-Type": "application/json"
      },
      json: {
        "path": path,
        "include_media_info": false
      }
    }, logResponse)
  }
}

function logResponse(err, resp, body) {
  if (err) throw err;
  console.log(resp.statusCode, body);
}

module.exports = dropbox;

dropbox.metadataTodo();
