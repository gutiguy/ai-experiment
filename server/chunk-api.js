"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getChunksData = exports.getToken = void 0;
const axios_1 = __importDefault(require("axios"));
const CHUNK_HOLDER_API_KEY = process.env.CHUNK_HOLDER_API_KEY;
const CHUNK_CHOLDER_ENDPOINT = process.env.CHUNK_HOLDER_ENDPOINT || '';
const chunkHolderRequestHeaders = {
    'X-Api-Key': CHUNK_HOLDER_API_KEY,
};
const getToken = () => __awaiter(void 0, void 0, void 0, function* () {
    let tokenRes = null;
    try {
        tokenRes = yield axios_1.default.post(`${CHUNK_CHOLDER_ENDPOINT}/auth/generate-token`, {}, { headers: chunkHolderRequestHeaders });
    }
    catch (e) {
        // TODO: report to sentry or another error reporting service
        return null;
    }
    return tokenRes === null || tokenRes === void 0 ? void 0 : tokenRes.data.token;
});
exports.getToken = getToken;
const getChunksData = (token, chunks) => __awaiter(void 0, void 0, void 0, function* () {
    const getChunksDataRes = yield Promise.all(chunks.map((c) => axios_1.default.get(`${CHUNK_CHOLDER_ENDPOINT}/chunks/${c.chunkId}`, { headers: { Authorization: token } })));
    return getChunksDataRes.map((r) => r.data);
});
exports.getChunksData = getChunksData;
