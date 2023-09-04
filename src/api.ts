import express, { Router } from 'express'
import http from 'serverless-http'

const api = express()
const router = Router()
router.get('/', (req, res) => res.json({ message: 'Hello Express!' }))

api.use('/', router)

export const handler = http(api)
