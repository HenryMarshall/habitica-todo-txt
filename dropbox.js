var request = require("request");
var options = require("./options");

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

module.exports = Dropbox;
