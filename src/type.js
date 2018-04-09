/** -----------------------------------------------------------------------------------------------
 * type.js
 */

function textify(any) {
  var s = typeclass(any);
  if (s === 'string' || s === 'boolean') {
    s += ' ' + stringify(any);
  }
  else if (s === 'number' || s === 'symbol') {
    s += ' ' + String(any);
  }
  else if (s === 'Date' || s === 'String' || s === 'Number' || s === 'Boolean') {
    s += ' ' + stringify(any.valueOf());
  }
  else if (s === 'null prototype') {
    s = 'object with ' + s;
  }
  else if (s !== 'undefined' && s !== 'null') {
    s += ' object';
  }
  return s;
}

function typeclass(any) {
  var type = genusof(any), proto;
  if (type === 'object' || type === 'function') {
    if (proto = getPrototype(any)) {
      if (hasOwnProperty(proto, 'constructor')) {
        type = funcname(proto.constructor);
      }
      else {
        type = tagof(any);
      }
    }
    else {
      type = 'null prototype';
    }
  }
  return type;
}

function genusof(any) {
  return any === null ? "null" : typeof any;
}

var reTrimTag = /\[object |\]/g;
function tagof(any) {
  return replace(call(Object_prototype.toString, any), reTrimTag, '');
}
