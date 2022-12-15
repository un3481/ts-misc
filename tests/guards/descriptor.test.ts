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

  // Examples of objects with Custom Type
  const example1 = {
    id: 342,
    firstName: "Jhon",
    lastName: "Smith",
    active: true,
    foo: "bar"
  };
  const example2 = {
    id: 756,
    firstName: "David",
    lastName: "Richard",
    joined: new Date("2013-08-06"),
    active: false,
    foo: "bar"
  };

  test('test TypeGuard[custom-type]', () => {
    expect( isCustomUser(null)         ).toBe( false );
    expect( isCustomUser({})           ).toBe( false );
    expect( isCustomUser([1, '2'])     ).toBe( false );
    expect( isCustomUser(1)            ).toBe( false );
    expect( isCustomUser('test')       ).toBe( false );
    expect( isCustomUser({foo: "bar"}) ).toBe( false );
    expect( isCustomUser(example1)     ).toBe( true  );
    expect( isCustomUser(example2)     ).toBe( true  );
  });

  test('test SuperGuard[custom-type]', () => {
    expect( is(isCustomUser)(null)         ).toBe( false );
    expect( is(isCustomUser)({})           ).toBe( false );
    expect( is(isCustomUser)([1, '2'])     ).toBe( false );
    expect( is(isCustomUser)(1)            ).toBe( false );
    expect( is(isCustomUser)('test')       ).toBe( false );
    expect( is(isCustomUser)({foo: "bar"}) ).toBe( false );
    expect( is(isCustomUser)(example1)     ).toBe( true  );
    expect( is(isCustomUser)(example2)     ).toBe( true  );
  });

  test('test SuperGuard[custom-type or string]', () => {
    expect( is(isCustomUser).or.string(null)         ).toBe( false );
    expect( is(isCustomUser).or.string({})           ).toBe( false );
    expect( is(isCustomUser).or.string([1, '2'])     ).toBe( false );
    expect( is(isCustomUser).or.string(1)            ).toBe( false );
    expect( is(isCustomUser).or.string('test')       ).toBe( true  );
    expect( is(isCustomUser).or.string({foo: "bar"}) ).toBe( false );
    expect( is(isCustomUser).or.string(example1)     ).toBe( true  );
    expect( is(isCustomUser).or.string(example2)     ).toBe( true  );
  });

  test('test SuperGuard[number or custom-type]', () => {
    expect( is.number.or(isCustomUser)(null)         ).toBe( false );
    expect( is.number.or(isCustomUser)({})           ).toBe( false );
    expect( is.number.or(isCustomUser)([1, '2'])     ).toBe( false );
    expect( is.number.or(isCustomUser)(1)            ).toBe( true  );
    expect( is.number.or(isCustomUser)('test')       ).toBe( false );
    expect( is.number.or(isCustomUser)({foo: "bar"}) ).toBe( false );
    expect( is.number.or(isCustomUser)(example1)     ).toBe( true  );
    expect( is.number.or(isCustomUser)(example2)     ).toBe( true  );
  });
})

describe('test SuperGuard from GuardDescriptor[array]', () => {

  // Custom Type
  type CustomTuple = readonly [
    number,
    string,
    Date | string,
    boolean,
    "foo"
  ];

  // Create a Type-Guard for Custom Type
  const isCustomTuple = is([
    is.number,
    is.string,
    is.date.or.string,
    is.boolean,
    (obj: unknown): obj is "foo" => { return obj === 'foo' }
  ] as const);

  // Assert Correct Type-Guard
  const _assertCustomTypeGuard: (obj: unknown) => obj is CustomTuple = isCustomTuple;

  // Examples of objects with Custom Type
  const example1 = [
    878,
    "example",
    new Date("2022-11-07"),
    true,
    "foo"
  ];
  const example2 = [
    291,
    "unit testing",
    "2022-06-23",
    false,
    "foo"
  ];

  test('test TypeGuard[custom-type]', () => {
    expect( isCustomTuple(null)         ).toBe( false );
    expect( isCustomTuple({})           ).toBe( false );
    expect( isCustomTuple([1, '2'])     ).toBe( false );
    expect( isCustomTuple(1)            ).toBe( false );
    expect( isCustomTuple('test')       ).toBe( false );
    expect( isCustomTuple({foo: "bar"}) ).toBe( false );
    expect( isCustomTuple(example1)     ).toBe( true  );
    expect( isCustomTuple(example2)     ).toBe( true  );
  });

  test('test SuperGuard[custom-type]', () => {
    expect( is(isCustomTuple)(null)         ).toBe( false );
    expect( is(isCustomTuple)({})           ).toBe( false );
    expect( is(isCustomTuple)([1, '2'])     ).toBe( false );
    expect( is(isCustomTuple)(1)            ).toBe( false );
    expect( is(isCustomTuple)('test')       ).toBe( false );
    expect( is(isCustomTuple)({foo: "bar"}) ).toBe( false );
    expect( is(isCustomTuple)(example1)     ).toBe( true  );
    expect( is(isCustomTuple)(example2)     ).toBe( true  );
  });

  test('test SuperGuard[custom-type or string]', () => {
    expect( is(isCustomTuple).or.string(null)         ).toBe( false );
    expect( is(isCustomTuple).or.string({})           ).toBe( false );
    expect( is(isCustomTuple).or.string([1, '2'])     ).toBe( false );
    expect( is(isCustomTuple).or.string(1)            ).toBe( false );
    expect( is(isCustomTuple).or.string('test')       ).toBe( true  );
    expect( is(isCustomTuple).or.string({foo: "bar"}) ).toBe( false );
    expect( is(isCustomTuple).or.string(example1)     ).toBe( true  );
    expect( is(isCustomTuple).or.string(example2)     ).toBe( true  );
  });

  test('test SuperGuard[number or custom-type]', () => {
    expect( is.number.or(isCustomTuple)(null)         ).toBe( false );
    expect( is.number.or(isCustomTuple)({})           ).toBe( false );
    expect( is.number.or(isCustomTuple)([1, '2'])     ).toBe( false );
    expect( is.number.or(isCustomTuple)(1)            ).toBe( true  );
    expect( is.number.or(isCustomTuple)('test')       ).toBe( false );
    expect( is.number.or(isCustomTuple)({foo: "bar"}) ).toBe( false );
    expect( is.number.or(isCustomTuple)(example1)     ).toBe( true  );
    expect( is.number.or(isCustomTuple)(example2)     ).toBe( true  );
  });
})