
// ##########################################################################################################################

// Imports
import { extend, is } from './guards'
import { ArgOf, Await, Callable } from './types'

// ##########################################################################################################################

// Safe Types Helpers
export type SafeReturn<T> = readonly [true, T] | readonly [false, Error]
type SafeProperties<A extends unknown[], R> = { async: SafeAsync<A, R> }

// Safe Types
export type Safe<A extends unknown[], R> = Callable<A, SafeReturn<R>> & SafeProperties<A, R>
export type SafeAsync<A extends unknown[], R> = Callable<A, Promise<SafeReturn<Await<R>>>> & SafeProperties<A, R>

// ##########################################################################################################################

// Type-Guard Proxy-Function Generator
const SafeProxyHandler = <
  F extends (...args: unknown[]) => unknown
>(): (
  ProxyHandler<Safe<ArgOf<F>, ReturnType<F>>>
) => ({
  // SuperGuard Call
  apply(
    target: unknown,
    thisArg: unknown,
    args: ArgOf<F>
  ): SafeReturn<ReturnType<F>> {
    // Ensure Type of target
    if (!is.function(target)) throw new Error('invalid target for Safe')
    if (!extend<(...a: ArgOf<F>) => ReturnType<F>>(target)) return null
    // Set Async Function
    const fthis: (...a: ArgOf<F>) => ReturnType<F> = (
      thisArg
        ? (...a: ArgOf<F>) => target.call(thisArg, ...a)
        : (...a: ArgOf<F>) => target(...a)
    )
    // Return Safe result
    try {
      return [true, fthis(...args)] as const
    } catch (error) {
      return [false, error] as const
    }
  },
  // SuperGuard Properties
  get<P extends string | symbol>(
    target: unknown,
    p: P,
    receiver: unknown
  ) {
    // Check Guard
    if (!is.function(target)) return undefined
    // Async Method
    if (p === 'async') return new Proxy(
      target as null,
      SafeAsyncProxyHandler<F>()
    )
    // Else
    return undefined
  },
  // General Methods
  set(target, p, value) { return null },
  deleteProperty(target, p) { return null },
  defineProperty(target, p, attr) { return null },
  ownKeys(target) { return ['async', 'sync'] },
  has(target, p) { return p in ['async', 'sync'] }
})

// ##########################################################################################################################

// Type-Guard Proxy-Function Generator
const SafeAsyncProxyHandler = <
  F extends (...args: unknown[]) => unknown
>(): (
  ProxyHandler<SafeAsync<ArgOf<F>, ReturnType<F>>>
) => {
  // Safe ProxyHandler
  const handler = SafeProxyHandler<F>()
  // SafeAsync ProxyHandler
  return {
    ...handler as {},
    // SafeAsync Call
    apply(
      target: unknown,
      thisArg: unknown,
      args: ArgOf<F>
    ): Promise<SafeReturn<Await<ReturnType<F>>>> {
      // Ensure Type of target
      if (!is.function(target)) throw new Error('invalid target for Safe')
      if (!extend<(...a: ArgOf<F>) => ReturnType<F>>(target)) return null
      // Set Async Function
      const fthis: (...a: ArgOf<F>) => Promise<Await<ReturnType<F>>> = (
        thisArg
          ? async (...a: ArgOf<F>) => await target.call(thisArg, ...a)
          : async (...a: ArgOf<F>) => await target(...a)
      )
      // Return SafeAsync result
      return new Promise(resolve => {
        // Await Then and Catch
        fthis(...args)
          .catch(error => {
            resolve([false, error] as const)
          })
          .then(value => {
            resolve([true, value || null] as const)
          })
      })
    }
  }
}

// ##########################################################################################################################

// Safe Pattern for Error Handling
export const safe = <
  A extends unknown[],
  R
>(
  fun: (...args: A) => R
): Safe<A, R> => {
  return new Proxy(
    fun as null,
    SafeProxyHandler<(...args: A) => R>()
  )
}

// ##########################################################################################################################

// Try something
export const repeat = async <T>(
  fun: () => T,
  verify: (value: T) => boolean | Promise<boolean>,
  loop: number = 3,
  delay: number = 0
): Promise<T> => {
  // Safe Functions
  const sfun = safe(fun)
  const sverify = safe(verify).async
  // Repeat Loop
  let i = 0
  while (i < loop) {
    // Yield control back to Event Loop and wait delay
    if (i > 0) await new Promise(resolve => setTimeout(resolve, delay))
    // execute function
    const [ok, value] = sfun()
    // if no error occurred
    if (ok) {
      // execute verify
      const [ok, cond] = await sverify(value as T)
      // check for result
      if (ok && cond) return value as T
    }
    i++
  }
  // Else
  throw Error('condition not satified')
}

// ##########################################################################################################################
