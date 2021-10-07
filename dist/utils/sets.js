/*
##########################################################################################################################
#                                                       MISCELLANEOUS                                                    #
##########################################################################################################################
*/
import {
  is
} from './guards.js';
/*
##########################################################################################################################
#                                                       MISCELLANEOUS                                                    #
##########################################################################################################################
*/
// Get Random Item of Array
export function rand(arr) {
  const keys = Object.keys(arr);
  const k = keys[Math.floor(Math.random() * keys.length)];
  return arr[k];
}
// Generate new Serial Object
export function generate(obj, replacer) {
  return JSON.parse(JSON.stringify(obj, replacer));
}
// Remove Cyclic References from Object
export function serialize(obj) {
  const seen = [];
  const getCircularReplacer = (k, value) => {
    if (is.object(value)) {
      if (seen.indexOf(value) !== -1)
        return;
      else
        seen.push(value);
    }
    return value;
  };
  return generate(obj, getCircularReplacer);
}
/*
##########################################################################################################################
#                                                       MISCELLANEOUS                                                    #
##########################################################################################################################
*/
