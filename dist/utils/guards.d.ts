import type {
  As,
  Is,
  And,
  Types,
  PrimaryTypes,
  UnusualTypes,
  TypeGuard,
  TypeGuardLike,
  Guards,
  SuperGuard,
  Callable,
  Extra,
  Has,
  KeyOf,
  ArgOf,
  TypeOf,
  Type
} from './types.js';
export declare function extend < T, O = unknown > (obj: unknown): obj is As < T extends Extra ? (O extends Extra ? And < O & T > : O & T) : O & T > ;
export declare function guard < T > (tg: TypeGuardLike): TypeGuard < T > ;
export declare function typeOf(obj: unknown): string;
export declare const primaryGuards: Guards < PrimaryTypes > ;
export declare const unusualGuards: Guards < UnusualTypes > ;
export declare function isType < T extends Types > (obj: unknown, typeName: T | T[]): obj is Type < T > ;
export declare const superGuards: {
  string: SuperGuard < "string" > ;
  number: SuperGuard < "number" > ;
  bigint: SuperGuard < "bigint" > ;
  boolean: SuperGuard < "boolean" > ;
  symbol: SuperGuard < "symbol" > ;
  undefined: SuperGuard < "undefined" > ;
  object: SuperGuard < "object" > ;
  function: SuperGuard < "function" > ;
  never: SuperGuard < "never" > ;
  unknown: SuperGuard < "unknown" > ;
  null: SuperGuard < "null" > ;
  true: SuperGuard < "true" > ;
  false: SuperGuard < "false" > ;
  array: SuperGuard < "array" > ;
  promise: SuperGuard < "promise" > ;
  date: SuperGuard < "date" > ;
  regexp: SuperGuard < "regexp" > ;
  typeof: SuperGuard < "typeof" > ;
  keyof: SuperGuard < "keyof" > ;
  class: SuperGuard < "class" > ;
  any: SuperGuard < "any" > ;
};
export declare function has < K extends KeyOf = KeyOf, T extends Types = Types, O extends Extra = {} > (obj: unknown, key: K | K[], typeName ? : T | T[], _oref ? : O): obj is Has < K, Type < T > , O > ;
export declare function are < K extends number, T extends Types, O extends Extra | unknown[] = {} > (obj: Extra | unknown[], typeName: T | T[], _oref ? : O): obj is O extends unknown[] ? Type < T > [] : Extra < K, Type < T >> ;
export declare const is: Is;
export declare function isReturn < R extends Types > (typeName: R): < A extends ArgOf > (obj: Callable < A > , ...args: A) => obj is Callable < A, TypeOf < R >> ;
