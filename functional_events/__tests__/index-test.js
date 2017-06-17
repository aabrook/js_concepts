const assert = require('assert')
const sinon = require('sinon')
const events = require('../')
const State = require('../../helpers/state_monad')

const id = a => a

describe('functional events', () => {
  it('should add listeners with on', () => {
    const t = sinon.spy()
    const t2 = sinon.spy()
    const setup = events.on('test-state', t, State.of({ listeners: {} }))
    const subject = events.on('second-state', t2, setup)
    subject.map(([a, st]) => {
      assert.deepEqual([a, st], [
        t2,
        {
          listeners: { 'test-state': [t], 'second-state': [t2] }
        }
      ])
      return [a, st]
    })
  })

  it('should add listeners on any event using \'onAny\'', () => {
    const t = sinon.spy()
    const t2 = sinon.spy()
    const setup = events.onAny(t, State.of({ anyListeners: [] }))
    const subject = events.onAny(t2, setup)
    subject.map(([a, st]) => {
      assert.deepEqual([a, st], [
        t2,
        {
          anyListeners: [t, t2]
        }
      ])
      return [a, st]
    })
  })

  it('should emit any onAny events', () => {
    const t = sinon.spy()
    const t2 = sinon.spy()
    const t3 = sinon.spy()
    const setup = events.onAny(t, State.of({ listeners: {}, anyListeners: [] }))
    const withOn = events.on('not-to-run', t3, setup)
    const subject = events.onAny(t2, withOn)

    events.emit('my-test-event', subject)
    assert(t.called)
    assert(t2.called)
    assert(!t3.called)
    assert.deepEqual(t.getCall(0).args, [
      [t2, { listeners: { 'not-to-run': [t3] }, anyListeners: [t, t2] }]
    ])
    assert.deepEqual(t2.getCall(0).args, [
      [t2, { listeners: { 'not-to-run': [t3] }, anyListeners: [t, t2] }]
    ])
  })

  it('should remove listeners', () => {
    const t = sinon.spy(id)
    const f = sinon.spy(id)
    const subject = State.of({
      listeners: {
        'run-me': [t, f]
      }
    })

    const test = events.remove('run-me', t, subject)
    test.map(([v, st]) => {
      assert.equal(v, t)
      assert.deepEqual(st, {
        listeners: {
          'run-me': [f]
        }
      })
    })
  })

  it('should emit events to registered listeners', () => {
    const t = sinon.spy(id)
    const f = sinon.spy(id)
    const subject = State.of({
      listeners: {
        'run-me': [t],
        'not-me': [f]
      }
    })

    const state = events.emit('run-me', subject.map(([_, st]) => ['test-action', st]))
    assert(t.called)
    assert.deepEqual(t.getCall(0).args, [[
      'test-action', {
        listeners: {
          'run-me': [t],
          'not-me': [f]
        }
      }
    ]])
    assert(!f.called)

    state.map(([v, st]) => {
      assert.equal(v, 'test-action')
      assert.deepEqual(st, {
        listeners: {
          'run-me': [t],
          'not-me': [f]
        }
      })
      return [v, st]
    })
  })
})
