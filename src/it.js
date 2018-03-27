#!/usr/bin/env node

var test = process.argv[2];
if(test) {
  path = require("path");
  test = path.join(process.cwd(), test);
  test = path.relative(__dirname, test);
  var I = require("./i.js");
  global.I = new I(null, "BEGIN");
  require(test);
  process.nextTick(function(){
    global.I.run().then(function(){
      console.log("END.");
    });
  });
}
else {
  console.log("Usage: it <test>");
}