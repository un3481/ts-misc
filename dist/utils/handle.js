/*
##########################################################################################################################
#                                                       ACESSORIES                                                       #
##########################################################################################################################
*/
// Imports
import {
  wait,
  waitSync
} from './sync.js';
/*
##########################################################################################################################
#                                                       MISCELLANEOUS                                                    #
##########################################################################################################################
*/
// Safe Pattern for Error Handling
export function safe(func, that) {
  // Set Async Function
  const fasync = that ?
    async (...args) => await func.call(that, ...args): async (...args) => await func(...args);
  // Return Decorated Function
  return async (...args) => {
    // Set Variables
    let value;
    let error;
    // Await Then and Catch
    await new Promise(resolve => {
      // Execute Async Function
      fasync(...args)
        .catch(err => {
          error = err;
          resolve(null);
        })
        .then(val => {
          value = val || null;
          resolve(null);
        });
    });
    // Return Value and Error
    return [value, error];
  };
}
// Safe Pattern for Synchrounous Error Handling
export function safeSync(func, that) {
  // Set Async Function
  const safeFunction = safe(func, that);
  // Return Decorated Function
  return (...args) => {
    // Execute Async Function
    const promise = safeFunction(...args);
    const resolution = waitSync(promise);
    // Return Value and Error
    return resolution;
  };
}
/*
##########################################################################################################################
#                                                       MISCELLANEOUS                                                    #
##########################################################################################################################
*/
// Try something
export async function repeat(exec, verify, loop = 10, delay = 1) {
  // Set Variables
  let i = 0;
  const safeFunction = safe(exec);
  const safeVerify = safe(verify);
  // Try Loop
  while (i < loop) {
    // wait delay
    if (i > 0)
      await wait(delay);
    // execute function
    const [res, error] = await safeFunction();
    // if no error occurred
    if (!error) {
      // execute verify
      const [cond, condError] = await safeVerify(res);
      // check for result
      if (cond && !condError)
        return res;
    }
    i++;
  }
  throw Error();
}
// Try Something Synchronously
export function repeatSync(exec, verify, loop = 10, delay = 1) {
  const callSync = safeSync(repeat);
  return callSync(exec, verify, loop, delay);
}
/*
##########################################################################################################################
#                                                         END                                                            #
##########################################################################################################################
*/
