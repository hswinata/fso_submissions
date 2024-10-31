import AnecdoteForm from './components/AnecdoteForm'
import Notification from './components/Notification'
import anecdotesService from './services/anecdotes'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useNotificationDispatch } from './NotificationContext'

const App = () => {
  //Context:
  const dispatch = useNotificationDispatch()

  //Mutations:
  const queryClient = useQueryClient()

  const createAnecdoteMutation = useMutation({
    mutationFn: anecdotesService.create,
    onSuccess: (newAnecdote) => {
      const anecdotes = queryClient.getQueryData(['anecdotes'])
      queryClient.setQueryData(['anecdotes'], anecdotes.concat(newAnecdote))
    },
    onError: (error) => {
      const errorMessage = error.response.data.error
      dispatch(errorMessage, 5000)
    }
  })

  const voteAnecdoteMutation = useMutation({
    mutationFn: ({ id, anecdote }) => anecdotesService.vote(id, anecdote),
    onSuccess: (updatedAnecdote) => {
      const anecdotes = queryClient.getQueryData(['anecdotes'])
      queryClient.setQueryData(
        ['anecdotes'],
        anecdotes.map((anecdote) =>
          anecdote.id !== updatedAnecdote.id ? anecdote : updatedAnecdote
        )
      )
    }
  })

  //Handler functions:
  const handleVote = (anecdote) => {
    const id = anecdote.id
    voteAnecdoteMutation.mutate({ id, anecdote })
    dispatch(`'${anecdote.content}' has been voted.`, 5000)
  }

  //Query.
  const result = useQuery({
    queryKey: ['anecdotes'],
    queryFn: anecdotesService.getAll,
    retry: false
  })

  if (result.isLoading) {
    return <div>loading data...</div>
  }

  if (result.isError) {
    return <div>anecdote service is not available due to a server error</div>
  }

  const anecdotes = result.data

  return (
    <div>
      <h3>Anecdote app</h3>

      <Notification />
      <AnecdoteForm createAnecdoteMutation={createAnecdoteMutation} />

      {anecdotes.map((anecdote) => (
        <div key={anecdote.id}>
          <div>{anecdote.content}</div>
          <div>
            has {anecdote.votes}
            <button onClick={() => handleVote(anecdote)}>vote</button>
          </div>
        </div>
      ))}
    </div>
  )
}

export default App
