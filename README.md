# ts-misc
Typescript Miscellaneous Library

## Usage
The `ts-misc` package exports several utility modules for TypeScript.

For example, the `strings` module:

```typescript
import { strings } from 'ts-misc'

// Join strings preserving const Type
const words = ['hello', 'world'] as const
const result: "hello world" = strings.join(words, ' ')
```

## Super Guard
One of the main goals of this library is to make Type-Guards simple (while keeping them compile-time correct). This is accomplished by the use of the `is` export.

The `is` export is a Proxy object that generates Type-Guards programmatically and allows developers to modify and improve existing Type-Guards. The type for this export is `SuperGuard` because it adds new functionalities for the standard Type-Guards.

It can be used as following:

```typescript
import { is } from 'ts-misc'

// Example variable with unknown type
let example: unknown = 2

// Check type of object
if (is.number(example)) {
  console.log(`it's a number: ${example}`)
} else {
  console.log('this will never be logged')
}
```

Although it's main function is generating dynamic Type-Guards, the type definitions for those must be known at compile time, like any other type in TypeScript.

This module doesn't aim to create functionalities that TypeScript itself doesn't have, but it should make some of the existing ones simpler.

Some more examples:

```typescript
import { is } from 'ts-misc'

// Example variable with unknown type
let example: unknown = 'hello world'

// This will work
if (is.string(example)) {
  console.log(`it's a string: ${example}`)
}

// This will fail
if (is.number(example)) {
  console.log('this will never be logged')
}

// This works as well
if (is.number.or.string(example)) {
  console.log(`it's a number or a string: ${example}`)
}
```

### Using existing Type-Guards along with `SuperGuard`

Let's assume you've defined the following Type and Type-Guard:

```typescript
// Example of custom type
type HelloWorld = { hello: "world" }

// A standard Type-Guard for a custom type
function isHelloWorld(obj: unknown): obj is HelloWorld {
  if (typeof obj != 'object') return false
  if (!('hello' in obj)) reutrn false
  if (obj.hello != 'world') return false
  else return true
}
```

You could integrate both into `is` like the following:

```typescript
import { is } from 'ts-misc'

// Example variable with unknown type
let example: unknown = { hello: "world" }

// Using predefined Type-Guard will work
if (isHelloWorld(example)) {
  console.log(`it's a HelloWorld: ${example}`)
}

// This will fail
if (is.number(example)) {
  console.log('this will never be logged')
}

// This works as well
if (is.number.or(isHelloWorld)(example)) {
  console.log(`it's a number or a HelloWorld: ${example}`)
}
```

Using the `SuperGuard` object to extend existing Type-Guards will greatly reduce developing time and improve the readability of the code.

No more need to do several lines of code for checking elements in an `Axios` response object, just add your existing Type-Guards to the `is` pipeline and your type is ensured at compile time.
