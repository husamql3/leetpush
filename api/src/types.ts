export interface DailyProblem {
  date: string
  link: string
  question: {
    questionId: string
    questionFrontendId: string
    title: string
    titleSlug: string
    difficulty: string
    topicTags: Array<{
      name: string
      slug: string
      translatedName: string | null
    }>
    stats: string
  }
}

export interface DailyProblemI {
  data: {
    activeDailyCodingChallengeQuestion: DailyProblem
  }
}

export interface ProfileCalendar {
  maxStreak: number
  totalActiveDays: number
  fullSubmissionArray: Submission[]
}

export interface ProfileCalendarI {
  data: {
    matchedUser: {
      userCalendar: {
        streak: number
        totalActiveDays: number
        submissionCalendar: string
      }
    }
  }
}

export interface Submission {
  date: string
  value: number
}

export interface ProfileDataI {
  data: {
    allQuestionsCount: Array<{ difficulty: string; count: number }>
    matchedUser: {
      submitStatsGlobal: {
        acSubmissionNum: Array<{ difficulty: string; count: number }>
      }
    }
  }
}

export interface ProfileData {
  allQuestionsCount: Array<{ difficulty: string; count: number }>
  acSubmissionNum: Array<{ difficulty: string; count: number }>
}
