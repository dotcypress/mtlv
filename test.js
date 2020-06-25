const test = require('ava');
const { MTLV, MTLVParser } = require('.');

test('contructor', t => {
  t.throws(() => new MTLV(0));
  t.throws(() => new MTLV(8));
  t.throws(() => new MTLV(9));
});

test('encode', t => {
  const mtlv = new MTLV();
  t.throws(() => mtlv.encode(0xfa, [0x2, 0x4]));
  t.throws(() => mtlv.encode(0x0, [0x2, 0x2, 0x2, 0x2, 0x2, 0x2, 0x2, 0x2, 0x2, 0x2, 0x2, 0x2, 0x2, 0x2, 0x2, 0x2, 0x2]));
  t.deepEqual(mtlv.encode(0x1, []), [0x1]);
  t.deepEqual(mtlv.encode(0x1, [0x2, 0x4]), [0x21, 0x2, 0x4]);
});

test('decode', async t => {
  const mtlv = new MTLV();
  t.throws(() => mtlv.decode([]));
  t.throws(() => mtlv.decode([0x21]));
  t.throws(() => mtlv.decode([0x21, 0x2]));
  t.deepEqual(mtlv.decode([0x1]), { tag: 0x1, value: [], length: 0 });
  t.deepEqual(mtlv.decode([0x21, 0x2, 0x4]), { tag: 0x1, value: [0x2, 0x4], length: 2 });
});

test('parse', async t => {
  const parser = new MTLVParser();
  t.deepEqual(parser.parse([0x1]), { tag: 0x1, value: [], length: 0 });
  t.deepEqual(parser.parse([0x21, 0x2]), null);
  t.deepEqual(parser.parse([]), null);
  t.deepEqual(parser.parse([0x4]), { tag: 0x1, value: [0x2, 0x4], length: 2 });
});
