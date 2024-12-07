const jwt = require('jsonwebtoken')

const UnauthorizedError = require('../errors/unauthorized')
const config = require('../config')
const userservice = require('../api/users/users.service')

module.exports = async (req, __res, next) => {
  try {
    const token = req.headers['x-access-token']
    if (!token) {
      throw new Error('No token provided')
    }
    const decoded = jwt.verify(token, config.secretJwtToken)
    const user = await userservice.get(decoded.userId)

    if (!user) {
      throw new Error('User not found')
    }

    req.user = user
    next()
  } catch (message) {
    next(new UnauthorizedError(message))
  }
}
