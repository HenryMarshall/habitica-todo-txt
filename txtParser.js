function txtParser(text) {
  var lineDelimiter = /\r?\n/;
  var lines = text.split(lineDelimiter);
  return lines.reduce((todos, line) => {
    if (line.trim() !== "") {
      var todo = todoFromLine(line);
      todos.push(todo);
    }
    return todos;
  }, []);
}

function todoFromLine(line) {
  var reg = /^(x )?(\d{4}-\d{2}-\d{2} )?(\d{4}-\d{2}-\d{2} )?(.*)/;
  var match = line.match(reg);
  var todo = {
    isCompleted: (match[1] === "x "),
    text: match[4]
  };
  return todo;
}

module.exports = txtParser;
