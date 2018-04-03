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


/** -----------------------------------------------------------------------------------------------
 * get.js
 */

var get = function(){
  var get;
  if(typeof window === "undefined") {
    var fs = require("fs");
    get = function(path) {
      return fs.readFileSync(path, "utf-8");
    }
  }
  else {
    get = function(path) {
      var http = new XHLHttpRequest;
      http.open("GET", path, false);
      http.send();
      return http.status / 100 ^ 2 ? '' : http.resopnseText;
    }
  }

  return get;
}();


/** -----------------------------------------------------------------------------------------------
 * getcode.js
 */

var getcode = function(){

  function getcode(path) {
    if(path in cache) {
      path = cache[path];
    }
    else {
      path = cache[path] = get(path);
    }
  }

  var cache = {};
  
  return getcode;
}();

/** -----------------------------------------------------------------------------------------------
 * getline.js
 */

 var getline = function() {
  function getline(path) {
    if(path in cache) {
      path = cache[path];
    }
    else {
      path = cache[path] = get(path).split("\n");
    }
    return path;
  }

  var cache = {};

  return getline;
 }();
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
/** -----------------------------------------------------------------------------------------------
 * dent.js
 */

var dent = function(){
  function dent(text, space) {
    text = String(text);
    if(arguments.length<2) {
      var spaces = text.match(reSpaces);
      for(var i=0; i<spaces.length; i++) {
        if(!(spaces[i] > space)) {
          space = spaces[i];
        }
      }
    }
    space = RegExp('^'+space, 'gm');
    return text.replace(space, '');
  }
  var reSpaces = /^\s*/gm;

  return dent;
}();

/** -----------------------------------------------------------------------------------------------
 * i.js
 */

var I = function () {
  class I {
    constructor(parent, topic, func, time) {
      this.level = parent ? parent.level + 1 : 0;
      this.parent = parent;
      this.topic = topic;
      this.func = func;
      this.its = [];
      this.spaces = SPACE.repeat(this.level);
      this.time = time | 0;
      this.state = 0;   // 0: pending, 1: done, -1: canceled;

      if (!parent) {
        Object.assign(this, root);
      }
    }

    do(topic, func, time) {
      var it = new I(this, topic, func, time)
      this.its.push(it);
    }

    log() {
      log(arguments, this.spaces);
    }

    delay(time) {
      return new Promise(function (resolve) {
        setTimeout(resolve, time);
      });
    }

    get source() {
      var trace = this.trace;
      if (trace) {
        var lines = getline(trace.loc), row = trace.row, len = 1;
        var endding = where(3);
        if (trace.loc === endding.loc) {
          if (endding.row > row) {
            len += endding.row - row;
          }
        }
        lines = lines.slice(row, row + len);

        return dent(lines.join("\n"));
      }
    }

    report(assert) {
      if(assert.state > 0) {
        this.log("#2%s", assert.desc);
      }
      else if (assert.state<0) {
        this.log("#1%s", assert.desc);
      }
      else {
        this.log("#6%s", assert.desc);
      }
    }
  };

  var SPACE = new String("  ");  //│├└

  /**
   * 根方法
   */
  var root = {
    // 运行所有测试
    run() {
      return runs.call(this.its);
    },

    //定义断言方法
    $define(name, method) {
      Object.defineProperty(I.prototype, name, {
        get: function () {
          this.trace = where(1);
          return method;
        }
      });
    }

  }

  function run(it) {
    var promise = Promise.resolve(it.parent.log(it.topic));
    if (it.func) {
      promise = promise.then(it.func.bind(it, it));
      if (it.time) {
        promise = Promise.race([timeout(it.time), promise]);
      }
    }
    return promise.then(runs.bind(it.its))
      .catch(function (error) {
        it.log("#1%s", error && (error.message || error));
      });
  }

  function runs() {
    var its = this;
    var i = 0;
    return Promise.resolve(next());
    function next() {
      if (i < its.length) {
        return Promise.resolve(run(its[i++])).then(next);
      }
    }
  }

  function timeout(time) {
    return new Promise(function (resolve, reject) {
      setTimeout(reject, time, Error("Error: Timeout " + time));
    });
  }

  return new I;
}();


/** -----------------------------------------------------------------------------------------------
 * index.js
 */

module.exports = I;