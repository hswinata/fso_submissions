import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import LoginForm from './components/LoginForm'
import Notification from './components/Notification'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [notificationMessage, setNotificationMessage] = useState(null)
  const [notificationType, setNotificationType] = useState('')

  useEffect(() => {
    blogService.getAll().then((blogs) => setBlogs(blogs))
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const loggedinUser = await loginService.login({ username, password })
      setUser(loggedinUser)
      setNotificationType('notification')
      setNotificationMessage(`${loggedinUser.name} has succesfully logged in`)
      setTimeout(() => {
        setNotificationMessage(null)
      }, 5000)
      setUsername('')
      setPassword('')
    } catch (error) {
      console.error(error)
      setNotificationType('error')
      setNotificationMessage(error.response.data.error)
      setTimeout(() => {
        setNotificationMessage(null)
      }, 5000)
    }
  }

  //Helper functions.
  const loginForm = () => (
    <div>
      <LoginForm
        username={username}
        password={password}
        setUsername={setUsername}
        setPassword={setPassword}
        handleLogin={handleLogin}
      />
    </div>
  )

  const blogList = () => (
    <div>
      <h2>blogs</h2>
      <p>{user.name} is logged in</p>
      {blogs
        .filter((blog) => blog.user[0].username === user.username)
        .map((blog) => (
          <Blog key={blog.id} blog={blog} />
        ))}
    </div>
  )

  return (
    <div>
      <Notification
        notificationMessage={notificationMessage}
        notificationType={notificationType}
      />
      {user === null ? loginForm() : blogList()}
    </div>
  )
}

export default App
