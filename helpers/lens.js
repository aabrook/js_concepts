const { id } = require('./')
const { assign } = Object

const Lens = (l, r) => ({
  concat: (lens) => (
    Lens(
      v => lens.view(l(v)),
      (v, obj) => {
        const inner = lens.set(v, l(obj))

        return r(inner, obj)
      }
    )
  ),

  view: (v) => l(v),
  set: (v, obj) => r(v, obj),
  over: (f, s) => r(f(l(s), s), s),

  map: (f) => Lens(l, v => r(f(v))),
  contramap: (f) => Lens(v => l(f(v)), r),

  extract: () => [l, r],
  inspect: () => `Lens(${l}, ${r})`
})

Lens.of = (a, b) => Lens(a, b)
Lens.empty = Lens(id, id)
Lens.withProp = (k) => Lens(v => v[k], (v, obj) => assign({}, obj, { [k]: v }))
Lens.withIndex = (k) => Lens(v => v[k], (v, ary) => ary.map((val, i) => i === k ? v : val))

module.exports = Lens
