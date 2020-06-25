# MTLV

MiniTLV - TLV inspired binary protocol.

## Packet layout

- First byte: Length([8:tagBits]) Tag([tagBits:0])
- Rest bytes: Value array

## Installation

Install from NPM:

```js
$ npm install mtlv --save
```

## Examples

```js
const mtlv = new MTLV();
const packet = mtlv.encode(0x1, [0x2, 0x4]);
const { tag, length, value } = mtlv.decode(packet));

const parser = new MTLVParser();
const { tag, length, value } = parser.parse([0x21, 0x2, 0x4]);
```
