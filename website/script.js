$(document).ready(function() {

var lambda = new AWS.Lambda(credentials);

$("#link-button").on("click", function(evt) {
  evt.preventDefault();
  var $form = $(this).parents("form");

  console.log(stringifyFields($form))

  lambda.invoke({
    FunctionName: "habiticaSync_register",
    Payload: stringifyFields($form)
  }, function(err, data) {
    if (err) throw err;
    alert("Successfully linked your accounts. Sync could take up to 10 minutes.");
  });
});

function stringifyFields($form) {
  var fields = $form.serializeArray();
  var data = {};
  fields.forEach(function(pair) {
    data[pair.name] = pair.value;
  });
  return JSON.stringify(data);
}

});
