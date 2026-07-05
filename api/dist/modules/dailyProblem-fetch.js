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
exports.fetchDailyProblem = fetchDailyProblem;
var dailyProblem_query_1 = require("../graphql/dailyProblem-query");
function fetchDailyProblem() {
    return __awaiter(this, void 0, void 0, function () {
        var body, res, data, dailyProblem, question, date, link, _a, questionFrontendId, title, titleSlug, difficulty, topicTags, e_1;
        var _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    body = {
                        query: dailyProblem_query_1.DailyProblemQuery
                    };
                    _c.label = 1;
                case 1:
                    _c.trys.push([1, 4, , 5]);
                    return [4 /*yield*/, fetch('https://leetcode.com/graphql', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify(body)
                        })];
                case 2:
                    res = _c.sent();
                    if (!res.ok) {
                        throw new Error("Network response was not ok: ".concat(res.statusText));
                    }
                    return [4 /*yield*/, res.json()];
                case 3:
                    data = _c.sent();
                    dailyProblem = (_b = data === null || data === void 0 ? void 0 : data.data) === null || _b === void 0 ? void 0 : _b.activeDailyCodingChallengeQuestion;
                    question = dailyProblem === null || dailyProblem === void 0 ? void 0 : dailyProblem.question;
                    if (!dailyProblem || !question) {
                        throw new Error('Incomplete data received from API');
                    }
                    date = dailyProblem.date, link = dailyProblem.link, _a = dailyProblem.question, questionFrontendId = _a.questionFrontendId, title = _a.title, titleSlug = _a.titleSlug, difficulty = _a.difficulty, topicTags = _a.topicTags;
                    return [2 /*return*/, {
                            date: date,
                            link: link,
                            questionFrontendId: questionFrontendId,
                            title: title,
                            titleSlug: titleSlug,
                            difficulty: difficulty,
                            topicTags: topicTags
                        }];
                case 4:
                    e_1 = _c.sent();
                    console.error('Error fetching daily problem:', e_1);
                    throw new Error('An error occurred while fetching the daily problem data');
                case 5: return [2 /*return*/];
            }
        });
    });
}
//# sourceMappingURL=dailyProblem-fetch.js.map