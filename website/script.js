$(document).ready(function() {

  $.material.init();

  var lambda = new AWS.Lambda(config);

  $("#link-button").on("click", function(evt) {
    evt.preventDefault();
    var fields = stringifyFields($(this).parents("form"));

    if (fields) {
      lambda.invoke({
        FunctionName: "habiticaSync_register",
        Payload: fields
      }, function(err, data) {
      });
    }
  });

  function handleResponse(err, data) {
    var payload = JSON.parse(data.Payload);
    var message = createMessage(payload.errorMessage || payload);
    var isError = !payload.errorMessage;
    displayModal(message, isError);

    function createMessage(responseMessage) {
      var message;
      switch (responseMessage) {
        case "user registered":
          message = "Accounts Successfully Linked!";
          message += "\nPlease allow a few minutes for sync to begin";
          break;
        case "dropbox request failed":
        case "dropbox auth failed":
          message = "Failed to connect to Dropbox. Is your Code correct?"
          break;
        default:
          message = "Something went wrong. Please try again, and log a "
          message += '<a href="https://github.com/hbaughman/habitica-todo-txt/issues">'
          message += "github issue</a> if the problem persists."
      }
      return message;
    }
  }

  function stringifyFields($form) {
    var fields = $form.serializeArray();
    var data = {};
    for(var ii=0, len=fields.length; ii < len; ii++) {
      var field = fields[ii];
      if (field.value.trim() === "") {
        displayModal("All fields are mandatory", true);
        return false;
      }
      data[field.name] = field.value;
    }
    return JSON.stringify(data);
  }

  function displayModal(message, isError) {
    if (isError) {
      $("#feedback-modal").addClass("error");
    }
    else {
      $("#feedback-modal").removeClass("error");
    }
    $("#feedback-modal .modal-body").html(message);
    $("#feedback-modal").modal('toggle');
  }

});

