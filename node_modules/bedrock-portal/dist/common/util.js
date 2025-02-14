"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRandomUint64 = exports.isXuid = void 0;
const isXuid = (xuid) => /^\d{16}$/.test(xuid);
exports.isXuid = isXuid;
const getRandomUint64 = () => {
    // Generate two 32-bit random integers
    const high = Math.floor(Math.random() * 0xFFFFFFFF);
    const low = Math.floor(Math.random() * 0xFFFFFFFF);
    // Combine them to create a 64-bit unsigned integer
    const result = (BigInt(high) << BigInt(32)) | BigInt(low);
    return result;
};
exports.getRandomUint64 = getRandomUint64;
