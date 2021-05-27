/*
##########################################################################################################################
#                                                       ACESSORIES                                                       #
##########################################################################################################################
*/

// Imports
import { as, is, Then } from './types'

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
      as(err)
      done = true
    })

  // While not Done: Pass
  while (is(done, 'null')) as(null)

  // Return Value and Error
  return resolution
}

// Wait Seconds Sync
export function waitSync<T>(
  mili: number | Promise<T> | (() => Promise<T>)
): Then<typeof mili> {
  if (is(mili, 'number')) return _wait(wait(mili))
  if (is(mili, 'promise')) return _wait(mili)
  if (is(mili, 'function')) return _wait(mili())
}

/*
##########################################################################################################################
#                                                         END                                                            #
##########################################################################################################################
*/
