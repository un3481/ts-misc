import type {
  As,
  Extra,
  KeyOf,
  ValueOf,
  ReadonlyInclude,
  PrimitiveType,
  SuperType
} from './types.js';
export declare function rand < T extends ValueOf > (arr: ReadonlyInclude < Extra < KeyOf, T > | Array < T >> ): T;
export declare function generate < T > (obj: T, replacer ? : (key: KeyOf, value: unknown) => unknown): T;
export declare function serialize < T > (obj: T): T;
export declare type PrimitiveJSON = As < PrimitiveType | Record < string | number, unknown > | unknown[] > ;
export declare class AccessJSON {
  path: string;
  constructor(path: string);
  read(): readonly[Object | String | Number | Boolean | unknown[], Error];
  write(json: unknown): boolean;
}
export declare function proxyJSON(path: string): SuperType;
