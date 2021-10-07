import {
  Then
} from './types.js';
export declare function timestamp(): string;
export declare function wait(mili: number): Promise < null > ;
export declare function waitSync < T extends number | Promise < unknown > | (() => Promise < R > ), R extends T extends number ? null : Then < T >> (mili: T): R;
