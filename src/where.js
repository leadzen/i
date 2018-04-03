/** -----------------------------------------------------------------------------------------------
 * where.js
 */

var where = function() {
  function _where_(deep) {
    deep = Number(deep)
    var stack = Error().stack.split("\n");
    for (var i = 0, line; line = stack[i++];) {
      if (line.match(reWhere)) break;
    }
    if (i < stack.length) {
      var ms = String(stack[i + deep]).match(reHere);
      if (ms)
        return {
          trace: ms[0],
          loc: ms[1],
          row: ms[2] - 1,
          col: ms[3] - 1
        };
    }
  }

  var reWhere = RegExp('\\b' + _where_.name + '\\b');
  var reHere = /((?:https?:\/\/[\w.-]+(?::\d+)?|)[\w./@-]+(?:\?.*|)):(\d+):(\d+)/;
    
  return _where_;
}();

// module.exports = where;