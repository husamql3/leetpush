import express from 'express'
import morgan from 'morgan'
import cors from 'cors'
import router from './router'

const app = express()

app.use(cors())
app.options('*', cors())

app.use(morgan('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.get('/', (_, res) => {
  res.status(200)
  res.json({
    message: 'Welcome to LeetPush API',
    totalSolvedProblems: '/api/v2/:userId',
    dailyProblem: '/api/v2/daily',
    profileCalendar: '/api/v2/userProfileCalendar/:username/',
  })
})

app.use('/api/v2', router)

export default app
