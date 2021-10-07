import type {
  As,
  Is,
  And,
  Types,
  PrimaryTypes,
  UnusualTypes,
  TypeGuardShape,
  TypeGuard,
  Callable,
  Guards,
  Extra,
  Has,
  KeyOf,
  ArgOf,
  TypeOf,
  Type
} from './types.js';
export declare function extend < T, O = unknown > (obj: unknown): obj is As < T extends Extra ? (O extends Extra ? And < O & T > : O & T) : O & T > ;
export declare function guard < T > (tg: TypeGuardShape): TypeGuard < T > ;
export declare function typeOf(obj: unknown): string;
export declare const primaryGuards: Guards < PrimaryTypes > ;
export declare const unusualGuards: Guards < UnusualTypes > ;
export declare function has < O = unknown, K extends KeyOf = KeyOf, T extends Types = Types > (obj: unknown, key: K | K[], typeName ? : T | T[]): obj is Has < K, Type < T > , O > ;
export declare function are < K extends KeyOf, T extends Types > (obj: Extra < K > , typeName: T | T[]): obj is Extra < K, TypeOf < T >> ;
export declare const is: Is;
export declare function isReturn < R extends Types > (typeName: R): < A extends ArgOf > (obj: Callable < A > , ...args: A) => obj is Callable < A, TypeOf < R >> ;
