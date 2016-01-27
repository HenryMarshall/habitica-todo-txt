function Todo(values) {
  this.values = values;
}

Todo.prototype.wasUpdatedSince = function(time) {
  return (
    new Date(this.values.dateCreated) > time || (
      this.values.dateCompleted !== undefined && 
      new Date(this.values.dateCompleted) > time
    )
  );
};

Todo.prototype.toString = function() {
  // formats to: "x 2016-01-17 2016-01-19 Complete my project"
  var components = [];
  components.push(formatDateString(this.values.dateCreated));
  if (this.values.completed) {
    components.unshift("x");
    components.push(formatDateString(this.values.dateCompleted));
  }
  components.push(this.values.text);
  return components.join(" ");

  // Extracts date component of full ISO-8601 date.
  function formatDateString(dateString) {
    return dateString.slice(0,10);
  }
};

module.exports = Todo;
