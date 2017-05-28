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
    it('should project after events have been saved', () => {
      const projection = sinon.spy((event) => Promise.resolve(event))
      const secondProjection = sinon.spy((event) => Promise.resolve(event))

      const { storeEvent } = subject({ sequelize, projections: { projection, secondProjection } })
      return storeEvent({
        event: { type: 'lols' },
        aggregate: 'testSave',
        waitForProjection: true
      }).then((projections) => {
        assert(projection.called)
        assert.deepEqual(projection.getCall(0).args[0], { type: 'lols' })
        assert(secondProjection.called)
        assert.deepEqual(secondProjection.getCall(0).args[0], { type: 'lols' })

        return projections
      })
    })

    it('should return immediately after saving when "waitForProjection" is false ' +
      'but the projection will still run', (done) => {
      const projection = sinon.spy((event) => Promise.resolve(event))
      const secondProjection = sinon.spy((event) => Promise.resolve(event))

      const { storeEvent } = subject({ sequelize, projections: { projection, secondProjection } })
      storeEvent({
        event: { type: 'lols' },
        aggregate: 'testSave',
        waitForProjection: false
      }).then((saved) => {
        setTimeout(() => {
          assert(projection.called)
          assert.deepEqual(projection.getCall(0).args[0], { type: 'lols' })
          assert(secondProjection.called)
          assert.deepEqual(secondProjection.getCall(0).args[0], { type: 'lols' })
          done()
        }, 10)

        assert.deepEqual(saved.dataValues.event, { type: 'lols' })
      }).catch(done)
    })

    it('should return immediately after saving when "waitForProjection" is not present ' +
      'but the projection will still run', (done) => {
      const projection = sinon.spy((event) => Promise.resolve(event))
      const secondProjection = sinon.spy((event) => Promise.resolve(event))

      const { storeEvent } = subject({ sequelize, projections: { projection, secondProjection } })
      storeEvent({
        event: { type: 'lols' },
        aggregate: 'testSave'
      }).then((saved) => {
        setTimeout(() => {
          assert(projection.called)
          assert.deepEqual(projection.getCall(0).args[0], { type: 'lols' })
          assert(secondProjection.called)
          assert.deepEqual(secondProjection.getCall(0).args[0], { type: 'lols' })
          done()
        }, 10)

        assert.deepEqual(saved.dataValues.event, { type: 'lols' })
      }).catch(done)
    })
  })
})
