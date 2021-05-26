/*
##########################################################################################################################
#                                                       ACESSORIES                                                       #
##########################################################################################################################
*/

// Imports
import { PromiseThen } from './type-guards'
import { wait, waitSync } from './time'

/*
##########################################################################################################################
#                                                          TYPES                                                         #
##########################################################################################################################
*/

// Safe Execution Types
export type TSafeReturn<T> = [T, Error]
export type TSafe<A extends Array<any>, T> = (...args: A) => Promise<TSafeReturn<T>>
export type TSafeSync<A extends Array<any>, T> = (...args: A) => TSafeReturn<T>

/*
##########################################################################################################################
#                                                       MISCELLANEOUS                                                    #
##########################################################################################################################
*/

// Safe Pattern for Error Handling
export function safe<A extends Array<any>, T>(
  func: (...args: A) => T,
  that?: any
): TSafe<A, PromiseThen<T>> {
  // Set Async Function
  const fasync: (...args: A) => Promise<PromiseThen<T>> = that
    ? async(...args: A) => await func.call(that, ...args)
    : async(...args: A) => await func(...args)

  // Return Decorated Function
  return async (...args: A) => {
    // Set Variables
    let value: PromiseThen<T>
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
          value = val || null
          resolve(null)
        })
    })

    // Return Value and Error
    return [value, error]
  }
}

// Safe Pattern for Synchrounous Error Handling
export function safeSync<A extends Array<any>, T>(
  func: (...args: A) => T,
  that?: any
): TSafeSync<A, PromiseThen<T>> {
  // Set Async Function
  const safeFunction = safe(func, that)

  // Return Decorated Function
  return (...args: A) => {
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
export async function repeat<T>(
  exec: () => T,
  verify: (res: PromiseThen<T>) => boolean | Promise<boolean>,
  loop = 10,
  delay = 1
): Promise<PromiseThen<T>> {
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
export function repeatSync<T>(
  exec: () => T,
  verify: <T>(res: T) => boolean | Promise<boolean>,
  loop = 10,
  delay = 1
): TSafeReturn<PromiseThen<T>> {
  const callSync = safeSync(repeat)
  return callSync(exec, verify, loop, delay)
}

/*
##########################################################################################################################
#                                                         END                                                            #
##########################################################################################################################
*/
