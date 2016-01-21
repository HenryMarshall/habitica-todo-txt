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

Dropbox.prototype.downloadTodo = function(callback) {
  request({
    url: "https://content.dropboxapi.com/2/files/download",
    headers: {
      Authorization: "Bearer " + this.accessToken,
      "Dropbox-API-Arg": JSON.stringify({
        "path": this.todoPath
      })
    }
  }, callback)
};

Dropbox.prototype.revisions = function(callback) {
  request.post({
    url: "https://api.dropboxapi.com/2/files/list_revisions",
    headers: this.defaultHeaders(),
    json: {
      "path": this.todoPath,
      // We need all the revisions since the last last check/update. We'll need
      // to repoll if this is insufficient.
      "limit": 100
    }
  }, function(err, resp, body) {
    if (err) throw err;
    var revisions = body.entries;
    callback(revisions);
  })
}

Dropbox.prototype.filterRevisions = function(firstRevision, revisions, callback) {
  for (var ii = 0, len = revisions.length; ii < len; ii++) {
    if (revisions[ii].rev === firstRevision) {
      revisions.splice(ii + 1);
      break;
    }
  }
  if (revisions[revisions.length - 1].rev !== firstRevision) {
    // TODO: I should keep fetching more revisions and concatenate them on.
    throw new Error("revisions did not contain first revision");
  }
  callback(revisions);
}

function logResponse(err, resp, body) {
  if (err) throw err;
  console.log(body);
}

module.exports = Dropbox;

var dropbox = new Dropbox("/todo/api_test.todo.txt", options.access_token)
dropbox.revisions(function(revisions) {
  dropbox.filterRevisions("18eb546f001a3a9b", revisions, function(revisions) {
    console.log(revisions);
  })
});
