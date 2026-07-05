"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Last20SubmissionsQuery = void 0;
exports.Last20SubmissionsQuery = "\nquery getRecentSubmissions($username: String!, $limit: Int = 20) {\n  recentSubmissionList(username: $username, limit: $limit) {\n    time\n    timestamp\n  }\n \n}";
//# sourceMappingURL=last20Submissions.js.map