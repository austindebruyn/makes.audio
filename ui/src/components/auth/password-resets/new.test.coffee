import new_password_reset from './new'
import { mount, shallow } from 'avoriaz'
import { nextTick } from 'vue'
import users_fixture from 'fixtures/users'
import sinon from 'sinon'
import Toaster from 'lib/toaster'
import Vuex from 'vuex'

describe 'new-password-reset', ->
  beforeEach ->
    sinon.stub Toaster, 'create'
    @mutations =
      set_user: sinon.spy()
    @store = new Vuex.Store
      state: {}
      mutations: @mutations

  afterEach ->
    Toaster.create.restore()

  describe 'loading state', ->
    beforeEach ->
      @wrapper = mount new_password_reset
      @wrapper.setData loading: true
      nextTick()
    
    it 'disabled all inputs', ->
      @wrapper.find('input').forEach (input) ->
        expect(input.element.getAttribute('disabled')).to.eql 'disabled'
      @wrapper.find('button').forEach (input) ->
        expect(input.element.getAttribute('disabled')).to.eql 'disabled'
      @wrapper.find('a').forEach (input) ->
        expect(input.element.getAttribute('disabled')).to.eql 'disabled'

  describe 'form submission', ->
    beforeEach ->
      @router =
        push: sinon.spy()
      @wrapper = mount new_password_reset, store: @store, globals:
        $router: @router
      @fill_in(@wrapper.first('input[name=email]')).with 'austin@justin.com'
      @wrapper.first('form').trigger 'submit'

    it 'should submit', ->
      expect(@fetches.first).to.include
        url: '/api/passwordResets'
        method: 'POST'
      expect(@fetches.first.headers).to.eql
        Accept: 'application/json'
        'Content-Type': 'application/json'
      expect(@fetches.first.body).to.eql
        email: 'austin@justin.com'
    
    it 'should set loading state', ->
      expect(@wrapper.vm.loading).to.be.true

    describe 'on success', ->
      beforeEach (done) ->
        @fetches.first.respond_with
          body:
            ok: true
            user: users_fixture.austin
        setImmediate done

      it 'should turn off loading state', ->
        expect(@wrapper.vm.loading).to.be.false

      it 'should create toast', ->
        message = 'An email has been sent to austin@justin.com.'
        expect(Toaster.create).to.have.been
          .calledWith 'success', message, 'Success!'
      
      it 'should redirect to complete page', ->
        expect(@router.push).to.have.been.calledWith '/passwordResets/complete'

    describe 'on server error', ->
      beforeEach (done) ->
        @fetches.first.respond_with
          body:
            ok: false
        setImmediate done

      it 'should turn off loading state', ->
        expect(@wrapper.vm.loading).to.be.false

      it 'should create toast', ->
        expect(Toaster.create).to.have.been
          .calledWith 'danger', 'Something went wrong!'

    describe 'on client error', ->
      beforeEach (done) ->
        @fetches.first.respond_with
          body:
            ok: false
            errors: [( code: 'MISSING_EMAIL' )]
        setImmediate done

      it 'should turn off loading state', ->
        expect(@wrapper.vm.loading).to.be.false

      it 'should create toast', ->
        expect(Toaster.create).to.have.been
          .calledWith 'danger', 'You didn’t enter an email.'
