/*
##########################################################################################################################
#                                                       MISCELLANEOUS                                                    #
##########################################################################################################################
*/

// Export Type No-Op
export type As<T> = T

// Intersection Type
export type Intersection<U> = (
  U extends unknown ? (...args: U[]) => void : never
) extends TFunction<infer I>
  ? ValueOf<I>
  : never

/*
##########################################################################################################################
#                                                       MISCELLANEOUS                                                    #
##########################################################################################################################
*/

// Type Of Function
export type TFunction<A extends unknown[] = unknown[], R = unknown> = (
  ...args: A
) => R

// Type Of Args Of Function
export type ArgOf<F extends TFunction> = F extends TFunction<infer A>
  ? A
  : never

/*
##########################################################################################################################
#                                                       MISCELLANEOUS                                                    #
##########################################################################################################################
*/

// Typeof Index Set
export type StringSet<T = unknown> = { [K in string]: T }
export type NumberSet<T = unknown> = { [key: number]: T }

// Typeof Generic Key
export type KeyOf<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  T extends Record<keyof any, unknown> = Record<keyof any, unknown>
> = T extends Record<infer K, unknown> ? K : never

// Typeof Generic Value
export type ValueOf<T extends GlobalSet = GlobalSet> = T extends GlobalSet<
  KeyOf,
  infer V
>
  ? V
  : never

// Typeof Generic Set
export type GlobalSet<K extends KeyOf = KeyOf, T = unknown> =
  | Record<K, T>
  | K extends string
  ? StringSet<T>
  : K extends number
  ? NumberSet<T>
  : Record<K, T>

// Export Type Has
export type Has<K extends KeyOf | KeyOf[], T = unknown> = K extends KeyOf
  ? GlobalSet<K, T>
  : K extends KeyOf[]
  ? GlobalSet<ValueOf<K>, T>
  : never

/*
##########################################################################################################################
#                                                       MISCELLANEOUS                                                    #
##########################################################################################################################
*/

// Return Type of Promise
export type PromiseThen<T extends Promise<unknown>> = T extends PromiseLike<
  infer R
>
  ? R
  : never

// Return Type of Async
export type AsyncThen<
  T extends TFunction<unknown[], Promise<unknown>>
> = PromiseThen<ReturnType<T>>

// Return Type of Promise or Async
export type Then<T> = T extends Promise<unknown>
  ? PromiseThen<T>
  : T extends TFunction<unknown[], Promise<unknown>>
  ? AsyncThen<T>
  : never

// Return Type of Promise
export type PromiseAwait<T> = T extends Promise<unknown>
  ? PromiseAwait<PromiseThen<T>>
  : T

// Return Type of Await Promise or Async
export type Await<T> =
  | PromiseAwait<T>
  | (T extends Promise<unknown>
      ? PromiseAwait<T>
      : T extends TFunction<unknown[], Promise<unknown>>
      ? PromiseAwait<ReturnType<T>>
      : T)

/*
##########################################################################################################################
#                                                       MISCELLANEOUS                                                    #
##########################################################################################################################
*/

// Primary Type Symbols
export type PrimaryTypes =
  | 'null'
  | 'unknown'
  | 'undefined'
  | 'boolean'
  | 'true'
  | 'false'
  | 'number'
  | 'string'
  | 'symbol'
  | 'object'
  | 'array'
  | 'function'
  | 'promise'
  | 'date'

// Primary Type Generator
export type PrimaryType<V extends PrimaryTypes = 'unknown'> =
  | PrimaryTypeGuard<V, 'null', null>
  | PrimaryTypeGuard<V, 'unknown', unknown>
  | PrimaryTypeGuard<V, 'undefined', undefined>
  | PrimaryTypeGuard<V, 'boolean', boolean>
  | PrimaryTypeGuard<V, 'true', true>
  | PrimaryTypeGuard<V, 'false', false>
  | PrimaryTypeGuard<V, 'number', number>
  | PrimaryTypeGuard<V, 'string', string>
  | PrimaryTypeGuard<V, 'symbol', symbol>
  | PrimaryTypeGuard<V, 'object', StringSet>
  | PrimaryTypeGuard<V, 'array', unknown[]>
  | PrimaryTypeGuard<V, 'function', TFunction>
  | PrimaryTypeGuard<V, 'promise', Promise<unknown>>
  | PrimaryTypeGuard<V, 'date', Date>

// Type To Iterate
type PrimaryTypeGuard<
  V extends PrimaryTypes,
  L extends PrimaryTypes,
  T
> = V extends L ? T : never

/*
##########################################################################################################################
#                                                       MISCELLANEOUS                                                    #
##########################################################################################################################
*/

// Type-Guard Interface
export type ITypeGuard = (obj: unknown, ...args: unknown[]) => boolean

// Generic Type-Guard Type
export type TypeGuard<T, A extends unknown[] = unknown[]> = (
  obj: unknown,
  ...args: A
) => obj is T

/*
##########################################################################################################################
#                                                       MISCELLANEOUS                                                    #
##########################################################################################################################
*/

// General Make Type-Guard
export function extend<T>(obj: unknown): obj is As<T> {
  return true
}

// General Set Type-Guard
export function guard<T>(tg: ITypeGuard): TypeGuard<T> {
  if (extend<TypeGuard<T>>(tg)) return tg
}

/*
##########################################################################################################################
#                                                       MISCELLANEOUS                                                    #
##########################################################################################################################
*/

// Null Type-Guard
export function isNull(obj: unknown): obj is undefined | null {
  if (obj === null || obj === undefined) return true
  else return false
}

