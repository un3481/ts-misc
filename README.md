# ts-misc
Typescript Miscellaneous Library

## usage
`ts-misc` module exports several utility methods for TypeScript, eg.:

```typescript
import { strings } from 'ts-misc'

const words = ['hello', 'world'] as const
const result: "hello world" = strings.join(words, ' ')
```

### Super Guard
One of the main goals of this library is to make Type-Guards simple (while keeping them compile-time correct). This is accomplished by the use of the `is` export.

The `is` export is a Proxy object that generates Type-Guards programmatically and allows developers to modify and improve existing Type-Guards. The type for this export is `SuperGuard` because it adds new functionalities for the standard Type-Guards.

It can be used as following:

```typescript
import { is } from 'ts-misc'

let example: unknown

example = 2

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

let example: unknown

example = "hello world"

if (is.string(example)) {
  console.log(`it's a string: ${example}`)
}

if (is.number(example)) {
  console.log('this will never be logged')
}

if (is.number.or.string(example)) {
  console.log('it's a number or a string: ${example}')
}
```

Using existing Type-Guard along with `SuperGuard`:

```typescript
import { is } from 'ts-misc'

type HelloWorld = { hello: "world" }

function isHelloWorld(obj: unknown): obj is HelloWorld {
  if (typeof obj != 'object') return false
  if (!('hello' in obj)) reutrn false
  if (obj.hello != 'world') return false
  else return true
}

let example: unknown

example = { hello: "world" }

if (isHelloWorld(example)) {
  console.log(`it's a HelloWorld: ${example}`)
}

if (is.number(example)) {
  console.log('this will never be logged')
}

if (is.number.or(isHelloWorld)(example)) {
  console.log('it's a number or a HelloWorld: ${example}')
}
```
