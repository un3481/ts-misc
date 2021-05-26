/*
##########################################################################################################################
#                                                       MISCELLANEOUS                                                    #
##########################################################################################################################
*/

// Export Type No-Op
export type As<T> = T

// Typeof Generic Set
export type GenericKey = string | number | symbol
export type GenericSet<K extends GenericKey = GenericKey, T = unknown> = Record<
  K,
  T
>

// Typeof Specific Set
export type StringSet<T = unknown> = { [key: string]: T }
export type NumberSet<T = unknown> = { [key: number]: T }

// Typeof Global Set
export type GlobalSet = GenericSet | StringSet | NumberSet

// Type Of Function
export type TFunction<A extends unknown[] = unknown[], T = unknown> = (
  ...args: A
) => T

// Export Type Has (Property | Index | Symbol)
export type HasProperty<Key extends string> = { [K in Key]: unknown }
export type HasSymbol<Key extends symbol> = { [K in Key]: unknown }
export type HasIndex<Key extends number> = { [K in Key]: unknown }

// Export Type Has
export type Has<Key extends GenericKey> = Key extends number
  ? HasIndex<Key>
  : Key extends string
  ? HasProperty<Key>
  : Key extends symbol
  ? HasSymbol<Key>
  : GlobalSet

// Return Type of Promise
export type PromiseThen<T, F = never> = T extends PromiseLike<infer U>
  ? U
  : F extends never
  ? T
  : F

// Return Type of Async
export type AsyncThen<T, F = never> = T extends TFunction
  ? PromiseThen<ReturnType<T>, F>
  : F extends never
  ? T
  : F

// Return Type of Promise or Async
export type Then<T, F = never> = T extends TFunction
  ? AsyncThen<T, F>
  : PromiseThen<T, F>

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

// Property Type-Guard
export function has<T extends GenericKey>(
  obj: GlobalSet,
  key: T
): obj is Has<typeof key> {
  if (isNumber(key) && Array.isArray(obj) && obj.length >= key + 1) return true
  if (
    isString(key) &&
    isObject(obj) &&
    (Object.keys(obj).includes(key) ||
      Object.prototype.hasOwnProperty.call(obj, key))
  ) {
    return true
  } else return key in obj
}

// Function Type-Guard
export function isFunction(obj: unknown): obj is TFunction {
  if (isNull(obj) || typeof obj !== 'function') return false
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
