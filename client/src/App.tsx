import { Typography, Grid, Button, TextField, Box, styled, Card, CircularProgress } from "@mui/material"
import axios from "axios"
import { useState } from "react"

interface ChunkRes {
  confidence: number
  data: string
}

const ChunkContainer = styled(Card)({
  marginTop: "1rem",
  padding: '2rem',
})

const PageContainer = styled(Box)({
  padding: "1rem",
  fontFamily: "monospace",
  boxSizing: "border-box",
})

const ErrorContainer = styled(Box)({
  padding: "1rem",
  fontFamily: "monospace",
  boxSizing: "border-box",
  textAlign: 'center',
  fontSize: '4rem',
  color: 'red',
})

const LoadingContainer = styled(Box)({
  justifyContent: 'center',
  display: 'flex',
  alignItems: 'center'
})

function App() {
  const [question, setQuestion] = useState("")
  const [error, setError] = useState('')
  const [loading, setLoading] = useState<boolean>(false)
  const [chunks, setChunks] = useState<ChunkRes[]>([])

  const askQuestion = async () => {
    if (!question) {
      setError('Please enter a question')
      return
    } else {
      setError('')
    }

    try {
      setLoading(true)
      const res = await axios.post<ChunkRes[]>("http://localhost:8000/ask-question", { question })
      console.log(res)
      if (!res.data?.length) {
        setChunks([])
        setError('No answers found')
      } else {
        setChunks(res.data)
      }
    } catch (e) {
      // TODO: send error to sentry or other error tracking service (in a real app)
      setError('Oops! Something went wrong, please try again later')
    } finally {
      setLoading(false)
    }
  }

  return (
    <PageContainer>
      <Grid container style={{ width: '100vw' }} spacing={4}>
        <Grid item xs={10}>
          <Typography variant="h1">
            <TextField fullWidth label="What would you like to know?" variant="outlined" onChange={(e) => { setQuestion(e.target.value)}} />
          </Typography>
        </Grid>
        <Grid item xs={2}>
          <Button variant="contained" fullWidth onClick={askQuestion}>Ask Question</Button>
        </Grid>
      </Grid>
      {loading ?
        <LoadingContainer>
          <CircularProgress style={{marginRight: '2rem'}} />
          <Typography variant="h2">Fetching answers...</Typography>
        </LoadingContainer>
      :
      <>
        {error && <ErrorContainer><Typography variant="h3" color="error">{error}</Typography></ErrorContainer>}
        <Box>
          {chunks.map((chunk, i) => (
            <ChunkContainer variant="outlined" key={i}>
              <div dangerouslySetInnerHTML={{ __html: chunk.data }} />
              <div style={{ marginTop: '2rem' }}><Typography variant='body2'>Confidence: {chunk.confidence}</Typography></div>
            </ChunkContainer>
          ))}
        </Box>
      </>
    }
    </PageContainer>
  )
}

export default App
