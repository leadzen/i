//#include ./go.js
//#include ./assert.js
//#include ./log.js

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
