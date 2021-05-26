
/*
##########################################################################################################################
#                                                       MISCELLANEOUS                                                    #
##########################################################################################################################
*/

// Export Type No-Op
export type As<T> = T

// Export Type Has (Property | Index | Symbol)
export type HasProperty<Property extends string> = { [P in Property]: unknown | P }
export type HasIndex<Index extends number> = { [I in Index]: unknown | I }
export type HasSymbol<Symbol extends symbol> = { [S in Symbol]: unknown | S }

// Export Type Has
export type Has<Key extends number | string | symbol> =
  Key extends number ? HasIndex<Key>
  : Key extends string ? HasProperty<Key>
  : Key extends symbol ? HasSymbol<Key> : {}

// Return Type of Promise
export type PromiseThen<T, F = never> =
  T extends PromiseLike<infer U> ? U
  : F extends never ? T : F

// Return Type of Async
export type AsyncThen<T, F = never> =
  T extends (...args: any) => any ? PromiseThen<ReturnType<T>, F>
  : F extends never ? T : F

// Return Type of Promise or Async
export type Then<T, F = never> =
  T extends (...args: any) => any ? AsyncThen<T, F>
  : PromiseThen<T, F>

// Type Of Function
export type TFunction<A extends Array<any>, T> = (...args: A) => T

/*
##########################################################################################################################
#                                                       MISCELLANEOUS                                                    #
##########################################################################################################################
*/

// Default TypeGuards
export function isNull(obj: unknown): obj is undefined | null {
  if (obj === null || obj === undefined) return true
  else return false
}

export function isBoolean(obj: unknown): obj is boolean {
  if (isNull(obj) || typeof obj !== 'boolean') return false
  else return true
}

export function isNumber(obj: unknown): obj is number {
  if (isNull(obj) || typeof obj !== 'number') return false
  else return true
}

export function isString(obj: unknown): obj is string {
  if (isNull(obj) || typeof obj !== 'string') return false
  else return true
}

export function isObject(obj: unknown): obj is Record<string, unknown> {
  if (isNull(obj) || typeof obj !== 'object') return false
  else return true
}

export function has<T extends string | number | symbol>(
  obj: Record<string | number | symbol, unknown> | unknown[],
  key: T
): obj is Has<typeof key> {
  if (isNumber(key) && Array.isArray(obj) && obj.length >= key + 1) return true
  if (
    isString(key) && isObject(obj) &&
    (Object.keys(obj).includes(key) ||
      Object.prototype.hasOwnProperty.call(obj, key))
  ) {
    return true
  } else return key in obj
}

export function isFunction(
  obj: unknown
): obj is (...args: unknown[]) => unknown {
  if (isNull(obj) || typeof obj !== 'function') return false
  else return true
}

export function isDate(obj: unknown): obj is Date {
  if (isNull(obj) || !isObject(obj)) return false
  if (obj instanceof Date) return true
  else return false
}

// Check if Is Promise
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
    : (T[key] extends Array<infer TArrayItem>
        ? Array<ValidatorDefinition<TArrayItem>>
        : ValidatorTypes)
}

export function typeGuardFactory<T>(
  reference: ValidatorDefinition<T>
): (value: any) => value is T {
  const validators: ((propertyValue: any) => boolean)[] = Object.keys(
    reference
  ).map(key => {
    const referenceValue = (<any>reference)[key]
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
          const arrayItemValidator = typeGuardFactory<any>(referenceValue[0])
          return v => Array.isArray(v[key]) && v[key].every(arrayItemValidator)
        }
        // TODO: handle default case
        return _v => false
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
