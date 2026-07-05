import { Router } from 'express'

import {
  fetchDailyProblem,
  fetchProfileData,
  fetchUserProfileCalendar,
} from './leetcode.api'

const router = Router()

router.get('/', async (_, res) => {
  return res.status(200).json({
    message: 'Welcome to LeetPush API',
    totalSolvedProblems: '/api/v1/:userId',
    dailyProblem: '/api/v1/daily',
    last20Submissions: '/api/v1/submissions/:userId',
    profileCalendar: '/api/v1/userProfileCalendar/:username',
  })
})

/**
 * GET /api/v1/daily
 * Fetches the daily problem from LeetCode.
 * @returns {Promise<DailyProblem>} - The daily problem.
 **/
router.get('/daily', async (_, res) => {
  try {
    const data = await fetchDailyProblem()
    if (!data) {
      return res.status(500).json({ error: 'Failed to fetch daily problem' })
    }

    return res.status(200).json({ data })
  } catch (e) {
    console.error('Error fetching daily problem:', e)
    return res.status(500).json({ error: 'An error occurred while fetching daily problem data' })
  }
})

/**
 * GET /api/v1/:userId
 * Fetches the user's profile data from LeetCode.
 * @param {string} userId - The user's LeetCode user ID.
 * @returns {Promise<ProfileData>} - The user's profile data.
 **/
router.get('/:userId', async (req, res) => {
  const userId = req.params.userId

  try {
    const data = await fetchProfileData(userId)
    if (!data) return res.status(404).json({ error: 'User not found' })

    return res.status(200).json({ data })
  } catch (e) {
    console.error('Error fetching user profile data:', e)
    return res.status(500).json({ error: 'An error occurred while fetching user profile data' })
  }
})

/**
 * GET /api/v1/userProfileCalendar/:username
 * Fetches the user's profile calendar from LeetCode.
 * @param {string} username - The user's LeetCode username.
 * @returns {Promise<ProfileCalendar>} - The user's profile calendar.
 **/
router.get('/userProfileCalendar/:username', async (req, res) => {
  const { username } = req.params

  try {
    const userCalendar = await fetchUserProfileCalendar(username)
    if (!userCalendar) return res.status(404).json({ error: 'User not found' })

    res.json(userCalendar)
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
})

export default router
