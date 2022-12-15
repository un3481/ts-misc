import { handles } from '../src/index'
import { TSafe } from '../src/modules/handles'

describe('test Handles', () => {

  test('test Handle.Safe[success]', async () => {
    const expectOk: TSafe<[v: string], string> =
      handles.safe((v: string) => v);
    
    const resultOk = await expectOk("1234");

    expect( Array.isArray(resultOk) ).toBe( true      );
    expect( resultOk.length         ).toBe( 2         );
    expect( resultOk[0]             ).toBe( "1234"    );
    expect( resultOk[1]             ).toBe( undefined );
  });

  test('test Handle.Safe[error]', async () => {
    const expectError: TSafe<[v: string], never> =
       handles.safe((v: string) => { throw new Error(v) });

    const resultError = await expectError("5678");

    expect( Array.isArray(resultError) ).toBe( true                     );
    expect( resultError.length         ).toBe( 2                        );
    expect( resultError[0]             ).toBe( undefined                );
    expect( resultError[1].toString()  ).toBe( Error("5678").toString() );
  });
})