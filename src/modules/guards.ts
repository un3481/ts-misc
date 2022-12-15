// ##########################################################################################################################

import {
  Is,
  And,
  Set,
  Type,
  Types,
  KeyOf,
  Callable,
  PrimaryTypes,
  ExtendedTypes,
  TypeGuard,
  TypeGuardLike,
  Guards,
  SuperGuard,
  SuperGuards,
  Has,
  GuardHas,
  GuardArrayOf,
  GuardObjectOf,
  GuardDescriptor,
  ReadonlyInclude,
  TypeFromGuardDescriptor,
  TypeFromGuardOrDescriptor,
  GuardOrDescriptor
} from './types'

// ##########################################################################################################################

// General Make Type-Guard
export const extend = <T, O = unknown>(
  obj: unknown
): obj is (
  T extends {}
    ? (O extends {} ? And<O & T> : O & T)
    : O & T
) => {
  return true
}

// General Set Type-Guard
export const guard = <T>(
  tg: TypeGuardLike
): TypeGuard<T> => {
  if (extend<TypeGuard<T>>(tg)) return tg
}

// ##########################################################################################################################

// Get Type-Of Object using 'ToString' Method
export const typeOf = (obj: unknown): string => {
  return Object
    .toString
    .call(obj)
    .match(/\s([a-zA-Z]+)/)[1]
    .toLowerCase()
}

// ##########################################################################################################################

// Check Primary Types
const setGuard = <N extends Types>(
  typeName: N,
  constructor: Callable | undefined
): TypeGuard<Type<N>, []> => {
  return (o: unknown): o is Type<N> => {
    // eslint-disable-next-line valid-typeof
    return (typeof o === typeName) || (constructor ? o instanceof constructor : o === undefined)
  }
}

// ##########################################################################################################################

// Primary Type-Guard Object
const primaryGuards: Guards<PrimaryTypes> = {
  undefined: setGuard( 'undefined', undefined ),
  string:    setGuard( 'string',    String    ),
  number:    setGuard( 'number',    Number    ),
  bigint:    setGuard( 'bigint',    BigInt    ),
  symbol:    setGuard( 'symbol',    Symbol    ),
  boolean:   setGuard( 'boolean',   Boolean   ),
  function:  setGuard( 'function',  Function  ),
  object:    (obj => (obj || false) && setGuard('object', Object)(obj)) as TypeGuard<{}>
}

// Extended Type-Guard Object
const extendedGuards: Guards<ExtendedTypes> = {
  any:     (obj => true) as TypeGuard<unknown>,
  never:   (obj => false) as TypeGuard<never>,
  unknown: (obj => true) as TypeGuard<unknown>,
  null:    (obj => obj === null) as TypeGuard<null>,
  true:    (obj => obj === true) as TypeGuard<true>,
  false:   (obj => obj === false) as TypeGuard<false>,
  date:    (obj => obj instanceof Date) as TypeGuard<Date>,
  array:   (obj => Array.isArray(obj)) as TypeGuard<unknown[]>,
  regexp:  (obj => obj instanceof RegExp) as TypeGuard<RegExp>,
  promise: (obj => obj instanceof Promise) as TypeGuard<Promise<unknown>>,
  keyof:   (obj => (p => p.string(obj) || p.number(obj) || p.symbol(obj))(primaryGuards)) as TypeGuard<KeyOf>,
  typeof:  (obj => (p => p.string(obj) && (obj in p || obj in extendedGuards))(primaryGuards)) as TypeGuard<Types>
}

// General Type-Guard Object
const guards: Guards = {
  ...primaryGuards,
  ...extendedGuards
}

// ##########################################################################################################################

// Has-Property Type-Guard
export const has = <
  K extends KeyOf, T = unknown
>(
  obj: unknown,
  key: K | K[],
  guard: TypeGuard<T, []> | null
): obj is Has<K, T> => {
  // Check Object
  if (!guards.object(obj)) return false
  // Set Check Function
  const checkType = <P extends KeyOf>(
    o: unknown, k: P
  ): o is Has<P, T> => {
    return guard ? guard(o[k]) : true
  }
  // Perform Key Check
  const checkKey = (o: {}, k: KeyOf): o is Has<K, T> => {
    if (o[k] === undefined) return false
    if (k in o) return checkType(o, k)
    if (Object.prototype.hasOwnProperty.call(o, k)) return checkType(o, k)
    if (guards.string(k) && Object.keys(o).includes(k)) {
      return checkType(o, k)
    } else return false
  }
  // Return Check
  if (!guards.array(key)) return checkKey(obj, key)
  else return key.every(k => checkKey(obj, k))
}

