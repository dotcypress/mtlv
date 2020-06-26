const { Readable } = require('stream');
const test = require('ava');
const { MTLV, MTLVDecoder } = require('.');
const MTLVTransform = require('./transform');

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

test('stream decoder', async t => {
  const decoder = new MTLVDecoder();
  decoder.write([0x1]);
  t.deepEqual(decoder.read(), { tag: 0x1, value: [], length: 0 });

  decoder.write([0x21, 0x2]);
  decoder.write([0x4]);
  t.deepEqual(decoder.read(), { tag: 0x1, value: [0x2, 0x4], length: 2 });
});

test.cb('stream transform', t => {
  const transform = new MTLVTransform();
  transform.on('data', (packet) => {
    t.deepEqual(packet, { tag: 0x1, value: [0x2, 0x4], length: 2 });
    t.end();
  });

  const readable = new Readable();
  readable._read = () => {
    if (!readable.dataSent) {
      readable.dataSent = true;
      readable.push(new Uint8Array([0x21, 0x2, 0x4]));
    }
  };
  readable.pipe(transform);
});
