"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
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
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// asset-input/node_modules/uuid/dist/rng.js
var require_rng = __commonJS({
  "asset-input/node_modules/uuid/dist/rng.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", {
      value: true
    });
    exports2.default = rng;
    var _crypto = _interopRequireDefault(require("crypto"));
    function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : { default: obj };
    }
    function rng() {
      return _crypto.default.randomBytes(16);
    }
  }
});

// asset-input/node_modules/uuid/dist/bytesToUuid.js
var require_bytesToUuid = __commonJS({
  "asset-input/node_modules/uuid/dist/bytesToUuid.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", {
      value: true
    });
    exports2.default = void 0;
    var byteToHex = [];
    for (i = 0; i < 256; ++i) {
      byteToHex[i] = (i + 256).toString(16).substr(1);
    }
    var i;
    function bytesToUuid(buf, offset) {
      var i2 = offset || 0;
      var bth = byteToHex;
      return [bth[buf[i2++]], bth[buf[i2++]], bth[buf[i2++]], bth[buf[i2++]], "-", bth[buf[i2++]], bth[buf[i2++]], "-", bth[buf[i2++]], bth[buf[i2++]], "-", bth[buf[i2++]], bth[buf[i2++]], "-", bth[buf[i2++]], bth[buf[i2++]], bth[buf[i2++]], bth[buf[i2++]], bth[buf[i2++]], bth[buf[i2++]]].join("");
    }
    var _default = bytesToUuid;
    exports2.default = _default;
  }
});

// asset-input/node_modules/uuid/dist/v1.js
var require_v1 = __commonJS({
  "asset-input/node_modules/uuid/dist/v1.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", {
      value: true
    });
    exports2.default = void 0;
    var _rng = _interopRequireDefault(require_rng());
    var _bytesToUuid = _interopRequireDefault(require_bytesToUuid());
    function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : { default: obj };
    }
    var _nodeId;
    var _clockseq;
    var _lastMSecs = 0;
    var _lastNSecs = 0;
    function v12(options, buf, offset) {
      var i = buf && offset || 0;
      var b = buf || [];
      options = options || {};
      var node = options.node || _nodeId;
      var clockseq = options.clockseq !== void 0 ? options.clockseq : _clockseq;
      if (node == null || clockseq == null) {
        var seedBytes = options.random || (options.rng || _rng.default)();
        if (node == null) {
          node = _nodeId = [seedBytes[0] | 1, seedBytes[1], seedBytes[2], seedBytes[3], seedBytes[4], seedBytes[5]];
        }
        if (clockseq == null) {
          clockseq = _clockseq = (seedBytes[6] << 8 | seedBytes[7]) & 16383;
        }
      }
      var msecs = options.msecs !== void 0 ? options.msecs : (/* @__PURE__ */ new Date()).getTime();
      var nsecs = options.nsecs !== void 0 ? options.nsecs : _lastNSecs + 1;
      var dt = msecs - _lastMSecs + (nsecs - _lastNSecs) / 1e4;
      if (dt < 0 && options.clockseq === void 0) {
        clockseq = clockseq + 1 & 16383;
      }
      if ((dt < 0 || msecs > _lastMSecs) && options.nsecs === void 0) {
        nsecs = 0;
      }
      if (nsecs >= 1e4) {
        throw new Error("uuid.v1(): Can't create more than 10M uuids/sec");
      }
      _lastMSecs = msecs;
      _lastNSecs = nsecs;
      _clockseq = clockseq;
      msecs += 122192928e5;
      var tl = ((msecs & 268435455) * 1e4 + nsecs) % 4294967296;
      b[i++] = tl >>> 24 & 255;
      b[i++] = tl >>> 16 & 255;
      b[i++] = tl >>> 8 & 255;
      b[i++] = tl & 255;
      var tmh = msecs / 4294967296 * 1e4 & 268435455;
      b[i++] = tmh >>> 8 & 255;
      b[i++] = tmh & 255;
      b[i++] = tmh >>> 24 & 15 | 16;
      b[i++] = tmh >>> 16 & 255;
      b[i++] = clockseq >>> 8 | 128;
      b[i++] = clockseq & 255;
      for (var n = 0; n < 6; ++n) {
        b[i + n] = node[n];
      }
      return buf ? buf : (0, _bytesToUuid.default)(b);
    }
    var _default = v12;
    exports2.default = _default;
  }
});

