const mongoose = require('mongoose')

//Schema.
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, minLength: 3, unique: true },
  passwordHash: { type: String, required: true },
  name: { type: String, required: true },
  blogs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Blog' }]
})

userSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
    delete returnedObject.passwordHash
  }
})

const User = mongoose.model('User', userSchema)

module.exports = User
