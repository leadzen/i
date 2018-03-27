module.exports = class I {
  constructor(parent, topic, func, time) {
    this.parent = parent;
    this.topic = topic;
    this.func = func;
    this.its = [];
    this.indent = parent ? parent.indent + "  " : "";
    this.time = time | 0;
    this.state = 0;   // 0: pending, 1: done, -1: canceled;
  }

  say(text) {
    log(this, "  " + text);
  }

  do(topic, func, time) {
    var it = new I(this, topic, func, time)
    this.its.push(it);
  }

  run() {
    var it = this;
    var promise = Promise.resolve(log(it, it.topic));
    if(it.func) {
      promise = promise.then(it.func.bind(it, it));
      if(it.time) {
        promise = Promise.race([timeout(it.time), promise]);
      }
    }
    return promise.then(runs.bind(it.its))
      .catch(function(error){
        it.say(error && (error.message || error));
      });
  }

  delay(time) {
    return new Promise(function (resolve) {
      setTimeout(resolve, time);
    });
  }
};

function log(I, text) {
  console.log(I.indent + text);
}

function runs() {
  var its = this;
  var i = 0;
  return Promise.resolve(next());
  function next() {
    if (i < its.length) {
      return Promise.resolve(its[i++].run()).then(next);
    }
  }
}

function timeout(time) {
  return new Promise(function(resolve, reject){
    setTimeout(reject, time, Error("Error: Timeout "+time));
  });
}