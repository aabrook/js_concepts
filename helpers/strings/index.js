const prepend = (padding, minLength, s) => (
  s.length < minLength
    ? padding.repeat(minLength - s.length).concat(s)
    : s
)

module.exports = {
  prepend
}
