"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var nanoid_1 = require("nanoid");
var nonceGenerator = function () { return nanoid_1.nanoid(); };
exports.default = nonceGenerator;
