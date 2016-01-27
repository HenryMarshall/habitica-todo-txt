function habMatcher(txtTodo, habTodos) {
  for(var ii=0, len=habTodos.length; ii < len; ii++) {
    var habTodo = habTodos[ii];
    if (habTodo.values.text === txtTodo.text) {
      return habTodo;
    }
  }
}

module.exports = habMatcher;
