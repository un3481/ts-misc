import { handles } from '../src/index'

describe('test Handles[safe]', () => {
  
  // Ensure Type
  type StringSafeReturn = (v: string) => readonly [true, string] | readonly [false, Error]

  // Safe functions that always return the input value
  const unsafe1 = (v: string) => v;
  const safe1: StringSafeReturn = handles.safe(unsafe1);

  // Safe function that always throw an Error
  const unsafe2 = (v: string) => { if (v) { throw new Error(v) } else return v };
  const safe2: StringSafeReturn = handles.safe(unsafe2);

  test('test Handles[safe] on success', () => {
    const result = safe1("1234");

    expect( Array.isArray(result) ).toBe( true   );
    expect( result.length         ).toBe( 2      );
    expect( result[0]             ).toBe( true   );
    expect( result[1]             ).toBe( "1234" );
  });

  test('test Handles[safe] on error', () => {
    const result = safe2("5678");

    expect( Array.isArray(result) ).toBe( true                     );
    expect( result.length         ).toBe( 2                        );
    expect( result[0]             ).toBe( false                    );
    expect( result[1].toString()  ).toBe( Error("5678").toString() );
  });
})

describe('test Handles[safe][async]', () => {
  
  // Ensure Type
  type StringSafeAsyncReturn = (v: string) => Promise<readonly [true, string] | readonly [false, Error]>

  // Safe functions that always return the input value
  const unsafe1 = (v: string) => v;
  const safe1: StringSafeAsyncReturn = handles.safe(unsafe1).async;

  // Safe function that always throw an Error
  const unsafe2 = (v: string) => { if (v) { throw new Error(v) } else return v };
  const safe2: StringSafeAsyncReturn = handles.safe(unsafe2).async;

  test('test Handles[safe][async] on success', async () => {
    const result = await safe1("6574");

    expect( Array.isArray(result) ).toBe( true   );
    expect( result.length         ).toBe( 2      );
    expect( result[0]             ).toBe( true   );
    expect( result[1]             ).toBe( "6574" );
  });

  test('test Handles[safe][async] on error', async () => {
    const result = await safe2("9346");

    expect( Array.isArray(result) ).toBe( true                     );
    expect( result.length         ).toBe( 2                        );
    expect( result[0]             ).toBe( false                    );
    expect( result[1].toString()  ).toBe( Error("9346").toString() );
  });
})
