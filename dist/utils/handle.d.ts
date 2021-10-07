import {
  Await,
  Callable
} from './types.js';
export declare type TSafeReturn < T > = [T, Error];
export declare type TSafeAsyncReturn < T > = Promise < TSafeReturn < T >> ;
export declare type TSafe < A extends unknown[], R > = Callable < A, TSafeAsyncReturn < R >> ;
export declare type TSafeSync < A extends unknown[], R > = Callable < A, TSafeReturn < R >> ;
export declare function safe < A extends unknown[], T > (func: (...args: A) => T, that ? : unknown): TSafe < A, Await < T >> ;
export declare function safeSync < A extends unknown[], T > (func: (...args: A) => T, that ? : unknown): TSafeSync < A, Await < T >> ;
export declare function repeat < T > (exec: () => T, verify: (res: Await < T > ) => boolean | Promise < boolean > , loop ? : number, delay ? : number): Promise < Await < T >> ;
export declare function repeatSync < T > (exec: () => T, verify: (res: Await < T > ) => boolean | Promise < boolean > , loop ? : number, delay ? : number): TSafeReturn < Await < T >> ;
