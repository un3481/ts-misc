/*
##########################################################################################################################
#                                                       MISCELLANEOUS                                                    #
##########################################################################################################################
*/

import { Extra, KeyOf, ValueOf, ReadonlyInclude } from './types.js'
import { is } from './guards.js'

/*
##########################################################################################################################
#                                                       MISCELLANEOUS                                                    #
##########################################################################################################################
*/

// Get Random Item of Array
export function rand<T extends ValueOf>(
  arr: ReadonlyInclude<Extra<KeyOf, T> | Array<T>>
): T {
  const keys = Object.keys(arr)
  const k = keys[Math.floor(Math.random() * keys.length)]
  return arr[k] as T
}

// Generate new Serial Object
export function generate<T>(
  obj: T,
  replacer?: (key: KeyOf, value: unknown) => unknown
): T {
  return JSON.parse(JSON.stringify(obj, replacer))
}

// Remove Cyclic References from Object
export function serialize<T>(obj: T): T {
  const seen = []
  const getCircularReplacer = (k, value) => {
    if (is.object(value)) {
      if (seen.indexOf(value) !== -1) return
      else seen.push(value)
    }
    return value
  }
  return generate(obj, getCircularReplacer)
}

/*
##########################################################################################################################
#                                                       MISCELLANEOUS                                                    #
##########################################################################################################################
*/
