const { prepend } = require('./strings')
const id = (a) => a

const log = (logger = console.log) => (fn) => (...args) => {
  logger('args', ...args)
  const result = fn(...args)
  logger('result', result)
  return result
}

const Try = (fn) => (success, error = id) => (...args) => {
  try {
    return success(fn(...args))
  } catch (e) {
    return error(e)
  }
}

const compose = (...funcs) => funcs.reduce((acc, fn) => (...args) => acc(fn(...args)))

const $ = (f) => (a) => f(a)

const flip = (f) => (b) => (a) => f(b, a)

const curry = (f) => {
  const build = (...args) => (
    args.length >= f.length
      ? f(...args)
      : (...argv) => build(...args, ...argv)
  )

  return build
}

module.exports = {
  $,
  compose,
  curry,
  flip,
  prepend,
  log,
  id,
  Try
}
