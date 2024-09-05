import { useState, forwardRef, useImperativeHandle } from 'react'

const ToggleVisibility = forwardRef((props, refs) => {
  const [visible, setVisible] = useState(false)

  const hideWhenFormVisible = { display: visible ? 'none' : '' }
  const showWhenFormVisible = { display: visible ? '' : 'none' }

  const toggleVisibility = () => {
    setVisible(!visible)
    props.setNotificationMessage(null)
  }

  useImperativeHandle(refs, () => {
    return { toggleVisibility }
  })

  return (
    <div>
      <div>
        <button style={hideWhenFormVisible} onClick={toggleVisibility}>
          {props.buttonLabel}
        </button>
      </div>
      <div style={showWhenFormVisible}>{props.children}</div>
      <div>
        <button style={showWhenFormVisible} onClick={toggleVisibility}>
          cancel
        </button>
      </div>
    </div>
  )
})

export default ToggleVisibility