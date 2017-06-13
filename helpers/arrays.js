
const zip = (a, b) => a.map((v, i) => [v, b[i]])
const zipWith = (f) => (a, b) => a.map((v, i) => f(v, b[i]))

module.exports = {
  zip,
  zipWith
}
