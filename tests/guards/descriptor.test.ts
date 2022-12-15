import { is } from '../../src/modules/guards'

describe('test SuperGuard from GuardDescriptor[object]', () => {

  // Custom Type
  type CustomUser = {
    id: number
    firstName: string
    lastName: string
    joined?: Date
    active: boolean
    foo: "bar"
  };

  // Create a Type-Guard for Custom Type
  const isCustomUser = is({
    id: is.number,
    firstName: is.string,
    lastName: is.string,
    joined: is.date.opt,
    active: is.boolean,
    foo: (obj: unknown): obj is "bar" => { return obj === 'bar' }
  });

  // Assert Correct Type-Guard
  const _assertCustomTypeGuard: (obj: unknown) => obj is CustomUser = isCustomUser;

  // Example of object with Custom Type
  const example = {
    id: 342,
    firstName: "Jhon",
    lastName: "Smith",
    active: true,
    foo: "bar"
  };

  test('test TypeGuard[custom-type]', () => {
    expect( isCustomUser(null)         ).toBe( false );
    expect( isCustomUser({})           ).toBe( false );
    expect( isCustomUser([1, '2'])     ).toBe( false );
    expect( isCustomUser(1)            ).toBe( false );
    expect( isCustomUser('test')       ).toBe( false );
    expect( isCustomUser({foo: "bar"}) ).toBe( false );
    expect( isCustomUser(example)      ).toBe( true  );
  });

  test('test SuperGuard[custom-type]', () => {
    expect( is(isCustomUser)(null)         ).toBe( false );
    expect( is(isCustomUser)({})           ).toBe( false );
    expect( is(isCustomUser)([1, '2'])     ).toBe( false );
    expect( is(isCustomUser)(1)            ).toBe( false );
    expect( is(isCustomUser)('test')       ).toBe( false );
    expect( is(isCustomUser)({foo: "bar"}) ).toBe( false );
    expect( is(isCustomUser)(example)      ).toBe( true  );
  });

  test('test SuperGuard[custom-type or string]', () => {
    expect( is(isCustomUser).or.string(null)         ).toBe( false );
    expect( is(isCustomUser).or.string({})           ).toBe( false );
    expect( is(isCustomUser).or.string([1, '2'])     ).toBe( false );
    expect( is(isCustomUser).or.string(1)            ).toBe( false );
    expect( is(isCustomUser).or.string('test')       ).toBe( true  );
    expect( is(isCustomUser).or.string({foo: "bar"}) ).toBe( false );
    expect( is(isCustomUser).or.string(example)      ).toBe( true  );
  });

  test('test SuperGuard[number or custom-type]', () => {
    expect( is.number.or(isCustomUser)(null)         ).toBe( false );
    expect( is.number.or(isCustomUser)({})           ).toBe( false );
    expect( is.number.or(isCustomUser)([1, '2'])     ).toBe( false );
    expect( is.number.or(isCustomUser)(1)            ).toBe( true  );
    expect( is.number.or(isCustomUser)('test')       ).toBe( false );
    expect( is.number.or(isCustomUser)({foo: "bar"}) ).toBe( false );
    expect( is.number.or(isCustomUser)(example)      ).toBe( true  );
  });
})

describe('test SuperGuard from GuardDescriptor[array]', () => {

  // Custom Type
  type CustomTuple = [
    number,
    string,
    Date,
    boolean,
    "foo"
  ];

  // Create a Type-Guard for Custom Type
  const isCustomTuple = is([
    is.number,
    is.string,
    is.date,
    is.boolean,
    (obj: unknown): obj is "bar" => { return obj === 'bar' }
  ] as const);

  // Assert Correct Type-Guard
  const _assertCustomTypeGuard: (obj: unknown) => obj is CustomTuple = isCustomTuple;

  // Example of object with Custom Type
  const example = [
    878,
    "example",
    new Date(),
    true,
    "foo"
  ];

  test('test TypeGuard[custom-type]', () => {
    expect( isCustomTuple(null)         ).toBe( false );
    expect( isCustomTuple({})           ).toBe( false );
    expect( isCustomTuple([1, '2'])     ).toBe( false );
    expect( isCustomTuple(1)            ).toBe( false );
    expect( isCustomTuple('test')       ).toBe( false );
    expect( isCustomTuple({foo: "bar"}) ).toBe( false );
    expect( isCustomTuple(example)      ).toBe( true  );
  });

  test('test SuperGuard[custom-type]', () => {
    expect( is(isCustomTuple)(null)         ).toBe( false );
    expect( is(isCustomTuple)({})           ).toBe( false );
    expect( is(isCustomTuple)([1, '2'])     ).toBe( false );
    expect( is(isCustomTuple)(1)            ).toBe( false );
    expect( is(isCustomTuple)('test')       ).toBe( false );
    expect( is(isCustomTuple)({foo: "bar"}) ).toBe( false );
    expect( is(isCustomTuple)(example)      ).toBe( true  );
  });

  test('test SuperGuard[custom-type or string]', () => {
    expect( is(isCustomTuple).or.string(null)         ).toBe( false );
    expect( is(isCustomTuple).or.string({})           ).toBe( false );
    expect( is(isCustomTuple).or.string([1, '2'])     ).toBe( false );
    expect( is(isCustomTuple).or.string(1)            ).toBe( false );
    expect( is(isCustomTuple).or.string('test')       ).toBe( true  );
    expect( is(isCustomTuple).or.string({foo: "bar"}) ).toBe( false );
    expect( is(isCustomTuple).or.string(example)      ).toBe( true  );
  });

  test('test SuperGuard[number or custom-type]', () => {
    expect( is.number.or(isCustomTuple)(null)         ).toBe( false );
    expect( is.number.or(isCustomTuple)({})           ).toBe( false );
    expect( is.number.or(isCustomTuple)([1, '2'])     ).toBe( false );
    expect( is.number.or(isCustomTuple)(1)            ).toBe( true  );
    expect( is.number.or(isCustomTuple)('test')       ).toBe( false );
    expect( is.number.or(isCustomTuple)({foo: "bar"}) ).toBe( false );
    expect( is.number.or(isCustomTuple)(example)      ).toBe( true  );
  });
})