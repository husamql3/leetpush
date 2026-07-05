"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var server_1 = __importDefault(require("./server"));
var PORT = 3000;
server_1.default.listen(PORT, function () {
    console.log("Working on http://localhost:".concat(PORT));
});
//# sourceMappingURL=index.js.map