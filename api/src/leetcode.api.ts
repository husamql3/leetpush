import axios from 'axios'

import {
  ProfileCalendar,
  ProfileData,
  ProfileDataI,
  DailyProblem,
  DailyProblemI,
} from './types'
import {
  DailyProblemQuery,
  ProfileCalendarQuery,
  ProfileQuery,
} from './queries'
import { createFullSubmissionArray } from './utils'

/**
 * fetchDailyProblem - Fetches the daily problem from LeetCode.
 * @returns {Promise<DailyProblem>} - The daily problem.
 **/
export async function fetchDailyProblem(): Promise<DailyProblem> {
  try {
    const { data } = await axios.post<DailyProblemI>(
      'https://leetcode.com/graphql',
      {
        query: DailyProblemQuery,
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      },
    )

    const {
      date,
      link,
      question,
    } = data.data.activeDailyCodingChallengeQuestion
    return { date, link, question }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        console.error(
          'LeetCode API error:',
          error.response.status,
          error.response.statusText,
        )
        console.error('Response data:', error.response.data)
        throw new Error(
          `LeetCode API error: ${error.response.status} ${error.response.statusText}`,
        )
      } else if (error.request) {
        console.error('No response received from LeetCode API')
        throw new Error('No response received from LeetCode API')
      } else {
        console.error('Error setting up request:', error.message)
        throw new Error(`Error setting up request: ${error.message}`)
      }
    }
    console.error('Unexpected error:', error)
    throw new Error('An unexpected error occurred')
  }
}

/**
 * fetchUserProfileCalendar - Fetches the user's profile calendar from LeetCode.
 * @param {string} username - The user's LeetCode username.
 * @returns {Promise<ProfileCalendar>} - The user's profile calendar.
 **/
export async function fetchUserProfileCalendar(username: string): Promise<ProfileCalendar | null> {
  try {
    const { data } = await axios.post(
      'https://leetcode.com/graphql',
      {
        variables: { username, year: new Date().getFullYear() },
        query: ProfileCalendarQuery,
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      },
    )

    if (data.data.matchedUser === null) return null

    const { streak, totalActiveDays, submissionCalendar } =
      data.data.matchedUser.userCalendar

    const fullSubmissionArray = createFullSubmissionArray(submissionCalendar)

    return {
      maxStreak: streak,
      totalActiveDays,
      fullSubmissionArray,
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        console.error(
          'LeetCode API error:',
          error.response.status,
          error.response.statusText,
        )
        console.error('Response data:', error.response.data)
        throw new Error(
          `LeetCode API error: ${error.response.status} ${error.response.statusText}`,
        )
      } else if (error.request) {
        console.error('No response received from LeetCode API')
        throw new Error('No response received from LeetCode API')
      } else {
        console.error('Error setting up request:', error.message)
        throw new Error(`Error setting up request: ${error.message}`)
      }
    }
    if (error instanceof Error && error.message.startsWith('User not found:')) {
      throw error
    }
    console.error('Unexpected error:', error)
    throw new Error('An unexpected error occurred')
  }
}

/**
 * profileData - Fetches the user's profile data from LeetCode.
 * @param {string} username - The user's LeetCode username.
 * @returns {Promise<ProfileData>} - The user's profile data.
 **/
export async function fetchProfileData(username: string): Promise<ProfileData | null> {
  try {
    const { data } = await axios.post<ProfileDataI>(
      'https://leetcode.com/graphql',
      {
        variables: { username },
        query: ProfileQuery,
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      },
    )

    if (data.data.matchedUser === null) return null

    return {
      allQuestionsCount: data.data.allQuestionsCount,
      acSubmissionNum: data.data.matchedUser.submitStatsGlobal.acSubmissionNum,
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        throw new Error(
          `LeetCode API error: ${error.response.status} ${error.response.statusText}`,
        )
      } else if (error.request) {
        throw new Error('No response received from LeetCode API')
      } else {
        throw new Error(`Error setting up request: ${error.message}`)
      }
    }
    if (error instanceof Error && error.message.startsWith('User not found:')) {
      throw error
    }
    throw new Error('An unexpected error occurred')
  }
}
