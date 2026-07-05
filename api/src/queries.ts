export const DailyProblemQuery = `
  query {
    activeDailyCodingChallengeQuestion {
      date
      link
      question {
        questionId
        questionFrontendId
        title
        titleSlug
        difficulty
        topicTags {
          name
          slug
          translatedName
        }
        stats
      }
    }
  }
`

export const ProfileCalendarQuery = `
  query userProfileCalendar($username: String!, $year: Int) {
    matchedUser(username: $username) {
      userCalendar(year: $year) {
        streak
        totalActiveDays
        submissionCalendar
      }
    }
  }
`

export const ProfileQuery = `
  query userProblemsSolved($username: String!) {
    allQuestionsCount {
      difficulty
      count
    }
    matchedUser(username: $username) {
      submitStatsGlobal {
        acSubmissionNum {
          difficulty
          count
        }
      }
    }
  }
`
