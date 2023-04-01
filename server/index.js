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
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const body_parser_1 = __importDefault(require("body-parser"));
const inference_api_1 = require("./inference-api");
const chunk_api_1 = require("./chunk-api");
const app = (0, express_1.default)();
app.use((0, cors_1.default)({
    origin: process.env.CORS_ORIGIN
}));
app.use(body_parser_1.default.json());
const port = process.env.PORT || 8000;
const GENERIC_SERVER_ERROR = 'Something went wrong';
app.post('/ask-question', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { question } = req.body;
    let chunks = [];
    try {
        chunks = yield (0, inference_api_1.getChunks)(question);
    }
    catch (e) {
        // TODO: report to sentry or another error reporting service
        res.status(500).send(GENERIC_SERVER_ERROR);
    }
    let token = yield (0, chunk_api_1.getToken)();
    if (!token) {
        // TODO: report to sentry or another error reporting service
        res.status(500).send(GENERIC_SERVER_ERROR);
    }
    else {
        try {
            const chunksData = yield (0, chunk_api_1.getChunksData)(token, chunks);
            if (chunksData === null || chunksData === void 0 ? void 0 : chunksData.length) {
                const zippedChunks = chunks.map((chunk, i) => ({ confidence: chunk.confidence, data: chunksData[i] }));
                res.status(200).send(zippedChunks);
            }
            else {
                res.status(404).send();
            }
        }
        catch (e) {
            // TODO: report to sentry or another error reporting service
            console.log(e);
        }
    }
    res.send().status(404);
}));
app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
});
