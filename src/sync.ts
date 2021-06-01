/*
##########################################################################################################################
#                                                       ACESSORIES                                                       #
##########################################################################################################################
*/

// Imports
import { is, Then } from './types'
import { pass } from './utils'

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
const sync: <T>(promise: Promise<T>) => T = promise => {
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
      done = true
      pass(err)
    })

  // While not Done: Pass
  while (is(done, 'null')) pass(null)

  // Return Value and Error
  return resolution
}

// Wait Seconds Sync
export function waitSync<
  T extends number | Promise<unknown> | (() => Promise<R>),
  R extends T extends number ? null : Then<T>
>(mili: T): R {
  // Wait Each Option
  if (is(mili, 'number')) return sync(wait(mili as number))
  if (is(mili, 'promise')) return sync(mili as Promise<R>)
  if (is(mili, 'function')) return sync(mili() as Promise<R>)
}

/*
##########################################################################################################################
#                                                         END                                                            #
##########################################################################################################################
*/
