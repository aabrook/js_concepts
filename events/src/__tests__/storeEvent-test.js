const { before, beforeEach, describe, it } = require('mocha')
const assert = require('assert')
const sinon = require('sinon')
const subject = require('../')
const Sequelize = require('sequelize')

const setupSequelize = () => new Sequelize('events', null, null, {
  dialect: 'sqlite',
  storage: 'events/db/store/test/events.db',
  logging: () => {}
})

describe('event store', () => {
  let sequelize
  before(() => {
    sequelize = setupSequelize()
  })

  beforeEach(() => {
    const { models: { Event } } = subject({ sequelize })
    Event.destroy({ where: {} })
  })

  it('should persist events', () => {
    const { storeEvent, models: { Event } } = subject({ sequelize })

    return storeEvent({
      event: { type: 'justSaveThis' },
      aggregate: 'testSave'
    }).then(saved => {
      return Event.findAll().then(evs => {
        assert.deepEqual(
          evs.map(ev => JSON.parse(ev.dataValues.event)),
          [{ type: 'justSaveThis' }]
        )
      })
    })
  })

  it('should return all events saved', () => {
    const { storeEvent, allEvents } = subject({ sequelize })

    return storeEvent({
      event: { type: 'justSaveThis' },
      aggregate: 'testSave'
    }).then(saved => (
      storeEvent({
        event: { type: 'andSaveThis' },
        aggregate: 'testSave'
      })
    )).then(saved => {
      return allEvents().then(evs => {
        assert.deepEqual(
          evs.map(ev => JSON.parse(ev.dataValues.event)),
          [
            { type: 'justSaveThis' },
            { type: 'andSaveThis' }
          ]
        )
      })
    })
  })

  describe('projections', () => {
    it('should return the results of all listeners', () => {
      const projection = sinon.spy((event) => event.concat('proj'))
      const secondProjection = sinon.spy((event) => event.concat('second'))

      const { on, emit } = subject({ sequelize })
      on('test_event', projection)
      on('test_event', secondProjection)

      assert.deepEqual(emit('test_event', 'we_in_there'), ['we_in_thereproj', 'we_in_theresecond'])
      assert(projection.called)
      assert(secondProjection.called)
    })

    it('should call the onAny listener with each emitted event', () => {
      const projection = sinon.spy()

      const { onAny, emit } = subject({ sequelize })
      onAny(projection)
      emit('yeah', 'we have an event', 'id')
      emit('again', 'we have a second event', 'next_id')

      assert(projection.calledTwice)
      assert.deepEqual(projection.getCall(0).args, ['yeah', 'we have an event', 'id'])
      assert.deepEqual(projection.getCall(1).args, ['again', 'we have a second event', 'next_id'])
    })

    it('should return singular events onAny from emitter', () => {
      const projection = sinon.spy((event) => event.concat('proj'))
      const secondProjection = sinon.spy((type, event) => type.concat(event).concat('second'))

      const { on, onAny, emit } = subject({ sequelize })
      on('test_event', projection)
      onAny(secondProjection)

      console.log(emit('test_event', 'we_in_there'))
      assert.deepEqual(emit('test_event', 'we_in_there'), ['we_in_thereproj', 'test_eventwe_in_theresecond'])
      assert(projection.called)
      assert(secondProjection.called)
    })

    it('should remove listeners from an event', () => {
      const projection = sinon.spy((event) => event.concat('proj'))
      const secondProjection = sinon.spy((type, event) => type.concat(event).concat('second'))

      const { on, onAny, emit, remove } = subject({ sequelize })
      on('test_event', projection)
      onAny(secondProjection)
      remove('test_event', projection)
      emit('test_event', 'should_not_happen')

      assert(!projection.called)
      assert(secondProjection.called)
    })

    it('should remove listeners from onAny event', () => {
      const projection = sinon.spy((event) => event.concat('proj'))
      const secondProjection = sinon.spy((type, event) => type.concat(event).concat('second'))

      const { on, onAny, emit, removeAny } = subject({ sequelize })
      on('test_event', projection)
      onAny(secondProjection)
      removeAny(secondProjection)
      emit('test_event', 'should_not_happen')

      assert(projection.called)
      assert(!secondProjection.called)
    })
  })
})
