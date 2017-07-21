const assert = require('assert')
const Lens = require('../lens')

const id = a => a

describe('Lens', () => {
  // lens laws
  // l.get(l.set(b, a)) = b
  // l.set(c, l.set(b, a)) = l.set(c, a)
  // l.set(l.get(a), a) = a

  it('should return b when it has been set', () => {
    const a = { name: 'Bob', age: 30, job: 'builder' }

    assert.deepEqual(
      Lens.of(id, id).contramap(
        ({ name, job }) => ({ name, job: `retired ${job}` })
      ).over(a),
      { name: 'Bob', job: 'retired builder' }
    )
  })

  it('should provide the final value set', () => (
    assert.equal(
      Lens.of(id, id).contramap(_ => 'a').contramap(_ => 'b').over('c'),
      Lens.of(id, id).contramap(_ => 'b').over('c')
    )
  ))

  it('should set not change if there is no change', () => (
    assert.equal(
      Lens.of(id, id).contramap(id).map(id).view('a'),
      'a'
    )
  ))

  it('should map', () => {
    const a = { name: 'Bob', age: 30, job: 'builder' }

    assert.deepEqual(
      Lens.of(id, id).map(({ name, age }) => ({ name, age })).view(a),
      { name: 'Bob', age: 30 }
    )
  })

})
