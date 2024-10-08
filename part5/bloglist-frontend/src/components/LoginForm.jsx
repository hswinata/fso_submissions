import { useState } from 'react'
import PropTypes from 'prop-types'

const LoginForm = ({ handleLogin }) => {
  const [loginFormData, setLoginFormData] = useState({
    username: '',
    password: ''
  })

  const handleChange = ({ target }) => {
    const { name, value } = target
    setLoginFormData({ ...loginFormData, [name]: value })
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    handleLogin(loginFormData)
    setLoginFormData({ username: '', password: '' })
  }

  return (
    <div>
      <h2>log in to application</h2>
      <form onSubmit={handleSubmit}>
        <div>
          username
          <input
            onChange={handleChange}
            name="username"
            type="text"
            value={loginFormData.username}
            data-testid="username-input"
          />
        </div>
        <div>
          password
          <input
            onChange={handleChange}
            name="password"
            type="password"
            value={loginFormData.password}
            data-testid="password-input"
          />
        </div>
        <div>
          <button type="submit">login</button>
        </div>
      </form>
    </div>
  )
}

LoginForm.propTypes = {
  handleLogin: PropTypes.func.isRequired
}

export default LoginForm
