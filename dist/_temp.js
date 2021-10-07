/*
##########################################################################################################################
#                                                       MISCELLANEOUS                                                    #
##########################################################################################################################
*/
import {
  extend,
  is
} from './utils/guards.js';
export function typeGuardFactory(reference) {
  const validators = Object.keys(reference).map(key => {
    const referenceValue = reference[key];
    switch (referenceValue) {
      case 'string':
        return v => typeof v[key] === 'string';
      case 'boolean':
        return v => typeof v[key] === 'boolean';
      case 'number':
        return v => typeof v[key] === 'number';
      case 'string?':
        return v => v[key] == null || typeof v[key] === 'string';
      case 'boolean?':
        return v => v[key] == null || typeof v[key] === 'boolean';
      case 'number?':
        return v => v[key] == null || typeof v[key] === 'number';
      default:
        // we are not accepting null/undefined for empty array... Should decide how to
        // handle/configure the specific case
        if (Array.isArray(referenceValue)) {
          const arrayItemValidator = typeGuardFactory(referenceValue[0]);
          return v => Array.isArray(v[key]) && v[key].every(arrayItemValidator);
        }
        // TODO: handle default case
        return _v => false && _v;
    }
  });
  return (value) => (value && validators.every(validator => validator(value))) || false;
}
/*
##########################################################################################################################
#                                                       MISCELLANEOUS                                                    #
##########################################################################################################################
*/
// Tests
let a;
const e = {
  e: 1,
  e2: 2
};
if (!extend(e))
  throw Error;
e.e3 = 4;
// Is with key or array
if (is.string(a) || is.number(a))
  console.log(a);
if (is(a, ['string', 'number']))
  console.log(a);
// Has without type declaration (good)
if (is.in(e, 'e4', 'string'))
  console.log(e);
// Has with type declaration (broken infer)
if (is.in(e, 'e4', 'string'))
  console.log(e);