// asset-input/node_modules/uuid/dist/v35.js
var require_v35 = __commonJS({
  "asset-input/node_modules/uuid/dist/v35.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", {
      value: true
    });
    exports2.default = _default;
    exports2.URL = exports2.DNS = void 0;
    var _bytesToUuid = _interopRequireDefault(require_bytesToUuid());
    function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : { default: obj };
    }
    function uuidToBytes(uuid2) {
      var bytes = [];
      uuid2.replace(/[a-fA-F0-9]{2}/g, function(hex) {
        bytes.push(parseInt(hex, 16));
      });
      return bytes;
    }
    function stringToBytes(str) {
      str = unescape(encodeURIComponent(str));
      var bytes = new Array(str.length);
      for (var i = 0; i < str.length; i++) {
        bytes[i] = str.charCodeAt(i);
      }
      return bytes;
    }
    var DNS = "6ba7b810-9dad-11d1-80b4-00c04fd430c8";
    exports2.DNS = DNS;
    var URL = "6ba7b811-9dad-11d1-80b4-00c04fd430c8";
    exports2.URL = URL;
    function _default(name, version, hashfunc) {
      var generateUUID = function(value, namespace, buf, offset) {
        var off = buf && offset || 0;
        if (typeof value == "string") value = stringToBytes(value);
        if (typeof namespace == "string") namespace = uuidToBytes(namespace);
        if (!Array.isArray(value)) throw TypeError("value must be an array of bytes");
        if (!Array.isArray(namespace) || namespace.length !== 16) throw TypeError("namespace must be uuid string or an Array of 16 byte values");
        var bytes = hashfunc(namespace.concat(value));
        bytes[6] = bytes[6] & 15 | version;
        bytes[8] = bytes[8] & 63 | 128;
        if (buf) {
          for (var idx = 0; idx < 16; ++idx) {
            buf[off + idx] = bytes[idx];
          }
        }
        return buf || (0, _bytesToUuid.default)(bytes);
      };
      try {
        generateUUID.name = name;
      } catch (err) {
      }
      generateUUID.DNS = DNS;
      generateUUID.URL = URL;
      return generateUUID;
    }
  }
});

// asset-input/node_modules/uuid/dist/md5.js
var require_md5 = __commonJS({
  "asset-input/node_modules/uuid/dist/md5.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", {
      value: true
    });
    exports2.default = void 0;
    var _crypto = _interopRequireDefault(require("crypto"));
    function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : { default: obj };
    }
    function md5(bytes) {
      if (Array.isArray(bytes)) {
        bytes = Buffer.from(bytes);
      } else if (typeof bytes === "string") {
        bytes = Buffer.from(bytes, "utf8");
      }
      return _crypto.default.createHash("md5").update(bytes).digest();
    }
    var _default = md5;
    exports2.default = _default;
  }
});

// asset-input/node_modules/uuid/dist/v3.js
var require_v3 = __commonJS({
  "asset-input/node_modules/uuid/dist/v3.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", {
      value: true
    });
    exports2.default = void 0;
    var _v = _interopRequireDefault(require_v35());
    var _md = _interopRequireDefault(require_md5());
    function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : { default: obj };
    }
    var v32 = (0, _v.default)("v3", 48, _md.default);
    var _default = v32;
    exports2.default = _default;
  }
});

// asset-input/node_modules/uuid/dist/v4.js
var require_v4 = __commonJS({
  "asset-input/node_modules/uuid/dist/v4.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", {
      value: true
    });
    exports2.default = void 0;
    var _rng = _interopRequireDefault(require_rng());
    var _bytesToUuid = _interopRequireDefault(require_bytesToUuid());
    function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : { default: obj };
    }
    function v42(options, buf, offset) {
      var i = buf && offset || 0;
      if (typeof options == "string") {
        buf = options === "binary" ? new Array(16) : null;
        options = null;
      }
      options = options || {};
      var rnds = options.random || (options.rng || _rng.default)();
      rnds[6] = rnds[6] & 15 | 64;
      rnds[8] = rnds[8] & 63 | 128;
      if (buf) {
        for (var ii = 0; ii < 16; ++ii) {
          buf[i + ii] = rnds[ii];
        }
      }
      return buf || (0, _bytesToUuid.default)(rnds);
    }
    var _default = v42;
    exports2.default = _default;
  }
});

// asset-input/node_modules/uuid/dist/sha1.js
var require_sha1 = __commonJS({
  "asset-input/node_modules/uuid/dist/sha1.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", {
      value: true
    });
    exports2.default = void 0;
    var _crypto = _interopRequireDefault(require("crypto"));
    function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : { default: obj };
    }
    function sha1(bytes) {
      if (Array.isArray(bytes)) {
        bytes = Buffer.from(bytes);
      } else if (typeof bytes === "string") {
        bytes = Buffer.from(bytes, "utf8");
      }
      return _crypto.default.createHash("sha1").update(bytes).digest();
    }
    var _default = sha1;
    exports2.default = _default;
  }
});

// asset-input/node_modules/uuid/dist/v5.js
var require_v5 = __commonJS({
  "asset-input/node_modules/uuid/dist/v5.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", {
      value: true
    });
    exports2.default = void 0;
    var _v = _interopRequireDefault(require_v35());
    var _sha = _interopRequireDefault(require_sha1());
    function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : { default: obj };
    }
    var v52 = (0, _v.default)("v5", 80, _sha.default);
    var _default = v52;
    exports2.default = _default;
  }
});

