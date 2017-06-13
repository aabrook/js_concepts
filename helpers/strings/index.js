const prepend = (padding, minLength, s) => (
  s.length < minLength
    ? padding.repeat(minLength - s.length).concat(s)
    : s
)

const words = (s) => s.split(' ')
const unwords = (ary) => ary.join(' ')

module.exports = {
  prepend,
  words,
  unwords
}
