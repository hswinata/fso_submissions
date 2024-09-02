const LoginForm = ({
  username,
  password,
  setUsername,
  setPassword,
  handleLogin
}) => {
  const handleNameChange = ({ target }) => {
    setUsername(target.value)
  }

  const handlePasswordChange = ({ target }) => {
    setPassword(target.value)
  }

  return (
    <>
      <h2>log in to application</h2>
      <form onSubmit={handleLogin}>
        <div>
          username
          <input onChange={handleNameChange} type="text" value={username} />
        </div>
        <div>
          password
          <input
            onChange={handlePasswordChange}
            type="password"
            value={password}
          />
        </div>
        <div>
          <button type="submit">login</button>
        </div>
      </form>
    </>
  )
}

export default LoginForm