// asset-input/node_modules/uuid/dist/index.js
var require_dist = __commonJS({
  "asset-input/node_modules/uuid/dist/index.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", {
      value: true
    });
    Object.defineProperty(exports2, "v1", {
      enumerable: true,
      get: function() {
        return _v.default;
      }
    });
    Object.defineProperty(exports2, "v3", {
      enumerable: true,
      get: function() {
        return _v2.default;
      }
    });
    Object.defineProperty(exports2, "v4", {
      enumerable: true,
      get: function() {
        return _v3.default;
      }
    });
    Object.defineProperty(exports2, "v5", {
      enumerable: true,
      get: function() {
        return _v4.default;
      }
    });
    var _v = _interopRequireDefault(require_v1());
    var _v2 = _interopRequireDefault(require_v3());
    var _v3 = _interopRequireDefault(require_v4());
    var _v4 = _interopRequireDefault(require_v5());
    function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : { default: obj };
    }
  }
});

// asset-input/apps/api/functions/cards.ts
var cards_exports = {};
__export(cards_exports, {
  handler: () => handler
});
module.exports = __toCommonJS(cards_exports);

// asset-input/node_modules/uuid/wrapper.mjs
var import_dist = __toESM(require_dist(), 1);
var v1 = import_dist.default.v1;
var v3 = import_dist.default.v3;
var v4 = import_dist.default.v4;
var v5 = import_dist.default.v5;

// asset-input/apps/api/services/card.service.ts
var BATTLE_ATTR_MAP = {
  PersonCard: "mass",
  StarshipCard: "crew"
};
var CardService = class {
  cardRepository;
  constructor(cardRepository2) {
    this.cardRepository = cardRepository2;
  }
  async getCardById(id) {
    const item = await this.cardRepository.getCardById(id);
    if (!item) {
      throw new Error(`Card with id ${id} not found`);
    }
    return {
      ...item,
      __typename: item.type
    };
  }
  async createCard(input) {
    const now = (/* @__PURE__ */ new Date()).toISOString();
    const id = v4();
    const { type, name, ...rest } = input;
    const battleAttributeName = BATTLE_ATTR_MAP[type];
    const battleValue = Number(rest[battleAttributeName] ?? 0);
    const rawCard = {
      id,
      type,
      name,
      details: rest,
      battleAttributeName,
      battleValue,
      createdAt: now,
      updatedAt: now
    };
    await this.cardRepository.createCard(rawCard);
    return {
      __typename: type,
      id,
      type,
      name,
      ...rest,
      battleAttributeName,
      battleValue,
      createdAt: now,
      updatedAt: now
    };
  }
  async getAllByType(type) {
    const cards = await this.cardRepository.getAllByType(type);
    return cards.map((card) => ({
      ...card,
      typename: card.type
    }));
  }
  async updateCard(id, input) {
    const existing = await this.cardRepository.getCardById(id);
    if (!existing) {
      throw new Error(`Card with id ${id} not found`);
    }
    const updatedCard = {
      ...existing,
      ...input,
      updatedAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    await this.cardRepository.createCard(updatedCard);
    return {
      ...updatedCard,
      __typename: updatedCard.type
    };
  }
  async deleteCardById(id) {
    return `Card with id ${id} deleted (not really)`;
  }
};

// asset-input/apps/api/db/cardRepository.ts
var import_client_dynamodb = require("@aws-sdk/client-dynamodb");
var import_util_dynamodb = require("@aws-sdk/util-dynamodb");
var client = new import_client_dynamodb.DynamoDBClient({});
var tableName = process.env.CARDS_TABLE_NAME;
var CardRepository = class {
  constructor() {
    console.log("CardRepository initialized");
  }
  async getAllByType(type) {
    const { Items } = await client.send(
      new import_client_dynamodb.ScanCommand({
        TableName: tableName,
        FilterExpression: "#t = :type",
        ExpressionAttributeNames: { "#t": "type" },
        ExpressionAttributeValues: { ":type": { S: type } }
      })
    );
    return Items?.map((item) => (0, import_util_dynamodb.unmarshall)(item)) || [];
  }
  async createCard(card) {
    await client.send(
      new import_client_dynamodb.PutItemCommand({
        TableName: tableName,
        Item: (0, import_util_dynamodb.marshall)(card)
      })
    );
  }
  async getCardById(id) {
    const { Item } = await client.send(
      new import_client_dynamodb.GetItemCommand({
        TableName: tableName,
        Key: {
          id: { S: id }
        }
      })
    );
    return Item ? (0, import_util_dynamodb.unmarshall)(Item) : void 0;
  }
};
var cardRepository = new CardRepository();

// asset-input/apps/api/functions/cards.ts
var handler = async (event) => {
  try {
    const service = new CardService(cardRepository);
    switch (event.info.fieldName) {
      case "getCardById": {
        const args = event.arguments;
        return await service.getCardById(args.id);
      }
      case "createCard": {
        const args = event.arguments;
        return await service.createCard(args.card);
      }
      case "updateCard": {
        const args = event.arguments;
        return await service.updateCard(args.id, args.card);
      }
      case "deleteCard": {
        const args = event.arguments;
        return await service.deleteCardById(args.id);
      }
      case "getAllByType": {
        const args = event.arguments;
        return await service.getAllByType(args.type);
      }
    }
  } catch (error) {
    console.error("Error fetching person:", error);
    throw error;
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  handler
});
