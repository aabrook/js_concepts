const assert = require('assert')
const Lens = require('../lens')
const { assign } = Object

const id = a => a

describe('Lens', () => {
  it('should return the update with get after it has been set', () => {
    const lens = Lens.withProp('a')
    const data = { a: 'b' }
    const subject = lens.set('n', data)

    assert.equal(lens.view(subject), 'n')
  })

  it('should map', () => {
    const a = { name: 'Bob', age: 30, job: 'builder' }

    assert.deepEqual(
      Lens.of(id, id)
        .map(({ name, age }) => ({ name, age: age + 3 }))
        .over(id, a),
      { name: 'Bob', age: 33 }
    )
  })

  it('should contramap', () => {
    const a = { firstName: 'Bob', surname: 'The', age: 30, job: 'builder', status: 'active' }
    const joinName = (obj) => assign({}, obj, { name: `${obj.firstName} ${obj.surname}` })
    const justNameAgeJob = ({ name, age, job }) => ({ name, age, job })

    assert.deepEqual(
      Lens.of(id, id)
      .contramap(joinName)
      .contramap(justNameAgeJob)
      .view(a),
      { name: 'Bob The', age: 30, job: 'builder' }
    )
  })

  it('should set the value', () => {
    const a = Lens.withProp('a')
    const data = { a: 5, b: 'b' }

    assert.deepEqual(
      a.set('a', data),
      { a: 'a', b: 'b' }
    )
  })

  it('should view the value', () => {
    const a = Lens.withProp('a')
    const data = { a: 5, b: 'b' }

    assert.equal(
      a.view(data),
      5
    )
  })

  it('should run a function over the value', () => {
    const a = Lens.withProp('a')
    const data = { a: 5, b: 'b' }
    const triple = a => a * 3

    assert.deepEqual(
      a.over(triple, data),
      { a: 15, b: 'b' }
    )
  })

  it('should nest objects', () => {
    const a = Lens.withProp('a')
    const b = Lens.withProp('b')
    const obj = { a: { b: 'b', c: 'c' } }

    const nested = a.concat(b)
    assert.equal(nested.view(obj), 'b')
    assert.deepEqual(nested.set(5, obj), { a: { b: 5, c: 'c' } })
    assert.deepEqual(nested.over(s => s.toUpperCase(), obj), { a: { b: 'B', c: 'c' } })
  })

  it('should nest arrays', () => {
    const a = Lens.withProp('a')
    const b = Lens.withProp('b')
    const _2 = Lens.withIndex(1)

    const nestedArray = { a: { b: [1, 2, 3, 4] } }
    const triple = a => a * 3
    const bary = a.concat(b).concat(_2)
    assert.equal(bary.view(nestedArray), 2)
    assert.deepEqual(bary.set(5, nestedArray), { a: { b: [1, 5, 3, 4] } })
    assert.deepEqual(bary.over(triple, nestedArray), { a: { b: [1, 6, 3, 4] } })
  })
})
