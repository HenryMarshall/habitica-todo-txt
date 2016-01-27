var request = require("request");
var txtParser = require("./txtParser");

function Dropbox(todoPath, accessToken) {
  this.todoPath = todoPath;
  this.accessToken = accessToken;
}

Dropbox.prototype.defaultHeaders = function() {
  return {
    Authorization: "Bearer " + this.accessToken,
    "Content-Type": "application/json"
  }
};

Dropbox.prototype.downloadTodos = function(callback) {
  request({
    url: "https://content.dropboxapi.com/2/files/download",
    headers: {
      Authorization: "Bearer " + this.accessToken,
      "Dropbox-API-Arg": JSON.stringify({
        "path": this.todoPath
      })
    }
  }, (err, resp, body) => {
    if (err) throw err;
    callback(body);
  });
};

Dropbox.prototype.uploadTodos = function(todos, callback) {
  request({
    url: "https://content.dropboxapi.com/2/files/upload",
    method: "POST",
    headers: {
      Authorization: "Bearer " + this.accessToken,
      "Dropbox-API-Arg": JSON.stringify({
        "path": this.todoPath,
        "mode": "overwrite",
        "autorename": false,
        "mute": true
      }),
      "Content-Type": "application/octet-stream"
    },
    body: todos
  }, callback);
};

module.exports = Dropbox;
