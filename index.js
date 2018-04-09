/** -----------------------------------------------------------------------------------------------
 * lib.js
 */

function valuetype(any) {
  return any === null ? "null" : typeof any;
}

var classtype = function(){
  var reTrimTag = /\[object |\]/g;
  return function (any) {
    return Object.prototype.toString.call(any).replace(reTrimTag, '');
  }
}();


/** -----------------------------------------------------------------------------------------------
 * go.js
 */

function go(gen) {
  return next();
  function next(value) {
    var state = gen.next(value);
    value = state.value;
    return state.done
      ? value
      : ( classtype(value) === "Generator"
          ? go(value)
          : Promise.resolve(value)
        ).then(next);
  }
}

/** -----------------------------------------------------------------------------------------------
 * assert.js
 */

var assert = {
  okey() {
    this.state = 1;
    this.it.report(this);
  },

  fail(reason) {
    this.state = -1;
    this.reason = reason;
    this.it.report(this);
  }
}

// class Assert {
//   constructor(it) {
//     this.it = it;
//     // this.desc = null;
//     this.state = 0;
//     this.reason = null;
//     this.time = 0;
//   }
// }
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
 * i.js
 */

var I = function () {
  class I {
    constructor(parent, topic, func) {
      this.level = parent ? parent.level + 1 : 0;
      this.parent = parent;
      this.topic = topic;
      this.func = func;
      this.its = [];
      this.spaces = SPACE.repeat(this.level);
      this.time = 0;
      this.state = 0;   // 0: pending, 1: done, -1: canceled;

      if (!parent) {
        Object.assign(this, root);
      }
    }

    do(topic, func) {
      var it = new I(this, topic, func)
      this.its.push(it);
      return {
        in(time) {
          it.time = time;
        }
      };
    }

    for(topic, func) {
      var it = new I(this, topic, func);
      this.its.push(it);
      return {
        to(func) {
          it.done = func;
          return {
            in(time) {
              it.time = time;
            }
          }
        }
      };
    }

    log() {
      log(arguments, this.spaces);
    }

    delay(time) {
      return new Promise(function (resolve) {
        setTimeout(resolve, time);
      });
    }

    report(assert) {
      if (assert.state > 0) {
        this.log("#2%s", assert.desc);
      }
      else if (assert.state < 0) {
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
    $defineAsserts(prototype) {
      Object.defineProperties(I.prototype, Object.getOwnPropertyDescriptors(prototype));
    },

    $defineVerbs(prototype) {
      Object.defineProperties(assert, Object.getOwnPropertyDescriptors(prototype));
    }

  }

  function run(it) {
    it.parent.log(it.topic);
    var func = it.func;
    var value;
    if(func) {
      var done = it.done;
      if(done) {
        value = new Promise(func)
          .then(checkstate)
          .then(it.done.bind(undefined, it));
      }
      else {
        value = func(it);
        if(classtype(value) === "Generator") {
          value = go(value);
        }
        else {
          value = Promise.resolve(value).then(checkstate);
        }
      }

      if (it.time) {
        value = timeout(value, it.time);
      }
    }
    else {
      value = Promise.resolve();
    }

    return value.then(runs.bind(it.its))
      .then(function () {
        it.state = 1;
      })
      .catch(function (error) {
        if (error) {
          it.log("#1%s", error.message || error);
        }
        it.state = -1;
      });
    
    function checkstate(value) {
      if(it.state)
        throw undefined;
      return value;
    }
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

  function timeout(promise, time) {
    return Promise.race([
      promise.then(function(value){
        clearTimeout(time);
        return value;
      }),
      new Promise(function(resolve, reject){
        time = setTimeout(reject, time, Error("Timeout " + time));
      })
    ]);

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