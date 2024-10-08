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

  //Get blogs and sort it by likes.
  useEffect(() => {
    const getSortedBlogs = async () => {
      try {
        if (user) {
          const allBlogs = await blogService.getAll()
          const sortedBlogs = allBlogs.sort((a, b) => b.likes - a.likes)
          setBlogs(sortedBlogs)
        }
      } catch (error) {
        console.error(error)
      }
    }
    getSortedBlogs()
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

  const handleAddBlog = async (newBlog) => {
    try {
      addBlogFormRef.current.toggleVisibility()
      const addedBlog = await blogService.addBlog(newBlog)

      //Update state.
      setBlogs((prevBlogs) => [...prevBlogs, addedBlog])
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
        prevBlogs
          .map((prevBlog) =>
            prevBlog.id === updatedBlog.id ? updatedBlogObject : prevBlog
          )
          .sort((a, b) => b.likes - a.likes)
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

  const handleDeleteBlog = async (deletedBlogId) => {
    try {
      await blogService.deleteBlog(deletedBlogId)

      //Update state.
      setBlogs((prevBlogs) =>
        prevBlogs.filter((prevBlog) => prevBlog.id !== deletedBlogId)
      )
      setNotificationType('notification')
      setNotificationMessage('Blog has been deleted')
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
      <div className="blog-list-container">
        {blogs.map((blog) => (
          <Blog
            user={user}
            key={blog.id}
            blog={blog}
            handleLikeClick={handleLikeClick}
            handleDeleteBlog={handleDeleteBlog}
          />
        ))}
      </div>
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
