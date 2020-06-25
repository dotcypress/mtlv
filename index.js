class MTLV {
  constructor(tagBits = 4) {
    if (tagBits === 0 || tagBits >= 8) {
      throw new Error("Tag bits must be more than 0 and less than 8");
    }
    this.tagBis = tagBits;
    this.maxTag = 1 << tagBits;
    this.maxLen = 1 << (8 - tagBits);
  }

  encode(tag, value) {
    if (tag > this.maxTag) {
      throw new Error("Tag overflow");
    }
    if (value.length > this.maxLen) {
      throw new Error("Value overflow");
    }
    return Array.from([tag | (value.length << this.tagBis), ...value]);
  }

  decodeHeader(header) {
    const tag = header & (this.maxTag + 1);
    const length = header >> this.tagBis;
    if (tag > this.maxTag) {
      throw new Error("Tag overflow");
    }
    if (length > this.maxLen) {
      throw new Error("Value overflow");
    }
    return { tag, length };
  }

  decode(packet) {
    if (packet.length == 0) {
      throw new Error("Empty packet");
    }
    const { tag, length } = this.decodeHeader(packet[0]);
    if (length >= packet.length) {
      throw new Error("Value underflow");
    }
    const value = Array.from(packet.slice(1, length + 1));
    return { tag, length, value };
  }
};

class MTLVParser {
  constructor(tagBits) {
    this.decoder = new MTLV(tagBits);
    this.buffer = [];
  }

  parse(data) {
    this.buffer = this.buffer.concat(data);
    if (this.buffer.length === 0) {
      return null;
    }
    const { tag, length } = this.decoder.decodeHeader(this.buffer[0]);
    if (length >= this.buffer.length) {
      return null;
    }
    const packet = this.buffer.splice(0, length + 1).slice(1);
    const value = Array.from(packet);
    return { tag, length, value };
  }
}

module.exports = {
  MTLV,
  MTLVParser
};
