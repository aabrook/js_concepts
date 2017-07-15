const { Reader } = require('../monads')

const getAll = (_, res) => (
  Reader.ask().map(({ db: { all } }) => res.send(all))
)
const get = ({ params: { id } }, res) => (
  Reader.ask().map(({ db: { byId } }) =>
    byId(id).fork(
      r => res.send(r),
      _ => res.send({ 'error': 'not found' })
    )
  )
)
const post = ({ body }, res) => (
  Reader.ask().map(
    ({ db: { insert } }) => insert(body)
  ).map(
    a => res.send(a)
  )
)

module.exports = () => (
  Reader.ask().map(env => {
    const { app } = env
    app.get('/', (...args) => getAll(...args).runReader(env))
    app.get('/:id', (...args) => get(...args).runReader(env))
    app.post('/', (...args) => post(...args).runReader(env))
  })
)
