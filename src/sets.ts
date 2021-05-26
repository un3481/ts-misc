/*
##########################################################################################################################
#                                                       MISCELLANEOUS                                                    #
##########################################################################################################################
*/

import type { GenericSet, GenericKey } from './types'

/*
##########################################################################################################################
#                                                       MISCELLANEOUS                                                    #
##########################################################################################################################
*/

// Get Random Item of Array
export function rand<T>(arr: GenericSet<GenericKey, T>): T {
  const keys = Object.keys(arr)
  const k = keys[Math.floor(Math.random() * keys.length)]
  return arr[k]
}

// Generate new Serial Object
export function generate<T>(
  obj: T,
  replacer?: (key: GenericKey, value: unknown) => unknown
): T {
  return JSON.parse(JSON.stringify(obj, replacer))
}

// Remove Cyclic References from Object
export function serialize<T>(obj: T): T {
  const seen = new WeakSet()
  const getCircularReplacer = (k, value) => {
    if (this.typeGuards.isObject(value)) {
      if (seen.has(value)) return
      else seen.add(value)
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
