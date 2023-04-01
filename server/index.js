"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
const port = process.env.PORT || 8000;
app.get('/', (_, res) => {
    res.send('hello world');
});
app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
});
