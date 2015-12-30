proxyquire = require('proxyquire')
sinon = require('sinon')

mock = (id) ->
  (config, callback) ->
    mock.fn[id] = sinon.spy callback
    mock.fn[id].config = config
    mock.fn[id]()

describe 'Standalone runner', ->
  beforeEach ->
    mock.fn = {}

  describe 'Pre validations', ->
    runner = require('../lib')

    it 'should fail without arguments', ->
      expect(runner).toThrow('invalid undefined directory')
      expect(-> runner(->)).toThrow('invalid undefined directory')
      expect(-> runner(null, ->)).toThrow('invalid undefined directory')

    it 'should fail on invalid src-directory', ->
      expect(-> runner(null, src: 'not_exists')).toThrow('invalid "not_exists" directory')

  describe 'Callback dependencies', ->
    runner = proxyquire '../lib',
      fs:
        existsSync: -> true
        statSync: ->
          isDirectory: -> true
      y2nw: mock('y2nw')
      nwrun: mock('nwrun')

    beforeEach (done) ->
      config =
        src: 'some/path'
        dest: 'testing_only'

      runner null, config, -> done()

    it 'should callback to y2nw()', ->
      expect(mock.fn.y2nw.callCount).toBe 1

    it 'should callback to nwrun()', ->
      expect(mock.fn.nwrun.callCount).toBe 1

    it 'should callback to nwrun() with fixed options', ->
      expect(mock.fn.nwrun.config.src_folders).toBe 'testing_only/tests'
