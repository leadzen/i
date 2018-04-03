#!/usr/bin/env node

//#include ./i.js
//#include ./hope.js

/** -----------------------------------------------------------------------------------------------
 * it.js
 */

var test = process.argv[2];
if(test) {
  global.I = I;
  path = require("path");
  test = path.relative(__dirname, test);
  require(test);
  I.run();
}
else {
  console.log("Usage: it <test>");
}