/** -----------------------------------------------------------------------------------------------
 * log.js
 */

var log = function(){
  function log(args, spaces) {
    var msg = format.apply(undefined, args);
    args.length = 1;
    msg = msg.replace(reColors, function (subs, id) {
      return color(id, args);
    }) + RESET_COLOR;
    args[0] = indent(msg, spaces);
    console.log.apply(console, args);
  }

  var reColors = /#([0-7#])/g;
  
  if (typeof window === "undefined") {
    var RESET_COLOR = "\x1b[0m";
    var colors = ["\x1b[30m", "\x1b[31m", "\x1b[32m", "\x1b[33m", "\x1b[34m", "\x1b[35m", "\x1b[36m", "\x1b[37m"];
    var color = function(id, args) {
      return colors[id] || RESET_COLOR;
    }
  }
  else {
    var RESET_COLOR = "";
    var colors = ["color:black", "color:red", "color:green", "color:yellow", "color:blue", "color:magenta", "color:cyan", "color:white"];
    var color = function(id, args) {
      args.push(colors[id] || "");
      return "%c";
    }
  }

  function format(msg) {
    var i = 1, args = arguments, len = args.length;
  
    msg = len ? String(msg) : "";
  
    msg = msg.replace(reSubs, function (subs, type) {
      return i < len ? types[type](args[i++]) : subs;
    });
    for (; i < len; i++) {
      msg += " " + String(args[i]);
    }
    return msg;
  }
  var reSubs = /%([sdif])/g;
  var types = {
    s: String,
    d: Number,
    f: Number,
    i: Number
  }
  
  function indent(text, space) {
    return text.replace(reIndent, space);
  }
  var reIndent = /^/gm;
  
  return log;
}();

