import express from 'express'

const app = express()
const port = process.env.PORT || 8000

app.get('/', (_, res) => {
  res.send('hello world')
})

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`)
})
