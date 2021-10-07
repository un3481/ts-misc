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
const makeIs = (typeName, constructor = null) => {
  // Set Guard
  const tg = obj =>
    // eslint-disable-next-line valid-typeof
    typeof obj === typeName ||
    (constructor ? obj instanceof constructor : obj === undefined);
  // Return As
  return tg;
};
// Primary Type-Guard Proxy
export const primaryGuards = {
  undefined: makeIs('undefined'),
  string: makeIs('string', String),
  number: makeIs('number', Number),
  bigint: makeIs('bigint', BigInt),
  symbol: makeIs('symbol', Symbol),
  object: makeIs('object', Object),
  boolean: makeIs('boolean', Boolean),
  function: makeIs('function', Function)
};
// Unusual Type-Guard Record
export const unusualGuards = {
  never: (obj => false && obj),
  any: (obj => true || obj),
  true: (obj => obj === true),
  false: (obj => obj === false),
  unknown: (obj => true || obj),
  date: (obj => obj instanceof Date),
  array: (obj => Array.isArray(obj)),
  regexp: (obj => obj instanceof RegExp),
  null: (obj => obj === null || obj === undefined),
  promise: (obj => obj instanceof Promise),
  typeof: (obj => primaryGuards.string(obj) &&
    (obj in primaryGuards || obj in unusualGuards)),
  keyof: (obj => ['string', 'number', 'symbol'].includes(typeOf(obj))),
  class: (obj => {
    if (!primaryGuards.function(obj))
      return false;
    try {
      Reflect.construct(String, [], obj);
    } catch (e) {
      return false;
    }
    return true;
  })
};
// General Type-Guard Proxy
const guards = {
  ...primaryGuards,
  ...unusualGuards
};
/*
##########################################################################################################################
#                                                       MISCELLANEOUS                                                    #
##########################################################################################################################
*/
// Define General Guard
const isType = ((obj, typeName) => {
  // Set Check Function
  const checkType = t => guards[t](obj);
  // Return Check
  if (!guards.array(typeName))
    return checkType(typeName);
  else
    return typeName.some(checkType);
});
/*
##########################################################################################################################
#                                                       MISCELLANEOUS                                                    #
##########################################################################################################################
*/
// Property Type-Guard
export function has(obj, key, typeName) {
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
// General Sets Type-Guard
export function are(obj, typeName) {
  // Check All
  return Object.values(obj).every(v => isType(v, typeName));
}
/*
##########################################################################################################################
#                                                       MISCELLANEOUS                                                    #
##########################################################################################################################
*/
// Assign Methods to General Guard
Object.defineProperties(isType, Object.getOwnPropertyDescriptors({
  ...guards,
  in: has,
  every: are
}));
// General Type-Guard
export const is = isType;
/*
##########################################################################################################################
#                                                       MISCELLANEOUS                                                    #
##########################################################################################################################
*/
// Function Return Type-Guard
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
