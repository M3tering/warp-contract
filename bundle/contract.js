
  var __create = Object.create;
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getProtoOf = Object.getPrototypeOf;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __require = /* @__PURE__ */ ((x) => typeof require !== "undefined" ? require : typeof Proxy !== "undefined" ? new Proxy(x, {
    get: (a, b) => (typeof require !== "undefined" ? require : a)[b]
  }) : x)(function(x) {
    if (typeof require !== "undefined")
      return require.apply(this, arguments);
    throw Error('Dynamic require of "' + x + '" is not supported');
  });
  var __commonJS = (cb, mod) => function __require2() {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
    // If the importer is in node compatibility mode or this is not an ESM
    // file that has been converted to a CommonJS file using a Babel-
    // compatible transform (i.e. "__esModule" has not been set), then set
    // "default" to the CommonJS "module.exports" for node compatibility.
    isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
    mod
  ));

  // node_modules/@stablelib/random/lib/source/browser.js
  var require_browser = __commonJS({
    "node_modules/@stablelib/random/lib/source/browser.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.BrowserRandomSource = void 0;
      var QUOTA = 65536;
      var BrowserRandomSource = class {
        constructor() {
          this.isAvailable = false;
          this.isInstantiated = false;
          const browserCrypto = typeof self !== "undefined" ? self.crypto || self.msCrypto : null;
          if (browserCrypto && browserCrypto.getRandomValues !== void 0) {
            this._crypto = browserCrypto;
            this.isAvailable = true;
            this.isInstantiated = true;
          }
        }
        randomBytes(length) {
          if (!this.isAvailable || !this._crypto) {
            throw new Error("Browser random byte generator is not available.");
          }
          const out = new Uint8Array(length);
          for (let i = 0; i < out.length; i += QUOTA) {
            this._crypto.getRandomValues(out.subarray(i, i + Math.min(out.length - i, QUOTA)));
          }
          return out;
        }
      };
      exports.BrowserRandomSource = BrowserRandomSource;
    }
  });

  // node_modules/@stablelib/wipe/lib/wipe.js
  var require_wipe = __commonJS({
    "node_modules/@stablelib/wipe/lib/wipe.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      function wipe(array) {
        for (var i = 0; i < array.length; i++) {
          array[i] = 0;
        }
        return array;
      }
      exports.wipe = wipe;
    }
  });

  // (disabled):crypto
  var require_crypto = __commonJS({
    "(disabled):crypto"() {
    }
  });

  // node_modules/@stablelib/random/lib/source/node.js
  var require_node = __commonJS({
    "node_modules/@stablelib/random/lib/source/node.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.NodeRandomSource = void 0;
      var wipe_1 = require_wipe();
      var NodeRandomSource = class {
        constructor() {
          this.isAvailable = false;
          this.isInstantiated = false;
          if (typeof __require !== "undefined") {
            const nodeCrypto = require_crypto();
            if (nodeCrypto && nodeCrypto.randomBytes) {
              this._crypto = nodeCrypto;
              this.isAvailable = true;
              this.isInstantiated = true;
            }
          }
        }
        randomBytes(length) {
          if (!this.isAvailable || !this._crypto) {
            throw new Error("Node.js random byte generator is not available.");
          }
          let buffer = this._crypto.randomBytes(length);
          if (buffer.length !== length) {
            throw new Error("NodeRandomSource: got fewer bytes than requested");
          }
          const out = new Uint8Array(length);
          for (let i = 0; i < out.length; i++) {
            out[i] = buffer[i];
          }
          (0, wipe_1.wipe)(buffer);
          return out;
        }
      };
      exports.NodeRandomSource = NodeRandomSource;
    }
  });

  // node_modules/@stablelib/random/lib/source/system.js
  var require_system = __commonJS({
    "node_modules/@stablelib/random/lib/source/system.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.SystemRandomSource = void 0;
      var browser_1 = require_browser();
      var node_1 = require_node();
      var SystemRandomSource = class {
        constructor() {
          this.isAvailable = false;
          this.name = "";
          this._source = new browser_1.BrowserRandomSource();
          if (this._source.isAvailable) {
            this.isAvailable = true;
            this.name = "Browser";
            return;
          }
          this._source = new node_1.NodeRandomSource();
          if (this._source.isAvailable) {
            this.isAvailable = true;
            this.name = "Node";
            return;
          }
        }
        randomBytes(length) {
          if (!this.isAvailable) {
            throw new Error("System random byte generator is not available.");
          }
          return this._source.randomBytes(length);
        }
      };
      exports.SystemRandomSource = SystemRandomSource;
    }
  });

  // node_modules/@stablelib/int/lib/int.js
  var require_int = __commonJS({
    "node_modules/@stablelib/int/lib/int.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      function imulShim(a, b) {
        var ah = a >>> 16 & 65535, al = a & 65535;
        var bh = b >>> 16 & 65535, bl = b & 65535;
        return al * bl + (ah * bl + al * bh << 16 >>> 0) | 0;
      }
      exports.mul = Math.imul || imulShim;
      function add(a, b) {
        return a + b | 0;
      }
      exports.add = add;
      function sub(a, b) {
        return a - b | 0;
      }
      exports.sub = sub;
      function rotl(x, n) {
        return x << n | x >>> 32 - n;
      }
      exports.rotl = rotl;
      function rotr(x, n) {
        return x << 32 - n | x >>> n;
      }
      exports.rotr = rotr;
      function isIntegerShim(n) {
        return typeof n === "number" && isFinite(n) && Math.floor(n) === n;
      }
      exports.isInteger = Number.isInteger || isIntegerShim;
      exports.MAX_SAFE_INTEGER = 9007199254740991;
      exports.isSafeInteger = function(n) {
        return exports.isInteger(n) && (n >= -exports.MAX_SAFE_INTEGER && n <= exports.MAX_SAFE_INTEGER);
      };
    }
  });

  // node_modules/@stablelib/binary/lib/binary.js
  var require_binary = __commonJS({
    "node_modules/@stablelib/binary/lib/binary.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      var int_1 = require_int();
      function readInt16BE(array, offset) {
        if (offset === void 0) {
          offset = 0;
        }
        return (array[offset + 0] << 8 | array[offset + 1]) << 16 >> 16;
      }
      exports.readInt16BE = readInt16BE;
      function readUint16BE(array, offset) {
        if (offset === void 0) {
          offset = 0;
        }
        return (array[offset + 0] << 8 | array[offset + 1]) >>> 0;
      }
      exports.readUint16BE = readUint16BE;
      function readInt16LE(array, offset) {
        if (offset === void 0) {
          offset = 0;
        }
        return (array[offset + 1] << 8 | array[offset]) << 16 >> 16;
      }
      exports.readInt16LE = readInt16LE;
      function readUint16LE(array, offset) {
        if (offset === void 0) {
          offset = 0;
        }
        return (array[offset + 1] << 8 | array[offset]) >>> 0;
      }
      exports.readUint16LE = readUint16LE;
      function writeUint16BE(value, out, offset) {
        if (out === void 0) {
          out = new Uint8Array(2);
        }
        if (offset === void 0) {
          offset = 0;
        }
        out[offset + 0] = value >>> 8;
        out[offset + 1] = value >>> 0;
        return out;
      }
      exports.writeUint16BE = writeUint16BE;
      exports.writeInt16BE = writeUint16BE;
      function writeUint16LE(value, out, offset) {
        if (out === void 0) {
          out = new Uint8Array(2);
        }
        if (offset === void 0) {
          offset = 0;
        }
        out[offset + 0] = value >>> 0;
        out[offset + 1] = value >>> 8;
        return out;
      }
      exports.writeUint16LE = writeUint16LE;
      exports.writeInt16LE = writeUint16LE;
      function readInt32BE(array, offset) {
        if (offset === void 0) {
          offset = 0;
        }
        return array[offset] << 24 | array[offset + 1] << 16 | array[offset + 2] << 8 | array[offset + 3];
      }
      exports.readInt32BE = readInt32BE;
      function readUint32BE(array, offset) {
        if (offset === void 0) {
          offset = 0;
        }
        return (array[offset] << 24 | array[offset + 1] << 16 | array[offset + 2] << 8 | array[offset + 3]) >>> 0;
      }
      exports.readUint32BE = readUint32BE;
      function readInt32LE(array, offset) {
        if (offset === void 0) {
          offset = 0;
        }
        return array[offset + 3] << 24 | array[offset + 2] << 16 | array[offset + 1] << 8 | array[offset];
      }
      exports.readInt32LE = readInt32LE;
      function readUint32LE(array, offset) {
        if (offset === void 0) {
          offset = 0;
        }
        return (array[offset + 3] << 24 | array[offset + 2] << 16 | array[offset + 1] << 8 | array[offset]) >>> 0;
      }
      exports.readUint32LE = readUint32LE;
      function writeUint32BE(value, out, offset) {
        if (out === void 0) {
          out = new Uint8Array(4);
        }
        if (offset === void 0) {
          offset = 0;
        }
        out[offset + 0] = value >>> 24;
        out[offset + 1] = value >>> 16;
        out[offset + 2] = value >>> 8;
        out[offset + 3] = value >>> 0;
        return out;
      }
      exports.writeUint32BE = writeUint32BE;
      exports.writeInt32BE = writeUint32BE;
      function writeUint32LE(value, out, offset) {
        if (out === void 0) {
          out = new Uint8Array(4);
        }
        if (offset === void 0) {
          offset = 0;
        }
        out[offset + 0] = value >>> 0;
        out[offset + 1] = value >>> 8;
        out[offset + 2] = value >>> 16;
        out[offset + 3] = value >>> 24;
        return out;
      }
      exports.writeUint32LE = writeUint32LE;
      exports.writeInt32LE = writeUint32LE;
      function readInt64BE(array, offset) {
        if (offset === void 0) {
          offset = 0;
        }
        var hi = readInt32BE(array, offset);
        var lo = readInt32BE(array, offset + 4);
        return hi * 4294967296 + lo - (lo >> 31) * 4294967296;
      }
      exports.readInt64BE = readInt64BE;
      function readUint64BE(array, offset) {
        if (offset === void 0) {
          offset = 0;
        }
        var hi = readUint32BE(array, offset);
        var lo = readUint32BE(array, offset + 4);
        return hi * 4294967296 + lo;
      }
      exports.readUint64BE = readUint64BE;
      function readInt64LE(array, offset) {
        if (offset === void 0) {
          offset = 0;
        }
        var lo = readInt32LE(array, offset);
        var hi = readInt32LE(array, offset + 4);
        return hi * 4294967296 + lo - (lo >> 31) * 4294967296;
      }
      exports.readInt64LE = readInt64LE;
      function readUint64LE(array, offset) {
        if (offset === void 0) {
          offset = 0;
        }
        var lo = readUint32LE(array, offset);
        var hi = readUint32LE(array, offset + 4);
        return hi * 4294967296 + lo;
      }
      exports.readUint64LE = readUint64LE;
      function writeUint64BE(value, out, offset) {
        if (out === void 0) {
          out = new Uint8Array(8);
        }
        if (offset === void 0) {
          offset = 0;
        }
        writeUint32BE(value / 4294967296 >>> 0, out, offset);
        writeUint32BE(value >>> 0, out, offset + 4);
        return out;
      }
      exports.writeUint64BE = writeUint64BE;
      exports.writeInt64BE = writeUint64BE;
      function writeUint64LE(value, out, offset) {
        if (out === void 0) {
          out = new Uint8Array(8);
        }
        if (offset === void 0) {
          offset = 0;
        }
        writeUint32LE(value >>> 0, out, offset);
        writeUint32LE(value / 4294967296 >>> 0, out, offset + 4);
        return out;
      }
      exports.writeUint64LE = writeUint64LE;
      exports.writeInt64LE = writeUint64LE;
      function readUintBE(bitLength, array, offset) {
        if (offset === void 0) {
          offset = 0;
        }
        if (bitLength % 8 !== 0) {
          throw new Error("readUintBE supports only bitLengths divisible by 8");
        }
        if (bitLength / 8 > array.length - offset) {
          throw new Error("readUintBE: array is too short for the given bitLength");
        }
        var result = 0;
        var mul = 1;
        for (var i = bitLength / 8 + offset - 1; i >= offset; i--) {
          result += array[i] * mul;
          mul *= 256;
        }
        return result;
      }
      exports.readUintBE = readUintBE;
      function readUintLE(bitLength, array, offset) {
        if (offset === void 0) {
          offset = 0;
        }
        if (bitLength % 8 !== 0) {
          throw new Error("readUintLE supports only bitLengths divisible by 8");
        }
        if (bitLength / 8 > array.length - offset) {
          throw new Error("readUintLE: array is too short for the given bitLength");
        }
        var result = 0;
        var mul = 1;
        for (var i = offset; i < offset + bitLength / 8; i++) {
          result += array[i] * mul;
          mul *= 256;
        }
        return result;
      }
      exports.readUintLE = readUintLE;
      function writeUintBE(bitLength, value, out, offset) {
        if (out === void 0) {
          out = new Uint8Array(bitLength / 8);
        }
        if (offset === void 0) {
          offset = 0;
        }
        if (bitLength % 8 !== 0) {
          throw new Error("writeUintBE supports only bitLengths divisible by 8");
        }
        if (!int_1.isSafeInteger(value)) {
          throw new Error("writeUintBE value must be an integer");
        }
        var div = 1;
        for (var i = bitLength / 8 + offset - 1; i >= offset; i--) {
          out[i] = value / div & 255;
          div *= 256;
        }
        return out;
      }
      exports.writeUintBE = writeUintBE;
      function writeUintLE(bitLength, value, out, offset) {
        if (out === void 0) {
          out = new Uint8Array(bitLength / 8);
        }
        if (offset === void 0) {
          offset = 0;
        }
        if (bitLength % 8 !== 0) {
          throw new Error("writeUintLE supports only bitLengths divisible by 8");
        }
        if (!int_1.isSafeInteger(value)) {
          throw new Error("writeUintLE value must be an integer");
        }
        var div = 1;
        for (var i = offset; i < offset + bitLength / 8; i++) {
          out[i] = value / div & 255;
          div *= 256;
        }
        return out;
      }
      exports.writeUintLE = writeUintLE;
      function readFloat32BE(array, offset) {
        if (offset === void 0) {
          offset = 0;
        }
        var view = new DataView(array.buffer, array.byteOffset, array.byteLength);
        return view.getFloat32(offset);
      }
      exports.readFloat32BE = readFloat32BE;
      function readFloat32LE(array, offset) {
        if (offset === void 0) {
          offset = 0;
        }
        var view = new DataView(array.buffer, array.byteOffset, array.byteLength);
        return view.getFloat32(offset, true);
      }
      exports.readFloat32LE = readFloat32LE;
      function readFloat64BE(array, offset) {
        if (offset === void 0) {
          offset = 0;
        }
        var view = new DataView(array.buffer, array.byteOffset, array.byteLength);
        return view.getFloat64(offset);
      }
      exports.readFloat64BE = readFloat64BE;
      function readFloat64LE(array, offset) {
        if (offset === void 0) {
          offset = 0;
        }
        var view = new DataView(array.buffer, array.byteOffset, array.byteLength);
        return view.getFloat64(offset, true);
      }
      exports.readFloat64LE = readFloat64LE;
      function writeFloat32BE(value, out, offset) {
        if (out === void 0) {
          out = new Uint8Array(4);
        }
        if (offset === void 0) {
          offset = 0;
        }
        var view = new DataView(out.buffer, out.byteOffset, out.byteLength);
        view.setFloat32(offset, value);
        return out;
      }
      exports.writeFloat32BE = writeFloat32BE;
      function writeFloat32LE(value, out, offset) {
        if (out === void 0) {
          out = new Uint8Array(4);
        }
        if (offset === void 0) {
          offset = 0;
        }
        var view = new DataView(out.buffer, out.byteOffset, out.byteLength);
        view.setFloat32(offset, value, true);
        return out;
      }
      exports.writeFloat32LE = writeFloat32LE;
      function writeFloat64BE(value, out, offset) {
        if (out === void 0) {
          out = new Uint8Array(8);
        }
        if (offset === void 0) {
          offset = 0;
        }
        var view = new DataView(out.buffer, out.byteOffset, out.byteLength);
        view.setFloat64(offset, value);
        return out;
      }
      exports.writeFloat64BE = writeFloat64BE;
      function writeFloat64LE(value, out, offset) {
        if (out === void 0) {
          out = new Uint8Array(8);
        }
        if (offset === void 0) {
          offset = 0;
        }
        var view = new DataView(out.buffer, out.byteOffset, out.byteLength);
        view.setFloat64(offset, value, true);
        return out;
      }
      exports.writeFloat64LE = writeFloat64LE;
    }
  });

  // node_modules/@stablelib/random/lib/random.js
  var require_random = __commonJS({
    "node_modules/@stablelib/random/lib/random.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.randomStringForEntropy = exports.randomString = exports.randomUint32 = exports.randomBytes = exports.defaultRandomSource = void 0;
      var system_1 = require_system();
      var binary_1 = require_binary();
      var wipe_1 = require_wipe();
      exports.defaultRandomSource = new system_1.SystemRandomSource();
      function randomBytes(length, prng = exports.defaultRandomSource) {
        return prng.randomBytes(length);
      }
      exports.randomBytes = randomBytes;
      function randomUint32(prng = exports.defaultRandomSource) {
        const buf = randomBytes(4, prng);
        const result = (0, binary_1.readUint32LE)(buf);
        (0, wipe_1.wipe)(buf);
        return result;
      }
      exports.randomUint32 = randomUint32;
      var ALPHANUMERIC = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
      function randomString(length, charset = ALPHANUMERIC, prng = exports.defaultRandomSource) {
        if (charset.length < 2) {
          throw new Error("randomString charset is too short");
        }
        if (charset.length > 256) {
          throw new Error("randomString charset is too long");
        }
        let out = "";
        const charsLen = charset.length;
        const maxByte = 256 - 256 % charsLen;
        while (length > 0) {
          const buf = randomBytes(Math.ceil(length * 256 / maxByte), prng);
          for (let i = 0; i < buf.length && length > 0; i++) {
            const randomByte = buf[i];
            if (randomByte < maxByte) {
              out += charset.charAt(randomByte % charsLen);
              length--;
            }
          }
          (0, wipe_1.wipe)(buf);
        }
        return out;
      }
      exports.randomString = randomString;
      function randomStringForEntropy(bits, charset = ALPHANUMERIC, prng = exports.defaultRandomSource) {
        const length = Math.ceil(bits / (Math.log(charset.length) / Math.LN2));
        return randomString(length, charset, prng);
      }
      exports.randomStringForEntropy = randomStringForEntropy;
    }
  });

  // node_modules/@stablelib/sha512/lib/sha512.js
  var require_sha512 = __commonJS({
    "node_modules/@stablelib/sha512/lib/sha512.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      var binary_1 = require_binary();
      var wipe_1 = require_wipe();
      exports.DIGEST_LENGTH = 64;
      exports.BLOCK_SIZE = 128;
      var SHA512 = (
        /** @class */
        function() {
          function SHA5122() {
            this.digestLength = exports.DIGEST_LENGTH;
            this.blockSize = exports.BLOCK_SIZE;
            this._stateHi = new Int32Array(8);
            this._stateLo = new Int32Array(8);
            this._tempHi = new Int32Array(16);
            this._tempLo = new Int32Array(16);
            this._buffer = new Uint8Array(256);
            this._bufferLength = 0;
            this._bytesHashed = 0;
            this._finished = false;
            this.reset();
          }
          SHA5122.prototype._initState = function() {
            this._stateHi[0] = 1779033703;
            this._stateHi[1] = 3144134277;
            this._stateHi[2] = 1013904242;
            this._stateHi[3] = 2773480762;
            this._stateHi[4] = 1359893119;
            this._stateHi[5] = 2600822924;
            this._stateHi[6] = 528734635;
            this._stateHi[7] = 1541459225;
            this._stateLo[0] = 4089235720;
            this._stateLo[1] = 2227873595;
            this._stateLo[2] = 4271175723;
            this._stateLo[3] = 1595750129;
            this._stateLo[4] = 2917565137;
            this._stateLo[5] = 725511199;
            this._stateLo[6] = 4215389547;
            this._stateLo[7] = 327033209;
          };
          SHA5122.prototype.reset = function() {
            this._initState();
            this._bufferLength = 0;
            this._bytesHashed = 0;
            this._finished = false;
            return this;
          };
          SHA5122.prototype.clean = function() {
            wipe_1.wipe(this._buffer);
            wipe_1.wipe(this._tempHi);
            wipe_1.wipe(this._tempLo);
            this.reset();
          };
          SHA5122.prototype.update = function(data, dataLength) {
            if (dataLength === void 0) {
              dataLength = data.length;
            }
            if (this._finished) {
              throw new Error("SHA512: can't update because hash was finished.");
            }
            var dataPos = 0;
            this._bytesHashed += dataLength;
            if (this._bufferLength > 0) {
              while (this._bufferLength < exports.BLOCK_SIZE && dataLength > 0) {
                this._buffer[this._bufferLength++] = data[dataPos++];
                dataLength--;
              }
              if (this._bufferLength === this.blockSize) {
                hashBlocks(this._tempHi, this._tempLo, this._stateHi, this._stateLo, this._buffer, 0, this.blockSize);
                this._bufferLength = 0;
              }
            }
            if (dataLength >= this.blockSize) {
              dataPos = hashBlocks(this._tempHi, this._tempLo, this._stateHi, this._stateLo, data, dataPos, dataLength);
              dataLength %= this.blockSize;
            }
            while (dataLength > 0) {
              this._buffer[this._bufferLength++] = data[dataPos++];
              dataLength--;
            }
            return this;
          };
          SHA5122.prototype.finish = function(out) {
            if (!this._finished) {
              var bytesHashed = this._bytesHashed;
              var left = this._bufferLength;
              var bitLenHi = bytesHashed / 536870912 | 0;
              var bitLenLo = bytesHashed << 3;
              var padLength = bytesHashed % 128 < 112 ? 128 : 256;
              this._buffer[left] = 128;
              for (var i = left + 1; i < padLength - 8; i++) {
                this._buffer[i] = 0;
              }
              binary_1.writeUint32BE(bitLenHi, this._buffer, padLength - 8);
              binary_1.writeUint32BE(bitLenLo, this._buffer, padLength - 4);
              hashBlocks(this._tempHi, this._tempLo, this._stateHi, this._stateLo, this._buffer, 0, padLength);
              this._finished = true;
            }
            for (var i = 0; i < this.digestLength / 8; i++) {
              binary_1.writeUint32BE(this._stateHi[i], out, i * 8);
              binary_1.writeUint32BE(this._stateLo[i], out, i * 8 + 4);
            }
            return this;
          };
          SHA5122.prototype.digest = function() {
            var out = new Uint8Array(this.digestLength);
            this.finish(out);
            return out;
          };
          SHA5122.prototype.saveState = function() {
            if (this._finished) {
              throw new Error("SHA256: cannot save finished state");
            }
            return {
              stateHi: new Int32Array(this._stateHi),
              stateLo: new Int32Array(this._stateLo),
              buffer: this._bufferLength > 0 ? new Uint8Array(this._buffer) : void 0,
              bufferLength: this._bufferLength,
              bytesHashed: this._bytesHashed
            };
          };
          SHA5122.prototype.restoreState = function(savedState) {
            this._stateHi.set(savedState.stateHi);
            this._stateLo.set(savedState.stateLo);
            this._bufferLength = savedState.bufferLength;
            if (savedState.buffer) {
              this._buffer.set(savedState.buffer);
            }
            this._bytesHashed = savedState.bytesHashed;
            this._finished = false;
            return this;
          };
          SHA5122.prototype.cleanSavedState = function(savedState) {
            wipe_1.wipe(savedState.stateHi);
            wipe_1.wipe(savedState.stateLo);
            if (savedState.buffer) {
              wipe_1.wipe(savedState.buffer);
            }
            savedState.bufferLength = 0;
            savedState.bytesHashed = 0;
          };
          return SHA5122;
        }()
      );
      exports.SHA512 = SHA512;
      var K = new Int32Array([
        1116352408,
        3609767458,
        1899447441,
        602891725,
        3049323471,
        3964484399,
        3921009573,
        2173295548,
        961987163,
        4081628472,
        1508970993,
        3053834265,
        2453635748,
        2937671579,
        2870763221,
        3664609560,
        3624381080,
        2734883394,
        310598401,
        1164996542,
        607225278,
        1323610764,
        1426881987,
        3590304994,
        1925078388,
        4068182383,
        2162078206,
        991336113,
        2614888103,
        633803317,
        3248222580,
        3479774868,
        3835390401,
        2666613458,
        4022224774,
        944711139,
        264347078,
        2341262773,
        604807628,
        2007800933,
        770255983,
        1495990901,
        1249150122,
        1856431235,
        1555081692,
        3175218132,
        1996064986,
        2198950837,
        2554220882,
        3999719339,
        2821834349,
        766784016,
        2952996808,
        2566594879,
        3210313671,
        3203337956,
        3336571891,
        1034457026,
        3584528711,
        2466948901,
        113926993,
        3758326383,
        338241895,
        168717936,
        666307205,
        1188179964,
        773529912,
        1546045734,
        1294757372,
        1522805485,
        1396182291,
        2643833823,
        1695183700,
        2343527390,
        1986661051,
        1014477480,
        2177026350,
        1206759142,
        2456956037,
        344077627,
        2730485921,
        1290863460,
        2820302411,
        3158454273,
        3259730800,
        3505952657,
        3345764771,
        106217008,
        3516065817,
        3606008344,
        3600352804,
        1432725776,
        4094571909,
        1467031594,
        275423344,
        851169720,
        430227734,
        3100823752,
        506948616,
        1363258195,
        659060556,
        3750685593,
        883997877,
        3785050280,
        958139571,
        3318307427,
        1322822218,
        3812723403,
        1537002063,
        2003034995,
        1747873779,
        3602036899,
        1955562222,
        1575990012,
        2024104815,
        1125592928,
        2227730452,
        2716904306,
        2361852424,
        442776044,
        2428436474,
        593698344,
        2756734187,
        3733110249,
        3204031479,
        2999351573,
        3329325298,
        3815920427,
        3391569614,
        3928383900,
        3515267271,
        566280711,
        3940187606,
        3454069534,
        4118630271,
        4000239992,
        116418474,
        1914138554,
        174292421,
        2731055270,
        289380356,
        3203993006,
        460393269,
        320620315,
        685471733,
        587496836,
        852142971,
        1086792851,
        1017036298,
        365543100,
        1126000580,
        2618297676,
        1288033470,
        3409855158,
        1501505948,
        4234509866,
        1607167915,
        987167468,
        1816402316,
        1246189591
      ]);
      function hashBlocks(wh, wl, hh, hl, m, pos, len) {
        var ah0 = hh[0], ah1 = hh[1], ah2 = hh[2], ah3 = hh[3], ah4 = hh[4], ah5 = hh[5], ah6 = hh[6], ah7 = hh[7], al0 = hl[0], al1 = hl[1], al2 = hl[2], al3 = hl[3], al4 = hl[4], al5 = hl[5], al6 = hl[6], al7 = hl[7];
        var h, l;
        var th, tl;
        var a, b, c, d;
        while (len >= 128) {
          for (var i = 0; i < 16; i++) {
            var j = 8 * i + pos;
            wh[i] = binary_1.readUint32BE(m, j);
            wl[i] = binary_1.readUint32BE(m, j + 4);
          }
          for (var i = 0; i < 80; i++) {
            var bh0 = ah0;
            var bh1 = ah1;
            var bh2 = ah2;
            var bh3 = ah3;
            var bh4 = ah4;
            var bh5 = ah5;
            var bh6 = ah6;
            var bh7 = ah7;
            var bl0 = al0;
            var bl1 = al1;
            var bl2 = al2;
            var bl3 = al3;
            var bl4 = al4;
            var bl5 = al5;
            var bl6 = al6;
            var bl7 = al7;
            h = ah7;
            l = al7;
            a = l & 65535;
            b = l >>> 16;
            c = h & 65535;
            d = h >>> 16;
            h = (ah4 >>> 14 | al4 << 32 - 14) ^ (ah4 >>> 18 | al4 << 32 - 18) ^ (al4 >>> 41 - 32 | ah4 << 32 - (41 - 32));
            l = (al4 >>> 14 | ah4 << 32 - 14) ^ (al4 >>> 18 | ah4 << 32 - 18) ^ (ah4 >>> 41 - 32 | al4 << 32 - (41 - 32));
            a += l & 65535;
            b += l >>> 16;
            c += h & 65535;
            d += h >>> 16;
            h = ah4 & ah5 ^ ~ah4 & ah6;
            l = al4 & al5 ^ ~al4 & al6;
            a += l & 65535;
            b += l >>> 16;
            c += h & 65535;
            d += h >>> 16;
            h = K[i * 2];
            l = K[i * 2 + 1];
            a += l & 65535;
            b += l >>> 16;
            c += h & 65535;
            d += h >>> 16;
            h = wh[i % 16];
            l = wl[i % 16];
            a += l & 65535;
            b += l >>> 16;
            c += h & 65535;
            d += h >>> 16;
            b += a >>> 16;
            c += b >>> 16;
            d += c >>> 16;
            th = c & 65535 | d << 16;
            tl = a & 65535 | b << 16;
            h = th;
            l = tl;
            a = l & 65535;
            b = l >>> 16;
            c = h & 65535;
            d = h >>> 16;
            h = (ah0 >>> 28 | al0 << 32 - 28) ^ (al0 >>> 34 - 32 | ah0 << 32 - (34 - 32)) ^ (al0 >>> 39 - 32 | ah0 << 32 - (39 - 32));
            l = (al0 >>> 28 | ah0 << 32 - 28) ^ (ah0 >>> 34 - 32 | al0 << 32 - (34 - 32)) ^ (ah0 >>> 39 - 32 | al0 << 32 - (39 - 32));
            a += l & 65535;
            b += l >>> 16;
            c += h & 65535;
            d += h >>> 16;
            h = ah0 & ah1 ^ ah0 & ah2 ^ ah1 & ah2;
            l = al0 & al1 ^ al0 & al2 ^ al1 & al2;
            a += l & 65535;
            b += l >>> 16;
            c += h & 65535;
            d += h >>> 16;
            b += a >>> 16;
            c += b >>> 16;
            d += c >>> 16;
            bh7 = c & 65535 | d << 16;
            bl7 = a & 65535 | b << 16;
            h = bh3;
            l = bl3;
            a = l & 65535;
            b = l >>> 16;
            c = h & 65535;
            d = h >>> 16;
            h = th;
            l = tl;
            a += l & 65535;
            b += l >>> 16;
            c += h & 65535;
            d += h >>> 16;
            b += a >>> 16;
            c += b >>> 16;
            d += c >>> 16;
            bh3 = c & 65535 | d << 16;
            bl3 = a & 65535 | b << 16;
            ah1 = bh0;
            ah2 = bh1;
            ah3 = bh2;
            ah4 = bh3;
            ah5 = bh4;
            ah6 = bh5;
            ah7 = bh6;
            ah0 = bh7;
            al1 = bl0;
            al2 = bl1;
            al3 = bl2;
            al4 = bl3;
            al5 = bl4;
            al6 = bl5;
            al7 = bl6;
            al0 = bl7;
            if (i % 16 === 15) {
              for (var j = 0; j < 16; j++) {
                h = wh[j];
                l = wl[j];
                a = l & 65535;
                b = l >>> 16;
                c = h & 65535;
                d = h >>> 16;
                h = wh[(j + 9) % 16];
                l = wl[(j + 9) % 16];
                a += l & 65535;
                b += l >>> 16;
                c += h & 65535;
                d += h >>> 16;
                th = wh[(j + 1) % 16];
                tl = wl[(j + 1) % 16];
                h = (th >>> 1 | tl << 32 - 1) ^ (th >>> 8 | tl << 32 - 8) ^ th >>> 7;
                l = (tl >>> 1 | th << 32 - 1) ^ (tl >>> 8 | th << 32 - 8) ^ (tl >>> 7 | th << 32 - 7);
                a += l & 65535;
                b += l >>> 16;
                c += h & 65535;
                d += h >>> 16;
                th = wh[(j + 14) % 16];
                tl = wl[(j + 14) % 16];
                h = (th >>> 19 | tl << 32 - 19) ^ (tl >>> 61 - 32 | th << 32 - (61 - 32)) ^ th >>> 6;
                l = (tl >>> 19 | th << 32 - 19) ^ (th >>> 61 - 32 | tl << 32 - (61 - 32)) ^ (tl >>> 6 | th << 32 - 6);
                a += l & 65535;
                b += l >>> 16;
                c += h & 65535;
                d += h >>> 16;
                b += a >>> 16;
                c += b >>> 16;
                d += c >>> 16;
                wh[j] = c & 65535 | d << 16;
                wl[j] = a & 65535 | b << 16;
              }
            }
          }
          h = ah0;
          l = al0;
          a = l & 65535;
          b = l >>> 16;
          c = h & 65535;
          d = h >>> 16;
          h = hh[0];
          l = hl[0];
          a += l & 65535;
          b += l >>> 16;
          c += h & 65535;
          d += h >>> 16;
          b += a >>> 16;
          c += b >>> 16;
          d += c >>> 16;
          hh[0] = ah0 = c & 65535 | d << 16;
          hl[0] = al0 = a & 65535 | b << 16;
          h = ah1;
          l = al1;
          a = l & 65535;
          b = l >>> 16;
          c = h & 65535;
          d = h >>> 16;
          h = hh[1];
          l = hl[1];
          a += l & 65535;
          b += l >>> 16;
          c += h & 65535;
          d += h >>> 16;
          b += a >>> 16;
          c += b >>> 16;
          d += c >>> 16;
          hh[1] = ah1 = c & 65535 | d << 16;
          hl[1] = al1 = a & 65535 | b << 16;
          h = ah2;
          l = al2;
          a = l & 65535;
          b = l >>> 16;
          c = h & 65535;
          d = h >>> 16;
          h = hh[2];
          l = hl[2];
          a += l & 65535;
          b += l >>> 16;
          c += h & 65535;
          d += h >>> 16;
          b += a >>> 16;
          c += b >>> 16;
          d += c >>> 16;
          hh[2] = ah2 = c & 65535 | d << 16;
          hl[2] = al2 = a & 65535 | b << 16;
          h = ah3;
          l = al3;
          a = l & 65535;
          b = l >>> 16;
          c = h & 65535;
          d = h >>> 16;
          h = hh[3];
          l = hl[3];
          a += l & 65535;
          b += l >>> 16;
          c += h & 65535;
          d += h >>> 16;
          b += a >>> 16;
          c += b >>> 16;
          d += c >>> 16;
          hh[3] = ah3 = c & 65535 | d << 16;
          hl[3] = al3 = a & 65535 | b << 16;
          h = ah4;
          l = al4;
          a = l & 65535;
          b = l >>> 16;
          c = h & 65535;
          d = h >>> 16;
          h = hh[4];
          l = hl[4];
          a += l & 65535;
          b += l >>> 16;
          c += h & 65535;
          d += h >>> 16;
          b += a >>> 16;
          c += b >>> 16;
          d += c >>> 16;
          hh[4] = ah4 = c & 65535 | d << 16;
          hl[4] = al4 = a & 65535 | b << 16;
          h = ah5;
          l = al5;
          a = l & 65535;
          b = l >>> 16;
          c = h & 65535;
          d = h >>> 16;
          h = hh[5];
          l = hl[5];
          a += l & 65535;
          b += l >>> 16;
          c += h & 65535;
          d += h >>> 16;
          b += a >>> 16;
          c += b >>> 16;
          d += c >>> 16;
          hh[5] = ah5 = c & 65535 | d << 16;
          hl[5] = al5 = a & 65535 | b << 16;
          h = ah6;
          l = al6;
          a = l & 65535;
          b = l >>> 16;
          c = h & 65535;
          d = h >>> 16;
          h = hh[6];
          l = hl[6];
          a += l & 65535;
          b += l >>> 16;
          c += h & 65535;
          d += h >>> 16;
          b += a >>> 16;
          c += b >>> 16;
          d += c >>> 16;
          hh[6] = ah6 = c & 65535 | d << 16;
          hl[6] = al6 = a & 65535 | b << 16;
          h = ah7;
          l = al7;
          a = l & 65535;
          b = l >>> 16;
          c = h & 65535;
          d = h >>> 16;
          h = hh[7];
          l = hl[7];
          a += l & 65535;
          b += l >>> 16;
          c += h & 65535;
          d += h >>> 16;
          b += a >>> 16;
          c += b >>> 16;
          d += c >>> 16;
          hh[7] = ah7 = c & 65535 | d << 16;
          hl[7] = al7 = a & 65535 | b << 16;
          pos += 128;
          len -= 128;
        }
        return pos;
      }
      function hash(data) {
        var h = new SHA512();
        h.update(data);
        var digest = h.digest();
        h.clean();
        return digest;
      }
      exports.hash = hash;
    }
  });

  // node_modules/@stablelib/ed25519/lib/ed25519.js
  var require_ed25519 = __commonJS({
    "node_modules/@stablelib/ed25519/lib/ed25519.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.convertSecretKeyToX25519 = exports.convertPublicKeyToX25519 = exports.verify = exports.sign = exports.extractPublicKeyFromSecretKey = exports.generateKeyPair = exports.generateKeyPairFromSeed = exports.SEED_LENGTH = exports.SECRET_KEY_LENGTH = exports.PUBLIC_KEY_LENGTH = exports.SIGNATURE_LENGTH = void 0;
      var random_1 = require_random();
      var sha512_1 = require_sha512();
      var wipe_1 = require_wipe();
      exports.SIGNATURE_LENGTH = 64;
      exports.PUBLIC_KEY_LENGTH = 32;
      exports.SECRET_KEY_LENGTH = 64;
      exports.SEED_LENGTH = 32;
      function gf(init) {
        const r = new Float64Array(16);
        if (init) {
          for (let i = 0; i < init.length; i++) {
            r[i] = init[i];
          }
        }
        return r;
      }
      var _9 = new Uint8Array(32);
      _9[0] = 9;
      var gf0 = gf();
      var gf1 = gf([1]);
      var D = gf([
        30883,
        4953,
        19914,
        30187,
        55467,
        16705,
        2637,
        112,
        59544,
        30585,
        16505,
        36039,
        65139,
        11119,
        27886,
        20995
      ]);
      var D2 = gf([
        61785,
        9906,
        39828,
        60374,
        45398,
        33411,
        5274,
        224,
        53552,
        61171,
        33010,
        6542,
        64743,
        22239,
        55772,
        9222
      ]);
      var X = gf([
        54554,
        36645,
        11616,
        51542,
        42930,
        38181,
        51040,
        26924,
        56412,
        64982,
        57905,
        49316,
        21502,
        52590,
        14035,
        8553
      ]);
      var Y = gf([
        26200,
        26214,
        26214,
        26214,
        26214,
        26214,
        26214,
        26214,
        26214,
        26214,
        26214,
        26214,
        26214,
        26214,
        26214,
        26214
      ]);
      var I = gf([
        41136,
        18958,
        6951,
        50414,
        58488,
        44335,
        6150,
        12099,
        55207,
        15867,
        153,
        11085,
        57099,
        20417,
        9344,
        11139
      ]);
      function set25519(r, a) {
        for (let i = 0; i < 16; i++) {
          r[i] = a[i] | 0;
        }
      }
      function car25519(o) {
        let c = 1;
        for (let i = 0; i < 16; i++) {
          let v = o[i] + c + 65535;
          c = Math.floor(v / 65536);
          o[i] = v - c * 65536;
        }
        o[0] += c - 1 + 37 * (c - 1);
      }
      function sel25519(p, q, b) {
        const c = ~(b - 1);
        for (let i = 0; i < 16; i++) {
          const t = c & (p[i] ^ q[i]);
          p[i] ^= t;
          q[i] ^= t;
        }
      }
      function pack25519(o, n) {
        const m = gf();
        const t = gf();
        for (let i = 0; i < 16; i++) {
          t[i] = n[i];
        }
        car25519(t);
        car25519(t);
        car25519(t);
        for (let j = 0; j < 2; j++) {
          m[0] = t[0] - 65517;
          for (let i = 1; i < 15; i++) {
            m[i] = t[i] - 65535 - (m[i - 1] >> 16 & 1);
            m[i - 1] &= 65535;
          }
          m[15] = t[15] - 32767 - (m[14] >> 16 & 1);
          const b = m[15] >> 16 & 1;
          m[14] &= 65535;
          sel25519(t, m, 1 - b);
        }
        for (let i = 0; i < 16; i++) {
          o[2 * i] = t[i] & 255;
          o[2 * i + 1] = t[i] >> 8;
        }
      }
      function verify32(x, y) {
        let d = 0;
        for (let i = 0; i < 32; i++) {
          d |= x[i] ^ y[i];
        }
        return (1 & d - 1 >>> 8) - 1;
      }
      function neq25519(a, b) {
        const c = new Uint8Array(32);
        const d = new Uint8Array(32);
        pack25519(c, a);
        pack25519(d, b);
        return verify32(c, d);
      }
      function par25519(a) {
        const d = new Uint8Array(32);
        pack25519(d, a);
        return d[0] & 1;
      }
      function unpack25519(o, n) {
        for (let i = 0; i < 16; i++) {
          o[i] = n[2 * i] + (n[2 * i + 1] << 8);
        }
        o[15] &= 32767;
      }
      function add(o, a, b) {
        for (let i = 0; i < 16; i++) {
          o[i] = a[i] + b[i];
        }
      }
      function sub(o, a, b) {
        for (let i = 0; i < 16; i++) {
          o[i] = a[i] - b[i];
        }
      }
      function mul(o, a, b) {
        let v, c, t0 = 0, t1 = 0, t2 = 0, t3 = 0, t4 = 0, t5 = 0, t6 = 0, t7 = 0, t8 = 0, t9 = 0, t10 = 0, t11 = 0, t12 = 0, t13 = 0, t14 = 0, t15 = 0, t16 = 0, t17 = 0, t18 = 0, t19 = 0, t20 = 0, t21 = 0, t22 = 0, t23 = 0, t24 = 0, t25 = 0, t26 = 0, t27 = 0, t28 = 0, t29 = 0, t30 = 0, b0 = b[0], b1 = b[1], b2 = b[2], b3 = b[3], b4 = b[4], b5 = b[5], b6 = b[6], b7 = b[7], b8 = b[8], b9 = b[9], b10 = b[10], b11 = b[11], b12 = b[12], b13 = b[13], b14 = b[14], b15 = b[15];
        v = a[0];
        t0 += v * b0;
        t1 += v * b1;
        t2 += v * b2;
        t3 += v * b3;
        t4 += v * b4;
        t5 += v * b5;
        t6 += v * b6;
        t7 += v * b7;
        t8 += v * b8;
        t9 += v * b9;
        t10 += v * b10;
        t11 += v * b11;
        t12 += v * b12;
        t13 += v * b13;
        t14 += v * b14;
        t15 += v * b15;
        v = a[1];
        t1 += v * b0;
        t2 += v * b1;
        t3 += v * b2;
        t4 += v * b3;
        t5 += v * b4;
        t6 += v * b5;
        t7 += v * b6;
        t8 += v * b7;
        t9 += v * b8;
        t10 += v * b9;
        t11 += v * b10;
        t12 += v * b11;
        t13 += v * b12;
        t14 += v * b13;
        t15 += v * b14;
        t16 += v * b15;
        v = a[2];
        t2 += v * b0;
        t3 += v * b1;
        t4 += v * b2;
        t5 += v * b3;
        t6 += v * b4;
        t7 += v * b5;
        t8 += v * b6;
        t9 += v * b7;
        t10 += v * b8;
        t11 += v * b9;
        t12 += v * b10;
        t13 += v * b11;
        t14 += v * b12;
        t15 += v * b13;
        t16 += v * b14;
        t17 += v * b15;
        v = a[3];
        t3 += v * b0;
        t4 += v * b1;
        t5 += v * b2;
        t6 += v * b3;
        t7 += v * b4;
        t8 += v * b5;
        t9 += v * b6;
        t10 += v * b7;
        t11 += v * b8;
        t12 += v * b9;
        t13 += v * b10;
        t14 += v * b11;
        t15 += v * b12;
        t16 += v * b13;
        t17 += v * b14;
        t18 += v * b15;
        v = a[4];
        t4 += v * b0;
        t5 += v * b1;
        t6 += v * b2;
        t7 += v * b3;
        t8 += v * b4;
        t9 += v * b5;
        t10 += v * b6;
        t11 += v * b7;
        t12 += v * b8;
        t13 += v * b9;
        t14 += v * b10;
        t15 += v * b11;
        t16 += v * b12;
        t17 += v * b13;
        t18 += v * b14;
        t19 += v * b15;
        v = a[5];
        t5 += v * b0;
        t6 += v * b1;
        t7 += v * b2;
        t8 += v * b3;
        t9 += v * b4;
        t10 += v * b5;
        t11 += v * b6;
        t12 += v * b7;
        t13 += v * b8;
        t14 += v * b9;
        t15 += v * b10;
        t16 += v * b11;
        t17 += v * b12;
        t18 += v * b13;
        t19 += v * b14;
        t20 += v * b15;
        v = a[6];
        t6 += v * b0;
        t7 += v * b1;
        t8 += v * b2;
        t9 += v * b3;
        t10 += v * b4;
        t11 += v * b5;
        t12 += v * b6;
        t13 += v * b7;
        t14 += v * b8;
        t15 += v * b9;
        t16 += v * b10;
        t17 += v * b11;
        t18 += v * b12;
        t19 += v * b13;
        t20 += v * b14;
        t21 += v * b15;
        v = a[7];
        t7 += v * b0;
        t8 += v * b1;
        t9 += v * b2;
        t10 += v * b3;
        t11 += v * b4;
        t12 += v * b5;
        t13 += v * b6;
        t14 += v * b7;
        t15 += v * b8;
        t16 += v * b9;
        t17 += v * b10;
        t18 += v * b11;
        t19 += v * b12;
        t20 += v * b13;
        t21 += v * b14;
        t22 += v * b15;
        v = a[8];
        t8 += v * b0;
        t9 += v * b1;
        t10 += v * b2;
        t11 += v * b3;
        t12 += v * b4;
        t13 += v * b5;
        t14 += v * b6;
        t15 += v * b7;
        t16 += v * b8;
        t17 += v * b9;
        t18 += v * b10;
        t19 += v * b11;
        t20 += v * b12;
        t21 += v * b13;
        t22 += v * b14;
        t23 += v * b15;
        v = a[9];
        t9 += v * b0;
        t10 += v * b1;
        t11 += v * b2;
        t12 += v * b3;
        t13 += v * b4;
        t14 += v * b5;
        t15 += v * b6;
        t16 += v * b7;
        t17 += v * b8;
        t18 += v * b9;
        t19 += v * b10;
        t20 += v * b11;
        t21 += v * b12;
        t22 += v * b13;
        t23 += v * b14;
        t24 += v * b15;
        v = a[10];
        t10 += v * b0;
        t11 += v * b1;
        t12 += v * b2;
        t13 += v * b3;
        t14 += v * b4;
        t15 += v * b5;
        t16 += v * b6;
        t17 += v * b7;
        t18 += v * b8;
        t19 += v * b9;
        t20 += v * b10;
        t21 += v * b11;
        t22 += v * b12;
        t23 += v * b13;
        t24 += v * b14;
        t25 += v * b15;
        v = a[11];
        t11 += v * b0;
        t12 += v * b1;
        t13 += v * b2;
        t14 += v * b3;
        t15 += v * b4;
        t16 += v * b5;
        t17 += v * b6;
        t18 += v * b7;
        t19 += v * b8;
        t20 += v * b9;
        t21 += v * b10;
        t22 += v * b11;
        t23 += v * b12;
        t24 += v * b13;
        t25 += v * b14;
        t26 += v * b15;
        v = a[12];
        t12 += v * b0;
        t13 += v * b1;
        t14 += v * b2;
        t15 += v * b3;
        t16 += v * b4;
        t17 += v * b5;
        t18 += v * b6;
        t19 += v * b7;
        t20 += v * b8;
        t21 += v * b9;
        t22 += v * b10;
        t23 += v * b11;
        t24 += v * b12;
        t25 += v * b13;
        t26 += v * b14;
        t27 += v * b15;
        v = a[13];
        t13 += v * b0;
        t14 += v * b1;
        t15 += v * b2;
        t16 += v * b3;
        t17 += v * b4;
        t18 += v * b5;
        t19 += v * b6;
        t20 += v * b7;
        t21 += v * b8;
        t22 += v * b9;
        t23 += v * b10;
        t24 += v * b11;
        t25 += v * b12;
        t26 += v * b13;
        t27 += v * b14;
        t28 += v * b15;
        v = a[14];
        t14 += v * b0;
        t15 += v * b1;
        t16 += v * b2;
        t17 += v * b3;
        t18 += v * b4;
        t19 += v * b5;
        t20 += v * b6;
        t21 += v * b7;
        t22 += v * b8;
        t23 += v * b9;
        t24 += v * b10;
        t25 += v * b11;
        t26 += v * b12;
        t27 += v * b13;
        t28 += v * b14;
        t29 += v * b15;
        v = a[15];
        t15 += v * b0;
        t16 += v * b1;
        t17 += v * b2;
        t18 += v * b3;
        t19 += v * b4;
        t20 += v * b5;
        t21 += v * b6;
        t22 += v * b7;
        t23 += v * b8;
        t24 += v * b9;
        t25 += v * b10;
        t26 += v * b11;
        t27 += v * b12;
        t28 += v * b13;
        t29 += v * b14;
        t30 += v * b15;
        t0 += 38 * t16;
        t1 += 38 * t17;
        t2 += 38 * t18;
        t3 += 38 * t19;
        t4 += 38 * t20;
        t5 += 38 * t21;
        t6 += 38 * t22;
        t7 += 38 * t23;
        t8 += 38 * t24;
        t9 += 38 * t25;
        t10 += 38 * t26;
        t11 += 38 * t27;
        t12 += 38 * t28;
        t13 += 38 * t29;
        t14 += 38 * t30;
        c = 1;
        v = t0 + c + 65535;
        c = Math.floor(v / 65536);
        t0 = v - c * 65536;
        v = t1 + c + 65535;
        c = Math.floor(v / 65536);
        t1 = v - c * 65536;
        v = t2 + c + 65535;
        c = Math.floor(v / 65536);
        t2 = v - c * 65536;
        v = t3 + c + 65535;
        c = Math.floor(v / 65536);
        t3 = v - c * 65536;
        v = t4 + c + 65535;
        c = Math.floor(v / 65536);
        t4 = v - c * 65536;
        v = t5 + c + 65535;
        c = Math.floor(v / 65536);
        t5 = v - c * 65536;
        v = t6 + c + 65535;
        c = Math.floor(v / 65536);
        t6 = v - c * 65536;
        v = t7 + c + 65535;
        c = Math.floor(v / 65536);
        t7 = v - c * 65536;
        v = t8 + c + 65535;
        c = Math.floor(v / 65536);
        t8 = v - c * 65536;
        v = t9 + c + 65535;
        c = Math.floor(v / 65536);
        t9 = v - c * 65536;
        v = t10 + c + 65535;
        c = Math.floor(v / 65536);
        t10 = v - c * 65536;
        v = t11 + c + 65535;
        c = Math.floor(v / 65536);
        t11 = v - c * 65536;
        v = t12 + c + 65535;
        c = Math.floor(v / 65536);
        t12 = v - c * 65536;
        v = t13 + c + 65535;
        c = Math.floor(v / 65536);
        t13 = v - c * 65536;
        v = t14 + c + 65535;
        c = Math.floor(v / 65536);
        t14 = v - c * 65536;
        v = t15 + c + 65535;
        c = Math.floor(v / 65536);
        t15 = v - c * 65536;
        t0 += c - 1 + 37 * (c - 1);
        c = 1;
        v = t0 + c + 65535;
        c = Math.floor(v / 65536);
        t0 = v - c * 65536;
        v = t1 + c + 65535;
        c = Math.floor(v / 65536);
        t1 = v - c * 65536;
        v = t2 + c + 65535;
        c = Math.floor(v / 65536);
        t2 = v - c * 65536;
        v = t3 + c + 65535;
        c = Math.floor(v / 65536);
        t3 = v - c * 65536;
        v = t4 + c + 65535;
        c = Math.floor(v / 65536);
        t4 = v - c * 65536;
        v = t5 + c + 65535;
        c = Math.floor(v / 65536);
        t5 = v - c * 65536;
        v = t6 + c + 65535;
        c = Math.floor(v / 65536);
        t6 = v - c * 65536;
        v = t7 + c + 65535;
        c = Math.floor(v / 65536);
        t7 = v - c * 65536;
        v = t8 + c + 65535;
        c = Math.floor(v / 65536);
        t8 = v - c * 65536;
        v = t9 + c + 65535;
        c = Math.floor(v / 65536);
        t9 = v - c * 65536;
        v = t10 + c + 65535;
        c = Math.floor(v / 65536);
        t10 = v - c * 65536;
        v = t11 + c + 65535;
        c = Math.floor(v / 65536);
        t11 = v - c * 65536;
        v = t12 + c + 65535;
        c = Math.floor(v / 65536);
        t12 = v - c * 65536;
        v = t13 + c + 65535;
        c = Math.floor(v / 65536);
        t13 = v - c * 65536;
        v = t14 + c + 65535;
        c = Math.floor(v / 65536);
        t14 = v - c * 65536;
        v = t15 + c + 65535;
        c = Math.floor(v / 65536);
        t15 = v - c * 65536;
        t0 += c - 1 + 37 * (c - 1);
        o[0] = t0;
        o[1] = t1;
        o[2] = t2;
        o[3] = t3;
        o[4] = t4;
        o[5] = t5;
        o[6] = t6;
        o[7] = t7;
        o[8] = t8;
        o[9] = t9;
        o[10] = t10;
        o[11] = t11;
        o[12] = t12;
        o[13] = t13;
        o[14] = t14;
        o[15] = t15;
      }
      function square(o, a) {
        mul(o, a, a);
      }
      function inv25519(o, i) {
        const c = gf();
        let a;
        for (a = 0; a < 16; a++) {
          c[a] = i[a];
        }
        for (a = 253; a >= 0; a--) {
          square(c, c);
          if (a !== 2 && a !== 4) {
            mul(c, c, i);
          }
        }
        for (a = 0; a < 16; a++) {
          o[a] = c[a];
        }
      }
      function pow2523(o, i) {
        const c = gf();
        let a;
        for (a = 0; a < 16; a++) {
          c[a] = i[a];
        }
        for (a = 250; a >= 0; a--) {
          square(c, c);
          if (a !== 1) {
            mul(c, c, i);
          }
        }
        for (a = 0; a < 16; a++) {
          o[a] = c[a];
        }
      }
      function edadd(p, q) {
        const a = gf(), b = gf(), c = gf(), d = gf(), e = gf(), f = gf(), g = gf(), h = gf(), t = gf();
        sub(a, p[1], p[0]);
        sub(t, q[1], q[0]);
        mul(a, a, t);
        add(b, p[0], p[1]);
        add(t, q[0], q[1]);
        mul(b, b, t);
        mul(c, p[3], q[3]);
        mul(c, c, D2);
        mul(d, p[2], q[2]);
        add(d, d, d);
        sub(e, b, a);
        sub(f, d, c);
        add(g, d, c);
        add(h, b, a);
        mul(p[0], e, f);
        mul(p[1], h, g);
        mul(p[2], g, f);
        mul(p[3], e, h);
      }
      function cswap(p, q, b) {
        for (let i = 0; i < 4; i++) {
          sel25519(p[i], q[i], b);
        }
      }
      function pack(r, p) {
        const tx = gf(), ty = gf(), zi = gf();
        inv25519(zi, p[2]);
        mul(tx, p[0], zi);
        mul(ty, p[1], zi);
        pack25519(r, ty);
        r[31] ^= par25519(tx) << 7;
      }
      function scalarmult(p, q, s) {
        set25519(p[0], gf0);
        set25519(p[1], gf1);
        set25519(p[2], gf1);
        set25519(p[3], gf0);
        for (let i = 255; i >= 0; --i) {
          const b = s[i / 8 | 0] >> (i & 7) & 1;
          cswap(p, q, b);
          edadd(q, p);
          edadd(p, p);
          cswap(p, q, b);
        }
      }
      function scalarbase(p, s) {
        const q = [gf(), gf(), gf(), gf()];
        set25519(q[0], X);
        set25519(q[1], Y);
        set25519(q[2], gf1);
        mul(q[3], X, Y);
        scalarmult(p, q, s);
      }
      function generateKeyPairFromSeed(seed) {
        if (seed.length !== exports.SEED_LENGTH) {
          throw new Error(`ed25519: seed must be ${exports.SEED_LENGTH} bytes`);
        }
        const d = (0, sha512_1.hash)(seed);
        d[0] &= 248;
        d[31] &= 127;
        d[31] |= 64;
        const publicKey = new Uint8Array(32);
        const p = [gf(), gf(), gf(), gf()];
        scalarbase(p, d);
        pack(publicKey, p);
        const secretKey = new Uint8Array(64);
        secretKey.set(seed);
        secretKey.set(publicKey, 32);
        return {
          publicKey,
          secretKey
        };
      }
      exports.generateKeyPairFromSeed = generateKeyPairFromSeed;
      function generateKeyPair(prng) {
        const seed = (0, random_1.randomBytes)(32, prng);
        const result = generateKeyPairFromSeed(seed);
        (0, wipe_1.wipe)(seed);
        return result;
      }
      exports.generateKeyPair = generateKeyPair;
      function extractPublicKeyFromSecretKey(secretKey) {
        if (secretKey.length !== exports.SECRET_KEY_LENGTH) {
          throw new Error(`ed25519: secret key must be ${exports.SECRET_KEY_LENGTH} bytes`);
        }
        return new Uint8Array(secretKey.subarray(32));
      }
      exports.extractPublicKeyFromSecretKey = extractPublicKeyFromSecretKey;
      var L = new Float64Array([
        237,
        211,
        245,
        92,
        26,
        99,
        18,
        88,
        214,
        156,
        247,
        162,
        222,
        249,
        222,
        20,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        16
      ]);
      function modL(r, x) {
        let carry;
        let i;
        let j;
        let k;
        for (i = 63; i >= 32; --i) {
          carry = 0;
          for (j = i - 32, k = i - 12; j < k; ++j) {
            x[j] += carry - 16 * x[i] * L[j - (i - 32)];
            carry = Math.floor((x[j] + 128) / 256);
            x[j] -= carry * 256;
          }
          x[j] += carry;
          x[i] = 0;
        }
        carry = 0;
        for (j = 0; j < 32; j++) {
          x[j] += carry - (x[31] >> 4) * L[j];
          carry = x[j] >> 8;
          x[j] &= 255;
        }
        for (j = 0; j < 32; j++) {
          x[j] -= carry * L[j];
        }
        for (i = 0; i < 32; i++) {
          x[i + 1] += x[i] >> 8;
          r[i] = x[i] & 255;
        }
      }
      function reduce(r) {
        const x = new Float64Array(64);
        for (let i = 0; i < 64; i++) {
          x[i] = r[i];
        }
        for (let i = 0; i < 64; i++) {
          r[i] = 0;
        }
        modL(r, x);
      }
      function sign(secretKey, message) {
        const x = new Float64Array(64);
        const p = [gf(), gf(), gf(), gf()];
        const d = (0, sha512_1.hash)(secretKey.subarray(0, 32));
        d[0] &= 248;
        d[31] &= 127;
        d[31] |= 64;
        const signature = new Uint8Array(64);
        signature.set(d.subarray(32), 32);
        const hs = new sha512_1.SHA512();
        hs.update(signature.subarray(32));
        hs.update(message);
        const r = hs.digest();
        hs.clean();
        reduce(r);
        scalarbase(p, r);
        pack(signature, p);
        hs.reset();
        hs.update(signature.subarray(0, 32));
        hs.update(secretKey.subarray(32));
        hs.update(message);
        const h = hs.digest();
        reduce(h);
        for (let i = 0; i < 32; i++) {
          x[i] = r[i];
        }
        for (let i = 0; i < 32; i++) {
          for (let j = 0; j < 32; j++) {
            x[i + j] += h[i] * d[j];
          }
        }
        modL(signature.subarray(32), x);
        return signature;
      }
      exports.sign = sign;
      function unpackneg(r, p) {
        const t = gf(), chk = gf(), num = gf(), den = gf(), den2 = gf(), den4 = gf(), den6 = gf();
        set25519(r[2], gf1);
        unpack25519(r[1], p);
        square(num, r[1]);
        mul(den, num, D);
        sub(num, num, r[2]);
        add(den, r[2], den);
        square(den2, den);
        square(den4, den2);
        mul(den6, den4, den2);
        mul(t, den6, num);
        mul(t, t, den);
        pow2523(t, t);
        mul(t, t, num);
        mul(t, t, den);
        mul(t, t, den);
        mul(r[0], t, den);
        square(chk, r[0]);
        mul(chk, chk, den);
        if (neq25519(chk, num)) {
          mul(r[0], r[0], I);
        }
        square(chk, r[0]);
        mul(chk, chk, den);
        if (neq25519(chk, num)) {
          return -1;
        }
        if (par25519(r[0]) === p[31] >> 7) {
          sub(r[0], gf0, r[0]);
        }
        mul(r[3], r[0], r[1]);
        return 0;
      }
      function verify2(publicKey, message, signature) {
        const t = new Uint8Array(32);
        const p = [gf(), gf(), gf(), gf()];
        const q = [gf(), gf(), gf(), gf()];
        if (signature.length !== exports.SIGNATURE_LENGTH) {
          throw new Error(`ed25519: signature must be ${exports.SIGNATURE_LENGTH} bytes`);
        }
        if (unpackneg(q, publicKey)) {
          return false;
        }
        const hs = new sha512_1.SHA512();
        hs.update(signature.subarray(0, 32));
        hs.update(publicKey);
        hs.update(message);
        const h = hs.digest();
        reduce(h);
        scalarmult(p, q, h);
        scalarbase(q, signature.subarray(32));
        edadd(p, q);
        pack(t, p);
        if (verify32(signature, t)) {
          return false;
        }
        return true;
      }
      exports.verify = verify2;
      function convertPublicKeyToX25519(publicKey) {
        let q = [gf(), gf(), gf(), gf()];
        if (unpackneg(q, publicKey)) {
          throw new Error("Ed25519: invalid public key");
        }
        let a = gf();
        let b = gf();
        let y = q[1];
        add(a, gf1, y);
        sub(b, gf1, y);
        inv25519(b, b);
        mul(a, a, b);
        let z = new Uint8Array(32);
        pack25519(z, a);
        return z;
      }
      exports.convertPublicKeyToX25519 = convertPublicKeyToX25519;
      function convertSecretKeyToX25519(secretKey) {
        const d = (0, sha512_1.hash)(secretKey.subarray(0, 32));
        d[0] &= 248;
        d[31] &= 127;
        d[31] |= 64;
        const o = new Uint8Array(d.subarray(0, 32));
        (0, wipe_1.wipe)(d);
        return o;
      }
      exports.convertSecretKeyToX25519 = convertSecretKeyToX25519;
    }
  });

  // contract/validators.js
  var import_ed25519 = __toESM(require_ed25519(), 1);

  // contract/constants.js
  var REVENUE_EVENT_ABI = [
    "event Revenue(uint256 indexed tokenId, uint256 indexed amount, uint256 indexed tariff, address from, uint256 timestamp)"
  ];
  var REGISTRATION_EVENT_ABI = [
    "event Register(uint256 indexed tokenId, string indexed publicKey, uint256 timestamp, address from)"
  ];
  var REGISTRATION_EVENT_TOPIC = "0x14baf91fa484669f3c1c7daaad2311dd19d93f389419adb93c8b3b64cee9b1ec";
  var REVENUE_EVENT_TOPIC = "0xf0a696af71d2857a7dfd350ee22c0a1ce9f94ad4c083bb6d52e95fd2ed7bbd76";
  var PROTOCOL_ADDRESS = "0x15Fd3b92Eda42b55C7c521DFff5fdeeC5d76D04a";
  var M3TER_ADDRESS = "0xb5f6A90266d6E2d622B71d95bc19e24Be66DAF19";
  var GNOSIS_RPC = "https://rpc.chiadochain.net";

  // contract/validators.js
  function base64ToBytes(base64) {
    return Uint8Array.from(atob(base64), (m) => m.codePointAt(0));
  }
  function validatePayload(payload, pubKey) {
    const pubKeyArray = base64ToBytes(pubKey);
    const signatureArray = base64ToBytes(payload[1]);
    const messageArray = new TextEncoder().encode(JSON.stringify(payload[2]));
    return (0, import_ed25519.verify)(pubKeyArray, messageArray, signatureArray);
  }
  async function validateTxLogs(txHash, lastBlockHeight, tokenIdFromState, contractAddress, eventAbi, eventTopic) {
    const provider = new SmartWeave.extensions.ethers.JsonRpcProvider(GNOSIS_RPC);
    const receipt = await provider.getTransactionReceipt(txHash);
    if (!receipt)
      throw new Error("Transaction not found or not yet mined");
    if (receipt.logs.length === 0)
      throw new Error("No Transfer events found");
    const iface = new SmartWeave.extensions.ethers.Interface(eventAbi);
    const logContent = receipt.logs[0];
    const blockHeight = logContent["blockNumber"];
    const address = logContent["address"];
    const data = iface.parseLog(logContent);
    const tokenIdFromLog = Number(data.args[0]);
    if (blockHeight <= lastBlockHeight)
      throw new Error("Block height not valid");
    if (address !== contractAddress)
      throw new Error("Adrress is Invalid");
    if (data.topic !== eventTopic)
      throw new Error("Topic validation failed");
    if (tokenIdFromLog !== tokenIdFromState)
      throw new Error("Token Id does not match");
    return {
      blockHeight,
      data
    };
  }

  // contract/handlers.js
  async function registration(state, action) {
    const { blockHeight, data } = await validateTxLogs(
      action.input.data.transaction_hash,
      state.last_block,
      state.token_id,
      M3TER_ADDRESS,
      REGISTRATION_EVENT_ABI,
      REGISTRATION_EVENT_TOPIC
    );
    const publicKey = data.args[1];
    state.last_block = blockHeight;
    state.public_key = publicKey;
    return { state };
  }
  async function topup(state, action) {
    const { blockHeight, data } = await validateTxLogs(
      action.input.data.transaction_hash,
      state.last_block,
      state.token_id,
      PROTOCOL_ADDRESS,
      REVENUE_EVENT_ABI,
      REVENUE_EVENT_TOPIC
    );
    const amountPaid = Number(data.args[1]) / 1e18;
    const tariff = Number(data.args[2]) / 1e18;
    state.last_block = blockHeight;
    state.kwh_balance += amountPaid * tariff;
    return { state };
  }
  function metering(state, action) {
    const payload = action.input.data;
    if (!payload)
      throw new ContractError("Interaction payload missing");
    const nonce = payload[2][0];
    if (nonce < state.nonce)
      throw new ContractError("Invalid nonce");
    const validity = validatePayload(payload, state.public_key);
    if (validity !== true)
      throw new ContractError("Invalid payload");
    state.kwh_balance -= payload[2][2];
    if (state.kwh_balance <= 0)
      state.is_on = false;
    state.nonce = nonce;
    return { state };
  }

  // contract/contract.js
  function handle(state, action) {
    switch (action.input.function) {
      case "register":
        return registration(state, action);
      case "meter":
        return metering(state, action);
      case "topup":
        return topup(state, action);
    }
    throw new ContractError("function not recognized");
  }

