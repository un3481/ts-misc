import { handles } from '../src/index'

describe('test Handles[safe]', () => {
  
  // Test Type
  type StringSafeReturn = (v: string) => Promise<readonly [string, Error]>

  test('test Handles[safe] on success', async () => {
    const unsafe = (v: string) => v;
    const safe: StringSafeReturn = handles.safe(unsafe);
    const result = await safe("1234");

    expect( Array.isArray(result) ).toBe( true      );
    expect( result.length         ).toBe( 2         );
    expect( result[0]             ).toBe( "1234"    );
    expect( result[1]             ).toBe( undefined );
  });

  test('test Handles[safe] on error', async () => {
    const unsafe = (v: string) => { if (v) { throw new Error(v) } else return v };
    const safe: StringSafeReturn = handles.safe(unsafe);
    const result = await safe("5678");

    expect( Array.isArray(result) ).toBe( true                     );
    expect( result.length         ).toBe( 2                        );
    expect( result[0]             ).toBe( undefined                );
    expect( result[1].toString()  ).toBe( Error("5678").toString() );
  });
})