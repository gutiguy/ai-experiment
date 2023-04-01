import axios from "axios"

const INFERENCE_RUNNER_API_KEY = process.env.AI_EXP_INFERENCE_RUNNER_API_KEY
const INFERENCE_RUNNER_ENDPOINT = process.env.AI_EXP_INFERENCE_RUNNER_ENDPOINT || ''

const inferenceRunnerHeaders = {
  'X-Api-Key': INFERENCE_RUNNER_API_KEY,
}

export interface Chunk {
  confidence: number
  chunkId: string
}


interface AskResponse {
  chunks: Chunk[]
}

export const getChunks = async (question: string): Promise<Chunk[]> => {
    const chunksRes = await axios.post<AskResponse>(INFERENCE_RUNNER_ENDPOINT, { question }, { headers: inferenceRunnerHeaders } )
    return chunksRes.data.chunks.filter(chunk => chunk.confidence >= 70).sort((a, b) => b.confidence - a.confidence)
}
