const { Transform } = require('stream');
const { MTLV, MTLVDecoder } = require('.');

class MTLVTransform extends Transform {
  constructor(options = {}) {
    super({ objectMode: true, ...options });
    this.encoder = new MTLV(options.tagBits);
    this.decoder = new MTLVDecoder(options.tagBits);
  }

  readPackets(done) {
    while (true) {
      const packet = this.decoder.read();
      if (!packet) {
        return done();
      }
      this.push(packet);
    }
  }

  _transform(chunk, encoding, done) {
    this.decoder.write(chunk);
    this.readPackets(done);
  }

  _flush(done) {
    this.readPackets(done);
  }
}

module.exports = MTLVTransform;
