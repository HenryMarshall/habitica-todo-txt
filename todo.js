function Todo(values) {
  this.values = values;
}

Todo.prototype.wasUpdatedSince = function (time) {
  return (
    this.values.dateCreated > time ||
    (this.values.dateCompleted !== undefined && this.value.dateCompleted > time)
  );
};

module.exports = Todo;