// ##########################################################################################################################

// General Type-Guard Target
const superTarget = (o => false) as unknown

// ##########################################################################################################################

type TGGD<T extends GuardOrDescriptor> = (
  TypeGuard<TypeFromGuardOrDescriptor<T>, []>
)

// ##########################################################################################################################

// Check if Input is valid GuardDescriptor
const isGuardDescriptor = <
  T extends ReadonlyInclude<unknown[] | Set> = null
>(obj: unknown): obj is GuardDescriptor<T> => {
  if (guards.array(obj)) {
    if (obj.every(
      o => guards.function(o) || isGuardDescriptor(o)
    )) return true
  }
  else if (guards.object(obj)) {
    if (Object.values(obj).every(
      o => guards.function(o) || isGuardDescriptor(o)
    )) return true
  }
  return false
}

// ##########################################################################################################################

const guardFromArrayDescriptor = <
  D extends GuardDescriptor
>(descriptor: D): (
  TypeGuard<TypeFromGuardDescriptor<D>, []>
) => {
  if (!guards.array(descriptor)) throw new Error('invalid Guard-Descriptor')
  return (
    (obj: unknown): obj is TypeFromGuardDescriptor<D> => {
      if (!guards.array(obj)) return false
      return (
        descriptor.every(
          (guard, index) => {
            const _guard = guards.function(guard) ? guard : guardFromDescriptor(guard)
            return _guard(obj[index])
          }
        )
      )
    }
  )
}

const guardFromObjectDescriptor = <
  D extends GuardDescriptor
>(descriptor: D): (
  TypeGuard<TypeFromGuardDescriptor<D>, []>
) => (
  (obj: unknown): obj is TypeFromGuardDescriptor<D> => {
    if (!guards.object(obj)) return false
    return (
      Object.entries(descriptor).every(
        ([key, guard]) => {
          const _guard = guards.function(guard) ? guard : guardFromDescriptor(guard)
          return _guard(obj[key])
        }
      )
    )
  }
)

const guardFromDescriptor = <
  D extends GuardDescriptor
>(descriptor: D): TypeGuard<TypeFromGuardDescriptor<D>, []> => {
       if (guards.array(  descriptor )) return guardFromArrayDescriptor<D>(descriptor)
  else if (guards.object( descriptor )) return   guardFromObjectDescriptor(descriptor)
  else throw new Error('invalid Guard-Descriptor')
}

// ##########################################################################################################################

// Helper Types
type IterFlag = 'array' | 'object'
type SelIter<I extends IterFlag, AO, A, O, E> = (
  I extends IterFlag
    ? AO : I extends 'array'
      ? A : I extends 'object'
        ? O : E
)

type SelGuard<I extends IterFlag, D, G, F> = SelIter<
  I,
  GuardArrayOf<G, D> | GuardObjectOf<G, D>,
  GuardArrayOf<G, D>,
  GuardObjectOf<G, D>,
  F
>

// ##########################################################################################################################

// Check Set Guard Flag
const checkSetFlag = (flag: string): flag is IterFlag => ['array', 'object'].includes(flag)

// ##########################################################################################################################

// Type-Guard Proxy-Function Generator
const upstreamGuardGenerator = <I extends IterFlag, D, G>(
  dnstr: TypeGuard<D, []> | null,
  guard: TypeGuard<G, []>,
  iter: I
): SelGuard<I, D, G, TypeGuard<D | G, []>> => {
  // Set Downstream Guard
  const prstr = (guards.function(dnstr) ? dnstr : o => false) as TypeGuard<D, []>
  // Set Upstream Guard
  const upstr = (
    checkSetFlag(iter)
      ? ((o: unknown) => prstr(o) || Object.values(o).every(guard)) as SelGuard<I, D, G, never>
      : ((o: unknown) => prstr(o) || guard(o)) as SelGuard<I, D, G, TypeGuard<D | G, []>>
  )
  // Return Upstream
  return upstr
}

// ##########################################################################################################################

// Type-Guard Proxy-Function Generator
const superGuardGenerator = <
  I extends IterFlag,
  D extends TypeGuard<TD, []>,
  G extends TypeGuard<TG, []>,
  TD,
  TG
