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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var profile_fetch_1 = require("./modules/profile-fetch");
var dailyProblem_fetch_1 = require("./modules/dailyProblem-fetch");
var submissions_fetch_1 = require("./modules/submissions-fetch");
var profileCalendar_fetch_1 = require("./modules/profileCalendar-fetch");
var router = (0, express_1.Router)();
router.get('/', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        return [2 /*return*/, res.status(200).json({
                message: 'Welcome to LeetPush API',
                totalSolvedProblems: '/api/v1/:userId',
                dailyProblem: '/api/v1/daily',
                last20Submissions: '/api/v1/submissions/:userId',
                profileCalendar: '/api/v1/userProfileCalendar/:username'
            })];
    });
}); });
router.get('/daily', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var data, e_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, (0, dailyProblem_fetch_1.fetchDailyProblem)()];
            case 1:
                data = _a.sent();
                if (!data) {
                    return [2 /*return*/, res.status(500).json({ error: 'Failed to fetch daily problem' })];
                }
                return [2 /*return*/, res.status(200).json({ data: data })];
            case 2:
                e_1 = _a.sent();
                console.error('Error fetching daily problem:', e_1);
                return [2 /*return*/, res.status(500).json({ error: 'An error occurred while fetching daily problem data' })];
            case 3: return [2 /*return*/];
        }
    });
}); });
router.get('/:userId', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var userId, data, e_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                userId = req.params.userId;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, (0, profile_fetch_1.fetchProfileData)(userId)];
            case 2:
                data = _a.sent();
                if (!data) {
                    return [2 /*return*/, res.status(500).json({ error: 'Failed to fetch user profile data' })];
                }
                return [2 /*return*/, res.status(200).json({ data: data })];
            case 3:
                e_2 = _a.sent();
                console.error('Error fetching user profile data:', e_2);
                return [2 /*return*/, res.status(500).json({ error: 'An error occurred while fetching user profile data' })];
            case 4: return [2 /*return*/];
        }
    });
}); });
router.get('/submissions/:userId', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var userId, data, e_3, error;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                userId = req.params.userId;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, (0, submissions_fetch_1.fetchLast20Submissions)(userId)];
            case 2:
                data = _a.sent();
                if (!data) {
                    return [2 /*return*/, res.status(500).json({ error: 'Failed to fetch submissions data' })];
                }
                return [2 /*return*/, res.status(200).json({ data: data })];
            case 3:
                e_3 = _a.sent();
                console.error('Error fetching submissions data:', e_3);
                error = e_3;
                return [2 /*return*/, res.status(500).json({ error: "An error occurred while fetching submissions data: ".concat(error.message) })];
            case 4: return [2 /*return*/];
        }
    });
}); });
router.get('/userProfileCalendar/:username', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var username, userCalendar, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                username = req.params.username;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, (0, profileCalendar_fetch_1.fetchUserProfileCalendar)(username)];
            case 2:
                userCalendar = _a.sent();
                res.json(userCalendar);
                return [3 /*break*/, 4];
            case 3:
                error_1 = _a.sent();
                res.status(500).json({ error: error_1.message });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
exports.default = router;
//# sourceMappingURL=router.js.map