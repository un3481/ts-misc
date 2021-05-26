/*
##########################################################################################################################
#                                                       ACESSORIES                                                       #
##########################################################################################################################
*/

// Imports
import * as typeGuards from './type-guards'
import * as handle from './handle'
import * as time from './time'

/*
##########################################################################################################################
#                                                       MISCELLANEOUS                                                    #
##########################################################################################################################
*/

// Miscellaneous Class
export default class Miscellaneous {
  // Miscellaneous Set
  typeGuards = typeGuards
  handle = handle
  time = time

  // Allow Info Inside Misc
  get misc() { return this }

  // Get Random Item of Array
  rand(arr: Record<string | number, any>): any {
    const karr = Object.keys(arr)
    const k = karr[Math.floor(Math.random() * karr.length)]
    return arr[k]
  }

  // Round Number
  round(number: number, precision = 0): number {
    return parseFloat(Number(number).toFixed(precision))
  }

  // Remove Cyclic References from Object
  serialize(obj: unknown): unknown {
    const seen = new WeakSet()
    const getCircularReplacer = (key, value) => {
      if (typeof value === 'object' && value !== null) {
        if (seen.has(value)) return
        else seen.add(value)
      }
      return value
    }
    return JSON.parse(
      JSON.stringify(obj, getCircularReplacer)
    )
  }
}

/*
##########################################################################################################################
#                                                         END                                                            #
##########################################################################################################################
*/