>(dnstr: D, guard: G, iter: I) => {
  // Return Proxy
  return new Proxy(guard, {
    apply(
      target,
      _thisArg,
      args: [unknown]
    ): args is [TG] {
      if (args.length != 1) throw new Error('invalid arguments')
      const [obj] = args
      return target(obj)
    },
    get(target, p) {
      // Check Target Type
      if (!guards.function(target)) return undefined
      // In Clause
      if (p === 'in') return new Proxy(
        superTarget as GuardHas<TG>,
        guardHasProxyHandler(target)
      )
      // Or Clause
      if (p === 'or') return new Proxy(
        superTarget as SuperGuards<TG>,
        guardProxyHandler(target, null)
      )
      // Of Clause
      if (p === 'of' && checkSetFlag(iter)) {
        return new Proxy(
          superTarget as SuperGuards<TD>[I]['of'],
          guardProxyHandler(dnstr, iter)
        )
      }
      // Optional Clause
      if (p === 'opt') {
        // Generate Recursive Type-Guard Proxy
        const upstr = upstreamGuardGenerator(target, guards.undefined, iter)
        return superGuardGenerator(target, upstr, null as null)
      }
      // Else
      return target[p]
    }
  }) as unknown as SuperGuard<G>
}

// ##########################################################################################################################

// Type-Guards Proxy-Handler Generator
const guardHasProxyHandler = <H>(
  guard: TypeGuard<H, []> | null
): ProxyHandler<GuardHas<H>> => ({
  // In Call
  apply<K extends KeyOf>(
    _target,
    _thisArg,
    args: [unknown, K]
  ): args is [{ [P in K]: H }, K] {
    if (args.length != 2) throw new Error('invalid arguments')
    if (guard && !guards.function(guard)) throw new Error('invalid arguments')
    const [obj, key] = args
    // Check For Key and Type
    return has(obj, key, guard)
  },
})

// ##########################################################################################################################

// Proxy-Handler Helper Type
type UPS<P, H> = P extends Types ? SuperGuard<H | Type<P>> : never

// ##########################################################################################################################

// Type-Guards Proxy-Handler Generator
const guardProxyHandler = <H, I extends IterFlag>(
  dnstr: TypeGuard<H, []> | null,
  iter: I
): ProxyHandler<
  SelIter<
    I,
    SuperGuards<H>['array']['of'] |
    SuperGuards<H>['object']['of'],
    SuperGuards<H>['array']['of'],
    SuperGuards<H>['object']['of'],
    SuperGuards<H>
  >
> => ({
  // Or Call
  apply<T extends GuardOrDescriptor>(
    _target,
    _thisArg,
    args: [T]
  ) {
    if (args.length != 1) throw new Error('invalid arguments')
    const [guard] = args
    // Tranform GuardDescriptor
    let _guard: TGGD<T>
    if (guards.function(guard)) { _guard = guard as TGGD<T> }
    else if (isGuardDescriptor(guard)) { _guard = guardFromDescriptor(guard) as TGGD<T> }
    else throw new Error('invalid Guard-Descriptor')
    // Generate Recursive Type-Guard Proxy
    const upstr = upstreamGuardGenerator(dnstr, _guard, iter)
    return superGuardGenerator(dnstr, upstr, null as null)
  },
  // Or Get
  get<P extends string | symbol>(
    _target, p: P
  ): UPS<P, H> {
    // Check if property exists
    if (!guards.typeof(p)) return null
    // Get Type-Guard
    const guard = guards[p] as UPS<P, never>
    // Check for Array Or Object
    const flag = checkSetFlag(p) ? p : null
    // Generate Recursive Type-Guard Proxy
    const upstr = upstreamGuardGenerator(dnstr, guard, iter)
    return superGuardGenerator(dnstr, upstr, flag) as UPS<P, H>
  },
  // General Methods
  set(_target, _p, _value) { return null },
  deleteProperty(_target, _p) { return null },
  defineProperty(_target, _p, _attr) { return null },
  ownKeys(_target) { return Object.keys(guards) },
  has(_target, p) { return p in guards }
})

// ##########################################################################################################################

// Recursive Type-Guard Proxy
const superGuards = new Proxy(
  superTarget as SuperGuards,
  guardProxyHandler(null, null)
)

// ##########################################################################################################################

// General Type-Guard Proxy
export const is: Is = new Proxy(
  superGuards as SuperGuards & {in: GuardHas<unknown>},
  {
  // Get Properties
  get(target, p) {
    // Check Target Type
    if (!guards.function(target)) throw new Error(
      'invalid target at Is proxy'
    )
    // In Clause
    if (p === 'in') return new Proxy(
      superTarget as GuardHas<unknown>,
      guardHasProxyHandler(null)
    )
    // Else
    return target[p]
  },
  // Property Check
  has(_target, p) {
    return (p in guards ||
      (guards.string(p) && ['in'].includes(p))
    )
  }
})

// ##########################################################################################################################
