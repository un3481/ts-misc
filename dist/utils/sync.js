/*
##########################################################################################################################
#                                                       ACESSORIES                                                       #
##########################################################################################################################
*/
// Imports
import {
  pass
} from './utils.js';
import {
  is
} from './guards.js';
/*
##########################################################################################################################
#                                                       MISCELLANEOUS                                                    #
##########################################################################################################################
*/
// Get Date
export function timestamp() {
  return new Date().toLocaleString('pt-BR', {
    timeZone: 'America/Fortaleza'
  });
}
// Wait Seconds
export function wait(mili) {
  return new Promise(resolve => setTimeout(v => {
    resolve(v);
  }, mili));
}
// Wait for Promise
function sync(promise) {
  // Set Variables
  let resolution = null;
  let done = false;
  // Execute Async Function
  promise
    .then(val => {
      resolution = val;
      done = true;
    })
    .catch(_err => {
      done = true;
    });
  // While not Done: Pass
  while (!done)
    pass(null);
  // Return Value
  return resolution;
}
// Wait Seconds Sync
export function waitSync(mili) {
  // Wait Each Option
  if (is.number(mili))
    return sync(wait(mili));
  if (is.promise(mili))
    return sync(mili);
  if (is.function(mili))
    return sync(mili());
}
/*
##########################################################################################################################
#                                                         END                                                            #
##########################################################################################################################
*/
