/** -----------------------------------------------------------------------------------------------
 * where.js
 */

var where = function () {
  function _where_(deep) {
    var stack = Error().stack.split("\n"), ms;
    for (var i = 0, line; line = stack[i++];) {
      if (line.match(reWhere)) break;
    }
    if (typeof deep === "string") {
      for (; i < stack.length; i++) {
        if ((ms = stack[i].match(reHere)) && ms[1] === deep) {
          return {
            trace: ms[0],
            loc: ms[1],
            row: ms[2] - 1,
            col: ms[3] - 1
          };
        }
      }
    }
    else {
      if (i < stack.length && (ms = String(stack[i + deep]).match(reHere))) {
        return {
          trace: ms[0],
          loc: ms[1],
          row: ms[2] - 1,
          col: ms[3] - 1
        };
      }
    }
  }
  var reWhere = RegExp('\\b' + _where_.name + '\\b');
  var reHere = /((?:https?:\/\/[\w.-]+(?::\d+)?|)[\w./@-]+(?:\?.*|)):(\d+):(\d+)/;

  return _where_;
}();
