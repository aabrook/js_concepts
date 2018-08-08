const Continuation = (next) => ({
  run: (done) => next(done),
  map: (fn) => Continuation(done =>
    next((args) => done(fn(args)))
  ),
  ap: (cont) => Continuation(done => (
    cont.run(result =>
      next(a => done(a(result)))
    )
  )),
  chain: (fn) => Continuation(done => (
    next(args => fn(args).run(done))
  ))
})

Continuation.of = (done) => Continuation(a => a(done))
module.exports = Continuation

/* Example */
const delay = (time, s) => next =>
  setTimeout(() => next(s), time)

delay(1000, 'yay')(s => delay(1000, s + '!!!')(console.log))

Continuation(done => setTimeout(() => done('yay'), 1000))
  .chain(s => Continuation(
    next => setTimeout(() => next(s + '!'), 1000)
  ))
  .run(console.log)
