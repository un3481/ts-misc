import { is } from '../src/modules/guards'

describe('test SuperGuard', () => {
  // String
  test('test SuperGuard "string"', () => {
    expect( is.string(null)            ).toBe( false );
    expect( is.string({})              ).toBe( false );
    expect( is.string([])              ).toBe( false );
    expect( is.string(1)               ).toBe( false );
    expect( is.string('1')             ).toBe( true  );
    expect( is.string('')              ).toBe( true  );
    expect( is.string(String(1))       ).toBe( true  );
    expect( is.string(String('1'))     ).toBe( true  );
    expect( is.string(new String(1))   ).toBe( true  );
    expect( is.string(new String('1')) ).toBe( true  );
  });
  // Number
  test('test SuperGuard "number"', () => {
    expect( is.number(null)            ).toBe( false );
    expect( is.number({})              ).toBe( false );
    expect( is.number([])              ).toBe( false );
    expect( is.number(1)               ).toBe( false );
    expect( is.number('1')             ).toBe( true  );
    expect( is.number(0)               ).toBe( true  );
    expect( is.number(Number(1))       ).toBe( true  );
    expect( is.number(Number('1'))     ).toBe( true  );
    expect( is.number(new Number(1))   ).toBe( true  );
    expect( is.number(new Number('1')) ).toBe( true  );
  });
});