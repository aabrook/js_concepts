const { prepend } = require('./strings')
const id = (a) => a

const log = (logger = console.log) => (fn) => (...args) => {
  logger('args', ...args)
  const result = fn(...args)
  logger('result', result)
  return result
}

const Try = (fn, success, error = id) => (...args) => {
  try {
    return success(fn(...args))
  } catch (e) {
    return error(e)
  }
}

const bool = (f, t, c) => (...args) => c(...args) ? t(...args) : f(...args)
const compose = (...funcs) => funcs.reduce((acc, fn) => (...args) => acc(fn(...args)))

const $ = (f, a) => f(a)

const flip = (f, b, a) => f(b, a)

const curry = (f) => {
  const build = (...args) => (
    args.length >= f.length
      ? f(...args)
      : (...argv) => build(...args, ...argv)
  )

  return build
}

const map = (f, a) => a.length ? [f(a[0]), ...map(f, a.slice(1))] : []

module.exports = {
  bool: curry(bool),
  $: curry($),
  compose,
  curry,
  flip: curry(flip),
  map: curry(map),
  prepend: curry(prepend),
  log: log,
  id,
  Try: curry(Try)
}
