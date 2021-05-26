/*
##########################################################################################################################
#                                                       ACESSORIES                                                       #
##########################################################################################################################
*/

// Imports
import { isFunction, PromiseThen } from './type-guards'
import { wait, waitSync } from './time'

/*
##########################################################################################################################
#                                                          TYPES                                                         #
##########################################################################################################################
*/

export type TSafeReturn<T> = [T, Error]
export type TSafe<T> = (...args: unknown[]) => Promise<TSafeReturn<T>>
export type TSafeSync<T> = (...args: unknown[]) => TSafeReturn<T>

/*
##########################################################################################################################
#                                                       MISCELLANEOUS                                                    #
##########################################################################################################################
*/

// Safe Pattern for Error Handling
export const safe: <T>(
  func: (...args: unknown[]) => T,
  that?: any
) => TSafe<PromiseThen<T>> = (
  func, that = null
) => {
  // Check Params
  if (!isFunction(func)) return

  // Set Async Function
  const fasync = that
    ? async(...args: unknown[]) => func.call(that, ...args)
    : async(...args: unknown[]) => func(...args)

  // Return Decorated Function
  return async (...args: unknown[]) => {
    // Set Variables
    let value
    let error: Error

    // Await Then and Catch
    await new Promise(resolve => {
      // Execute Async Function
      fasync(...args)
        .catch(err => {
          error = err
          resolve(null)
        })
        .then(val => {
          value = val
          resolve(null)
        })
    })

    // Return Value and Error
    return [value, error]
  }
}

// Safe Pattern for Synchrounous Error Handling
export const safeSync: <T>(
  func: (...args: unknown[]) => T,
  that?: any
) => TSafeSync<PromiseThen<T>> = (
  func, that = null
) => {
  // Check Params
  if (!isFunction(func)) return

  // Set Async Function
  const safeFunction = safe(func, that)

  // Return Decorated Function
  return (...args: unknown[]) => {
    // Execute Async Function
    const promise = safeFunction(...args)
    const resolution = waitSync(promise)

    // Return Value and Error
    return resolution
  }
}

/*
##########################################################################################################################
#                                                       MISCELLANEOUS                                                    #
##########################################################################################################################
*/

// Try something
export const repeat: <T>(
  exec: () => T,
  verify: <T>(res: T) => boolean | Promise<boolean>,
  repeat?: number,
  delay?: number
) => Promise<PromiseThen<T>> = async(
  exec, verify, loop = 10, delay = 1
) => {
  // Set Variables
  let i = 0
  const safeFunction = safe(exec)
  const safeVerify = safe(verify)

  // Try Loop
  while (i < loop) {
    // wait delay
    if (i > 0) await wait(delay)
    // execute function
    const [res, error] = await safeFunction()
    // if no error occurred
    if (!error) {
      // execute verify
      const [cond, condError] = await safeVerify(res)
      // check for result
      if (cond && !condError) return res
    }
    i++
  }
  throw Error()
}

// Try Something Synchronously
export const repeatSync: <T>(
  exec: () => T,
  verify: <T>(res: T) => boolean | Promise<boolean>,
  repeat?: number,
  delay?: number
) => TSafeReturn<PromiseThen<T>> = (
  exec, verify, loop = 10, delay = 1
) => {
  const toRepeat = () => repeat(exec, verify, loop, delay)
  const callSync = safeSync(toRepeat)
  return callSync()
}

/*
##########################################################################################################################
#                                                         END                                                            #
##########################################################################################################################
*/
