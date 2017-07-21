const Lens = (l, r) => ({
  concat: (lens) => Lens(lens.contramap(l), lens.map(r)),
  contramap: (f) => Lens((v => f(l(v))), r),
  map: (f) => Lens(l, (v => f(r(v)))),
  view: (v) => r(v),
  over: (v) => r(l(v)),
  inspect: () => `Lens(${l}, ${r})`
})

Lens.of = (a, b) => Lens(a, b)

const a = { name: 'Jo', age: 35, city: 'Townsville' }
l = Lens.of(a => a, b => b)
const b = l.contramap(({ name, age }) => ({ name, age })
  ).contramap(({ name, age }) => ({ name, age: age * 2})
  ).map(({ name, age }) => (`${name} is ${age}`)
  ).over(a)

const name = Lens.of(({ name }) => name, a => a)

console.log(l)
console.log(b)

module.exports = Lens
