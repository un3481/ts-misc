/*
##########################################################################################################################
#                                                       MISCELLANEOUS                                                    #
##########################################################################################################################
*/
// Imports
import {
  is
} from './guards.js';
// Export Class No-Op
export class AsIs {
  constructor(obj) {
    return obj;
  }
}
// Super-Type Constructor
export function SuperConstructor(value) {
  return (is.string(value) ?
    (new String('' + value)) :
    is.number(value) ?
    (new Number(0 + value)) :
    is.boolean(value) ?
    (new Boolean(true && value)) :
    is.array(value) ?
    (new Array([...value])) :
    is.object(value) ?
    (new Object({
      ...value
    })) :
    value);
}
/*
##########################################################################################################################
#                                                       MISCELLANEOUS                                                    #
##########################################################################################################################
*/
// Get Primary Types
const primaryPrototype = typeof null;
/*
##########################################################################################################################
#                                                       MISCELLANEOUS                                                    #
##########################################################################################################################
*/
