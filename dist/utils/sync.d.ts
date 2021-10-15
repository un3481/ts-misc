export declare function timestamp(): string;
export declare function wait(mili: number): Promise < null > ;
export declare function waitSync < T extends number | Promise < R > | (() => Promise < R > ), R extends(T extends number ? null : unknown) > (mili: T): R;
