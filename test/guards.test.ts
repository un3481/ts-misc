import { is } from '../src/modules/guards'

describe('testing Super Guard', () => {
  test('String Guard should work correctly', () => {
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
});