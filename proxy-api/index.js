import express from 'express'
import fetch from 'node-fetch'
import cors from 'cors'

const app = express()
const PORT = 4000

app.use(cors()) // libera o CORS 

const API_KEY = 'eyJucyI6InRlc3RlIiwic2MiOjE1MjY2Njk2NTJ9'

app.get('/posicoes', async (req, res) => {
  try {
    const response = await fetch(`https://api.appselsyn.com.br/keek/rest/v1/integracao/posicao?apikey=${API_KEY}`)
    if (!response.ok) {
      return res.status(response.status).json({ error: 'Erro na API externa' })
    }
    const data = await response.json()
    res.json(data)
  } catch (error) {
    res.status(500).json({ error: 'Erro interno no servidor' })
  }
})

app.listen(PORT, () => {
  console.log(`Proxy rodando em http://localhost:${PORT}`)
})