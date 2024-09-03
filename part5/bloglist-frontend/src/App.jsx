import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import LoginForm from './components/LoginForm'
import AddBlogForm from './components/AddBlogForm'
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

  //Get filteredBlogs by user.
  useEffect(() => {
    const getFilteredBlogs = async () => {
      try {
        if (user) {
          const allBlogs = await blogService.getAll()
          const filteredBlogs = allBlogs.filter(
            (blog) => blog.user[0].username === user.username
          )
          setBlogs(filteredBlogs)
        }
      } catch (error) {
        console.error(error)
      }
    }
    getFilteredBlogs()
  }, [user])

  //Persist logged in user when page reloads.
  useEffect(() => {
    try {
      const loggedinUser = window.localStorage.getItem('loggedinUser')
      if (loggedinUser) {
        const user = JSON.parse(loggedinUser)
        setUser(user)
        blogService.setToken(user.token)
      }
    } catch (error) {
      console.error(error)
    }
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      //Token management.
      const loggedinUser = await loginService.login({ username, password })
      window.localStorage.setItem('loggedinUser', JSON.stringify(loggedinUser))
      blogService.setToken(loggedinUser.token)

      //Update states.
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

  const handleLogout = () => {
    try {
      window.localStorage.removeItem('loggedinUser')
      setUser(null)
      setNotificationMessage(null)
    } catch (error) {
      console.error(error)
    }
  }

  const handleAddBlog = async (event, id, newBlog) => {
    event.preventDefault()

    try {
      blogService.addBlog(newBlog)
      const newBlogObject = { id, ...newBlog }
      setBlogs((prevBlogs) => [...prevBlogs, newBlogObject])
      setNotificationType('notification')
      setNotificationMessage(`a new blog ${newBlog.title} has been added`)
    } catch (error) {
      console.error(error)
      setNotificationType('error')
      setNotificationMessage('There was an error adding a new')
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
      <AddBlogForm handleAddBlog={handleAddBlog} />
      <button onClick={handleLogout}>logout</button>
      {blogs.map((blog) => (
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
