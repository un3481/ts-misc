/*
##########################################################################################################################
#                                                       MISCELLANEOUS                                                    #
##########################################################################################################################
*/
/*
##########################################################################################################################
#                                                       MISCELLANEOUS                                                    #
##########################################################################################################################
*/
// General Make Type-Guard
export function extend(obj) {
  return true;
}
// General Set Type-Guard
export function guard(tg) {
  if (extend(tg))
    return tg;
}
/*
##########################################################################################################################
#                                                       MISCELLANEOUS                                                    #
##########################################################################################################################
*/
// Get Type-Of Object using 'ToString' Method
export function typeOf(obj) {
  return Object.toString
    .call(obj)
    .match(/\s([a-zA-Z]+)/)[1]
    .toLowerCase();
}
/*
##########################################################################################################################
#                                                       MISCELLANEOUS                                                    #
##########################################################################################################################
*/
// Check Primary Types
function _setGuard(typeName, constructor = null) {
  // Set Guard
  const tg = obj =>
    // eslint-disable-next-line valid-typeof
    typeof obj === typeName ||
    (constructor ? obj instanceof constructor : obj === undefined);
  // Return As
  return tg;
}
/*
##########################################################################################################################
#                                                       MISCELLANEOUS                                                    #
##########################################################################################################################
*/
// Primary Type-Guard Object
export const primaryGuards = {
  undefined: _setGuard('undefined'),
  string: _setGuard('string', String),
  number: _setGuard('number', Number),
  bigint: _setGuard('bigint', BigInt),
  symbol: _setGuard('symbol', Symbol),
  object: _setGuard('object', Object),
  boolean: _setGuard('boolean', Boolean),
  function: _setGuard('function', Function)
};
// Unusual Type-Guard Object
export const unusualGuards = {
  any: (_obj => true),
  never: (_obj => false),
  unknown: (_obj => true),
  true: (obj => obj === true),
  false: (obj => obj === false),
  date: (obj => obj instanceof Date),
  array: (obj => Array.isArray(obj)),
  regexp: (obj => obj instanceof RegExp),
  null: (obj => obj === null || obj === undefined),
  promise: (obj => obj instanceof Promise),
  typeof: (obj => primaryGuards.string(obj) &&
    (obj in primaryGuards || obj in unusualGuards)),
  keyof: (obj => ['string', 'number', 'symbol'].includes(typeof obj)),
  class: (obj => {
    if (!primaryGuards.function(obj))
      return false;
    try {
      Reflect.construct(String, [], obj);
    } catch (_e) {
      return false;
    }
    return true;
  })
};
// General Type-Guard Object
const guards = {
  ...primaryGuards,
  ...unusualGuards
};
/*
##########################################################################################################################
#                                                       MISCELLANEOUS                                                    #
##########################################################################################################################
*/
// Set Functional Type-Guard
export function isType(obj, typeName) {
  // Set Check Function
  const checkType = t => guards[t](obj);
  // Return Check
  if (!guards.array(typeName))
    return checkType(typeName);
  else
    return typeName.some(checkType);
}
/*
##########################################################################################################################
#                                                       MISCELLANEOUS                                                    #
##########################################################################################################################
*/
// Type-Guard Proxy-Function Generator
function _setGuardCircularReference(_func) {
  return new Proxy(_func, {
    get(target, p) {
      if (p === 'or') {
        // Check Target Type
        if (!guards.function(target))
          return;
        // Return Recursive Proxy
        return new Proxy({}, _getUpstreamGuardHandler(target));
      } else
        return target[p];
    }
  });
}
// Type-Guards Proxy-Handler Generator
function _getUpstreamGuardHandler(_dnstr) {
  return {
    get(_target, p) {
      // Check if property exists
      if (!guards.typeof(p))
        return;
      // Get Fixed Parameters
      const _guard = guards[p];
      const _upstr = (o => _dnstr(o) || _guard(o));
      // Return Recursive Type-Guard Proxy
      return _setGuardCircularReference(_upstr);
    }
  };
}
// Recursive Type-Guard Proxy
export const superGuards = new Proxy({}, _getUpstreamGuardHandler(guards.never));
/*
##########################################################################################################################
#                                                       MISCELLANEOUS                                                    #
##########################################################################################################################
*/
// Has-Property Type-Guard
export function has(obj, key, typeName, _oref) {
  // Set Check Function
  const checkType = (o, k) => {
    return typeName ? isType(o[k], typeName) : true;
  };
  // Perform Key Check
  const checkKey = (o, k) => {
    if (!guards.object(o))
      return false;
    if (k in o)
      return checkType(o, k);
    if (Object.prototype.hasOwnProperty.call(o, k))
      return checkType(o, k);
    if (guards.string(k) && Object.keys(o).includes(k)) {
      return checkType(o, k);
    } else
      return false;
  };
  // Return Check
  if (!guards.array(key))
    return checkKey(obj, key);
  else
    return key.every(k => checkKey(obj, k));
}
/*
##########################################################################################################################
#                                                       MISCELLANEOUS                                                    #
##########################################################################################################################
*/
// Every-Property Type-Guard
export function are(obj, typeName, _oref) {
  // Check All
  return Object.values(obj).every(v => isType(v, typeName));
}
/*
##########################################################################################################################
#                                                       MISCELLANEOUS                                                    #
##########################################################################################################################
*/
// General Type-Guard Target
const superTarget = (() => null);
// General Type-Guard Proxy
export const is = new Proxy(superTarget, {
  // Is-Type Call
  apply(_target, _thisArg, args) {
    if (args.length != 2)
      return;
    const [obj, typeName] = args;
    if (!guards.typeof(typeName))
      return;
    else if (guards.array(typeName)) {
      if (!are(typeName, 'typeof', typeName))
        return;
    } else
      return;
    return isType(obj, typeName);
  },
  // Property Getters
  get(_target, p) {
    if (p === 'in')
      return has;
    if (p === 'every')
      return are;
    if (p in guards)
      return superGuards[p];
  },
  // General Methods
  set(_target, _p, _value) {
    return null;
  },
  deleteProperty(_target, _p) {
    return null;
  },
  defineProperty(_target, _p, _attr) {
    return null;
  },
  ownKeys(_target) {
    return Object.keys(guards);
  },
  // Property Check
  has(_target, p) {
    return (p in guards ||
      (guards.string(p) && ['in', 'has'].includes(p)));
  }
});
/*
##########################################################################################################################
#                                                       MISCELLANEOUS                                                    #
##########################################################################################################################
*/
// Function-Return Type-Guard
export function isReturn(typeName) {
  // Set Type-Guard
  const typeGuard = (obj, ...args) => is(obj(...args), typeName);
  // Return Type-Guard
  return typeGuard;
}
/*
##########################################################################################################################
#                                                       MISCELLANEOUS                                                    #
##########################################################################################################################
*/
