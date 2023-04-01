import axios from "axios"
import { Chunk } from "./inference-api"

const CHUNK_HOLDER_API_KEY = process.env.AI_EXP_CHUNK_HOLDER_API_KEY
const CHUNK_CHOLDER_ENDPOINT = process.env.AI_EXP_CHUNK_HOLDER_ENDPOINT || ''

const chunkHolderRequestHeaders = {
  'X-Api-Key': CHUNK_HOLDER_API_KEY,
}

export const getToken = async (): Promise<string | null> => {
  let tokenRes = null

  try {
    tokenRes = await axios.post<{ token : string }>(`${CHUNK_CHOLDER_ENDPOINT}/auth/generate-token`, {}, { headers: chunkHolderRequestHeaders })
  } catch (e) {
    // TODO: report to sentry or another error reporting service
    return null
  }

  return tokenRes?.data.token
}

export const getChunksData = async (token: string, chunks: Chunk[]): Promise<string[] | null> => {
    const getChunksDataRes = await Promise.all(chunks.map((c) => axios.get(`${CHUNK_CHOLDER_ENDPOINT}/chunks/${c.chunkId}`, { headers: { Authorization: token } })))
    return  getChunksDataRes.map((r) => r.data)
}
