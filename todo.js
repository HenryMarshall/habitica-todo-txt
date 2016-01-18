function Todo(values) {
  this.values = values;
}

Todo.prototype.wasUpdatedSince = function (time) {
  return (
    new Date(this.values.dateCreated) > time || (
      this.values.dateCompleted !== undefined && 
      new Date(this.values.dateCompleted) > time
    )
  );
};

module.exports = Todo;
