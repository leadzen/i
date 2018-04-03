//#include ./log.js
//#include ./getline.js
//#include ./where.js
//#include ./dent.js

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