// Boolean Type-Guard
export function isBoolean(obj: unknown): obj is boolean {
  if (isNull(obj) || typeof obj !== 'boolean') return false
  else return true
}

// Number Type-Guard
export function isNumber(obj: unknown): obj is number {
  if (isNull(obj) || typeof obj !== 'number') return false
  else return true
}

// String Type-Guard
export function isString(obj: unknown): obj is string {
  if (isNull(obj) || typeof obj !== 'string') return false
  else return true
}

// Object Type-Guard
export function isObject(obj: unknown): obj is StringSet {
  if (isNull(obj) || typeof obj !== 'object') return false
  else return true
}

// Array Type-Guard
export function isArray(obj: unknown): obj is unknown[] {
  if (isNull(obj) || !Array.isArray(obj)) return false
  else return true
}

// Date Type-Guard
export function isDate(obj: unknown): obj is Date {
  if (isNull(obj) || !isObject(obj)) return false
  if (obj instanceof Date) return true
  else return false
}

// Promise Type-Guard
export function isPromise(obj: unknown): obj is Promise<unknown> {
  if (isNull(obj) || !isObject(obj)) return false
  if (obj instanceof Promise) return true
  else return false
}

// Function Type-Guard
export function isFunction(obj: unknown): obj is TFunction {
  if (isNull(obj) || typeof obj !== 'function') return false
  else return true
}

/*
##########################################################################################################################
#                                                       MISCELLANEOUS                                                    #
##########################################################################################################################
*/

// General Type-Guard
export function is<T extends PrimaryTypes>(
  obj: unknown,
  typeName: T | T[]
): obj is PrimaryType<T> {
  // Set Check Function
  const checkType = (t: T) => {
    if (t === 'unknown') return true
    if (t === 'null') return isNull(obj)
    if (t === 'array') return isArray(obj)
    if (t === 'promise') return isPromise(obj)
    if (t === 'date') return isDate(obj)
    if (t === 'true') return obj === true
    if (t === 'false') return obj === false
    else return typeof obj === t
  }

  // Return Check
  if (!isArray(typeName)) return checkType(typeName)
  else return typeName.some(checkType)
}

// Property Type-Guard
export function has<K extends KeyOf, T extends PrimaryTypes>(
  obj: GlobalSet,
  key: K | K[],
  typeName?: T | T[]
): obj is Intersection<Has<K, PrimaryType<T>>> {
  // Set Check Function
  const checkType = (o: GlobalSet, k: KeyOf): o is Has<K, PrimaryType<T>> =>
    typeName ? is(o[k], typeName) : true

  // Perform Key Check
  const checkKey = (o: GlobalSet, k: KeyOf): o is Has<K, unknown> => {
    if (k in o) return checkType(o, k)
    if (Object.prototype.hasOwnProperty.call(o, k)) return checkType(o, k)
    if (isString(k) && isObject(o) && Object.keys(o).includes(k)) {
      return checkType(o, k)
    } else return false
  }

  // Return Check
  if (!isArray(key)) return checkKey(obj, key)
  else return key.every(k => checkKey(obj, k))
}

// General Sets Type-Guard
export function are<K extends KeyOf, T extends PrimaryTypes>(
  obj: GlobalSet<K>,
  typeName: T | T[]
): obj is GlobalSet<K, PrimaryType<T>> {
  // Check All
  return Object.values(obj).every(v => is(v, typeName))
}

/*
##########################################################################################################################
#                                                       MISCELLANEOUS                                                    #
##########################################################################################################################
*/

export type ValidatorTypes =
  | 'string'
  | 'boolean'
  | 'number'
  | 'array'
  | 'string?'
  | 'boolean?'
  | 'number?'

export type ValidatorDefinition<T> = {
  [key in keyof T]: T[key] extends string
    ? 'string' | 'string?'
    : T[key] extends number
    ? 'number' | 'number?'
    : T[key] extends boolean
    ? 'boolean' | 'boolean?'
    : T[key] extends Array<infer TArrayItem>
    ? Array<ValidatorDefinition<TArrayItem>>
    : ValidatorTypes
}

export function typeGuardFactory<T>(
  reference: ValidatorDefinition<T>
): (value: unknown) => value is T {
  const validators: ((propertyValue: unknown) => boolean)[] = Object.keys(
    reference
  ).map(key => {
    const referenceValue = (<unknown>reference)[key]
    switch (referenceValue) {
      case 'string':
        return v => typeof v[key] === 'string'
      case 'boolean':
        return v => typeof v[key] === 'boolean'
      case 'number':
        return v => typeof v[key] === 'number'
      case 'string?':
        return v => v[key] == null || typeof v[key] === 'string'
      case 'boolean?':
        return v => v[key] == null || typeof v[key] === 'boolean'
      case 'number?':
        return v => v[key] == null || typeof v[key] === 'number'
      default:
        // we are not accepting null/undefined for empty array... Should decide how to
        // handle/configure the specific case
        if (Array.isArray(referenceValue)) {
          const arrayItemValidator = typeGuardFactory<unknown>(
            referenceValue[0]
          )
          return v => Array.isArray(v[key]) && v[key].every(arrayItemValidator)
        }
        // TODO: handle default case
        return _v => false && _v
    }
  })
  return (value: T): value is T =>
    (value && validators.every(validator => validator(value))) || false
}

/*
##########################################################################################################################
#                                                       MISCELLANEOUS                                                    #
##########################################################################################################################
*/
