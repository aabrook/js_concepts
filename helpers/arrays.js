const { curry } = require('./')

const zip = (a, b) => a.map((v, i) => [v, b[i]])
const zipWith = (f, a, b) => a.map((v, i) => f(v, b[i]))
const cycle = (count, [h, ...t]) => count > 0 ? [...(cycle(count - 1, [...t, h])), h] : []

module.exports = {
  cycle: curry(cycle),
  zip: curry(zip),
  zipWith: curry(zipWith)
}
