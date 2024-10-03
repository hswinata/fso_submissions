import { createSlice } from '@reduxjs/toolkit'
import anecdotesService from '../services/anecdotes'

//Slice.
const anecdoteSlice = createSlice({
  name: 'anecdote',
  initialState: [],
  reducers: {
    appendAnecdote(state, action) {
      state.push(action.payload)
    },
    voteAnecdote(state, action) {
      const id = action.payload
      const anecdote = state.find((n) => n.id === id)
      const changedAnecdote = { ...anecdote, votes: anecdote.votes + 1 }
      return state
        .map((n) => (n.id !== id ? n : changedAnecdote))
        .sort((a, b) => b.votes - a.votes)
    },
    setAnecdotes(state, action) {
      return action.payload
    }
  }
})

export const { voteAnecdote, setAnecdotes, appendAnecdote } =
  anecdoteSlice.actions

export const initializeAnecdotes = () => {
  return async (dispatch) => {
    const anecdotes = await anecdotesService.getAll()
    dispatch(setAnecdotes(anecdotes))
  }
}

export const createAnecdote = (content) => {
  return async (dispatch) => {
    const newAnecdote = await anecdotesService.create(content)
    dispatch(appendAnecdote(newAnecdote))
  }
}

export default anecdoteSlice.reducer
