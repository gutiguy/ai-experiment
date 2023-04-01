import express from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'
import { Chunk, getChunks } from './inference-api'
import { getChunksData, getToken } from './chunk-api'

const app = express()

app.use(cors({
  origin: process.env.AI_EXP_CORS_ORIGIN
}))

interface ChunkRes {
  confidence: number
  data: string
}

app.use(bodyParser.json())

const port = process.env.PORT || 8000
const GENERIC_SERVER_ERROR = 'Something went wrong'

app.post('/ask-question', async (req, res) => {
  const { question } = req.body
  let chunks: Chunk[] = []
  try {
    chunks = await getChunks(question)
  } catch (e) {
    // TODO: report to sentry or another error reporting service
    res.status(500).send(GENERIC_SERVER_ERROR)
  }

  
  let token = await getToken()
  if (!token) {
    // TODO: report to sentry or another error reporting service
    res.status(500).send(GENERIC_SERVER_ERROR)
  } else {
    try {
      const chunksData = await getChunksData(token, chunks)
      if (chunksData?.length) {
        const zippedChunks: ChunkRes[] = chunks.map((chunk, i) => ({ confidence: chunk.confidence, data: chunksData[i] }))

        res.status(200).send(zippedChunks)
      } else {
        res.status(200).send([])
      }
    } catch (e) {
      // TODO: report to sentry or another error reporting service
      console.log(e)
    }
  }

  res.send().status(404)
})

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`)
})
