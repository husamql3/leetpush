"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userProfileCalendarQuery = void 0;
exports.userProfileCalendarQuery = "\n  query userProfileCalendar($username: String!, $year: Int) {\n    matchedUser(username: $username) {\n      userCalendar(year: $year) {\n        streak\n        totalActiveDays\n        submissionCalendar\n      }\n    }\n  }\n";
//# sourceMappingURL=profileCalendar.js.map