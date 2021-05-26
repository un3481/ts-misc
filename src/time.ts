/*
##########################################################################################################################
#                                                       ACESSORIES                                                       #
##########################################################################################################################
*/

// Imports
import { isNull, isNumber, isFunction, isPromise, Then } from './types'

/*
##########################################################################################################################
#                                                       MISCELLANEOUS                                                    #
##########################################################################################################################
*/

// Get Date
export function timestamp(): string {
  return new Date().toLocaleString('pt-BR', {
    timeZone: 'America/Fortaleza'
  })
}

// Wait Seconds
export function wait(mili: number): Promise<null> {
  return new Promise(resolve => setTimeout(resolve, mili))
}

// Wait for Promise
const _wait: <T>(promise: Promise<T>) => T = promise => {
  // Set Variables
  let resolution
  let done: boolean

  // Execute Async Function
  promise
    .then(val => {
      resolution = val
      done = true
    })
    .catch(err => {
      isNull(err)
      done = true
    })

  // While not Done: Pass
  while (isNull(done)) isNull(null)

  // Return Value and Error
  return resolution
}

// Wait Seconds Sync
export function waitSync<T>(
  mili: number | Promise<T> | (() => Promise<T>)
): Then<typeof mili> {
  if (isNumber(mili)) return _wait(wait(mili))
  if (isPromise(mili)) return _wait(mili)
  if (isFunction(mili)) {
    const res = mili()
    if (!isPromise(res)) return res
    else return _wait(res)
  }
}

/*
##########################################################################################################################
#                                                         END                                                            #
##########################################################################################################################
*/
