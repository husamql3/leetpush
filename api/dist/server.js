"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var morgan_1 = __importDefault(require("morgan"));
var cors_1 = __importDefault(require("cors"));
var router_1 = __importDefault(require("./router"));
var app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.options('*', (0, cors_1.default)());
app.use((0, morgan_1.default)('dev'));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.get('/', function (req, res) {
    res.status(200);
    res.json({
        message: 'Welcome to LeetPush API',
        totalSolvedProblems: '/api/v1/:userId',
        dailyProblem: '/api/v1/daily',
        last20Submissions: '/api/v1/submissions/:userId',
        profileCalendar: '/api/v1/userProfileCalendar/:username/:year'
    });
});
app.use('/api/v1', router_1.default);
exports.default = app;
//# sourceMappingURL=server.js.map