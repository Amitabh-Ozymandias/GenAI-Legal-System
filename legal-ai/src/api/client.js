import axios from 'axios'

const BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000'

export const api = axios.create({ baseURL: BASE_URL, timeout: 120000 })

export async function analyzeContract(file) {
  const form = new FormData()
  form.append('file', file)
  const { data } = await api.post('/analyze', form, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
  return data
}

export async function compareContracts(fileA, fileB) {
  const form = new FormData()
  form.append('contract_a', fileA)
  form.append('contract_b', fileB)
  const { data } = await api.post('/compare', form, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
  return data
}

export async function chatWithContract(file, question) {
  const form = new FormData()
  form.append('file', file)
  form.append('question', question)
  const { data } = await api.post('/chat', form, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
  return data
}

export async function ping() {
  const { data } = await api.get('/')
  return data
}
