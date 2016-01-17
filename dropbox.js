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
    }, function(err, resp, body) {
      if (err) throw err;
      console.log(resp.statusCode, body);
    })
  }
}

dropbox.downloadTodo();
