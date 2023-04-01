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
exports.getChunks = void 0;
const axios_1 = __importDefault(require("axios"));
const INFERENCE_RUNNER_API_KEY = process.env.INFERENCE_RUNNER_API_KEY;
const INFERENCE_RUNNER_ENDPOINT = process.env.INFERENCE_RUNNER_ENDPOINT || '';
const inferenceRunnerHeaders = {
    'X-Api-Key': INFERENCE_RUNNER_API_KEY,
};
const getChunks = (question) => __awaiter(void 0, void 0, void 0, function* () {
    const chunksRes = yield axios_1.default.post(INFERENCE_RUNNER_ENDPOINT, { question }, { headers: inferenceRunnerHeaders });
    return chunksRes.data.chunks.filter(chunk => chunk.confidence >= 70).sort((a, b) => b.confidence - a.confidence);
});
exports.getChunks = getChunks;