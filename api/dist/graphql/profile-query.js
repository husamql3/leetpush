"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProfileQuery = void 0;
exports.ProfileQuery = "\nquery userProblemsSolved($username: String!) {\n  allQuestionsCount {\n    difficulty\n    count\n  }\n  matchedUser(username: $username) {\n    submitStatsGlobal {\n      acSubmissionNum {\n        difficulty\n        count\n      }\n    }\n  }\n}\n";
//# sourceMappingURL=profile-query.js.map