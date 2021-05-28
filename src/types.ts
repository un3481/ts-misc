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

// Return Type of Promise
export type PromiseThen<T extends Promise<unknown>> = T extends PromiseLike<
  infer R
>
  ? R
  : never

// Return Type of Async
export type AsyncThen<
  T extends TFunction<unknown[], Promise<unknown>>
> = T extends TFunction ? PromiseThen<ReturnType<T>> : never

// Return Type of Promise or Async
export type Then<T> = T extends Promise<unknown>
  ? PromiseThen<T>
  : T extends TFunction<unknown[], Promise<unknown>>
  ? AsyncThen<T>
  : never

// Type Of Function
export type TFunction<A extends unknown[] = unknown[], R = unknown> = (
  ...args: A
) => R

// Primary Type Symbols
export type PrimaryTypeSymbols =
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

// Type To Iterate
type SetPrimaryType<
  V extends PrimaryTypeSymbols,
  L extends PrimaryTypeSymbols,
  T
> = V extends L ? T : never

// Primary Type Generator
export type PrimaryType<V extends PrimaryTypeSymbols = 'unknown'> =
  | SetPrimaryType<V, 'null', null>
  | SetPrimaryType<V, 'unknown', unknown>
  | SetPrimaryType<V, 'undefined', undefined>
  | SetPrimaryType<V, 'boolean', boolean>
  | SetPrimaryType<V, 'true', true>
  | SetPrimaryType<V, 'false', false>
  | SetPrimaryType<V, 'number', number>
  | SetPrimaryType<V, 'string', string>
  | SetPrimaryType<V, 'symbol', symbol>
  | SetPrimaryType<V, 'object', StringSet>
  | SetPrimaryType<V, 'array', unknown[]>
  | SetPrimaryType<V, 'function', TFunction>
  | SetPrimaryType<V, 'promise', Promise<unknown>>
  | SetPrimaryType<V, 'date', Date>
  | never

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

// General No-Op Type-Guard
export function as<T>(obj: T): obj is As<T> {
  return true
}

// General Type-Guard
export function is<T extends PrimaryTypeSymbols>(
  obj: unknown,
  typeName: T | T[]
): obj is PrimaryType<T> {
  // Set Check Function
  const check = (t: T) => {
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
  if (!isArray(typeName)) return check(typeName)
  else return typeName.some(check)
}

// Property Type-Guard
export function has<K extends KeyOf, T extends PrimaryTypeSymbols>(
  obj: GlobalSet,
  key: K | K[],
  keyType?: T | T[]
): obj is Intersection<Has<K, PrimaryType<T>>> {
  // Set Check Function
  const checkType = (k: KeyOf) => (keyType ? is(obj[k], keyType) : true)

  // Perform Key Check
  const checkKey = (k: KeyOf) => {
    if (k in obj) return checkType(k)
    if (Object.prototype.hasOwnProperty.call(obj, k)) return checkType(k)
    if (isString(k) && isObject(obj) && Object.keys(obj).includes(k)) {
      return checkType(k)
    } else return false
  }

  // Return Check
  if (!isArray(key)) return checkKey(key)
  else return key.every(checkKey)
}

// General Sets Type-Guard
export function are<K extends KeyOf, T extends PrimaryTypeSymbols>(
  obj: GlobalSet<K>,
  typeName: T | T[]
): obj is GlobalSet<K, PrimaryType<T>> {
  // Check All
  return Object.values(obj).every(v => is(v, typeName))
}

// General Make Type-Guard
export function test<T>(
  tg: TFunction<unknown[], boolean>,
  args: unknown[]
): obj is T {
  // Check All
  return tg(...args)
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
