import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import LoginForm from './components/LoginForm'
import AddBlogForm from './components/AddBlogForm'
import Notification from './components/Notification'
import ToggleVisibility from './components/ToggleVisibility'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
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

  //Reference to AddBlogForm component.
  const addBlogFormRef = useRef()

  //Handlers:
  const handleLogin = async (loginData) => {
    try {
      //Token management.
      const loggedinUser = await loginService.login(loginData)
      window.localStorage.setItem('loggedinUser', JSON.stringify(loggedinUser))
      blogService.setToken(loggedinUser.token)

      //Update states.
      setUser(loggedinUser)
      setNotificationType('notification')
      setNotificationMessage(`${loggedinUser.name} has succesfully logged in`)
      setTimeout(() => {
        setNotificationMessage(null)
      }, 5000)
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

  const handleAddBlog = async (id, newBlog) => {
    try {
      addBlogFormRef.current.toggleVisibility()
      await blogService.addBlog(newBlog)

      //Update state.
      const newBlogObject = { id, ...newBlog }
      setBlogs((prevBlogs) => [...prevBlogs, newBlogObject])

      setNotificationType('notification')
      setNotificationMessage(`a new blog ${newBlog.title} has been added`)
      setTimeout(() => {
        setNotificationMessage(null)
      }, 5000)
    } catch (error) {
      console.error(error)
      setNotificationType('error')
      setNotificationMessage('There was an error adding a new blog')
      setTimeout(() => {
        setNotificationMessage(null)
      }, 5000)
    }
  }

  const handleLikeClick = async (updatedBlog) => {
    try {
      const updatedBlogObject = await blogService.addLike(updatedBlog)

      //Update state.
      setBlogs((prevBlogs) =>
        prevBlogs.map((prevBlog) =>
          prevBlog.id === updatedBlog.id ? updatedBlogObject : prevBlog
        )
      )
      setNotificationType('notification')
      setNotificationMessage('thank you for the like!')
      setTimeout(() => {
        setNotificationMessage(null)
      }, 5000)
    } catch (error) {
      console.error(error)
      setNotificationType('error')
      setNotificationMessage('There was an error liking the blog')
      setTimeout(() => {
        setNotificationMessage(null)
      }, 5000)
    }
  }

  //Helper functions.
  const loginForm = () => (
    <div>
      <LoginForm handleLogin={handleLogin} />
    </div>
  )

  const blogList = () => (
    <div>
      <h2>blogs</h2>
      <div>
        {user.name} is logged in
        <button onClick={handleLogout}>logout</button>
      </div>

      <ToggleVisibility
        buttonLabel="new blog"
        setNotificationMessage={setNotificationMessage}
        ref={addBlogFormRef}
      >
        <AddBlogForm handleAddBlog={handleAddBlog} />
      </ToggleVisibility>
      {blogs.map((blog) => (
        <Blog key={blog.id} blog={blog} handleLikeClick={handleLikeClick} />
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
