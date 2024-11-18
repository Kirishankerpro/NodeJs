class UnauthorizedError extends Error {
  status = 401
  constructor(message = 'Unauthorized token') {
    super(message)
  }
}

module.exports = UnauthorizedError
