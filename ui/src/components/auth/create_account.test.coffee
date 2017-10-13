import create_account from './create_account'
import { mount } from 'avoriaz'
import { nextTick } from 'vue'
import users_fixture from 'fixtures/users'
import sinon from 'sinon'
import Toaster from 'lib/toaster'
import Vuex from 'vuex'

describe 'create_account', ->
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
      @wrapper = mount create_account
      @wrapper.setData loading: true
      nextTick()
    
    it 'disabled all inputs', ->
      @wrapper.find('input').forEach (input) ->
        return if input.element.getAttribute('type') is 'hidden'
        expect(input.element.getAttribute('disabled')).to.eql 'disabled'
      @wrapper.find('button').forEach (input) ->
        expect(input.element.getAttribute('disabled')).to.eql 'disabled'
      @wrapper.find('a').forEach (input) ->
        expect(input.element.getAttribute('disabled')).to.eql 'disabled'

  describe 'form submission', ->
    beforeEach ->
      @router = (push: sinon.spy())
      @wrapper = mount create_account, store: @store, globals:
        $router: @router
      @fill_in(@wrapper.first('input[name=username]')).with 'austin'
      @fill_in(@wrapper.first('input[name=email]')).with 'ace@jack.com'
      @fill_in(@wrapper.first('input[name=inviteCode]')).with 'cider'
      @fill_in(@wrapper.first('input[name=password]')).with 'money19'
      @fill_in(@wrapper.first('input[name=password2]')).with 'money19'
      @wrapper.first('form').trigger 'submit'

    it 'should set loading state', ->
      expect(@wrapper.vm.loading).to.be.true

    it 'should fetch', ->
      expect(@fetches.first).to.include
        method: 'POST'
        url: '/api/users'
        credentials: 'same-origin'
      expect(@fetches.first.headers).to.eql
        'Accept': 'application/json'
        'Content-Type': 'application/json'
      expect(@fetches.first.body).to.eql
        username: 'austin'
        email: 'ace@jack.com'
        password: 'money19'
        password2: 'money19'
        inviteCode: 'cider'

    describe 'on success', ->
      beforeEach (done) ->
        @fetches.first.respond_with
          status: 200
          body:
            ok: true
            user: users_fixture.austin
        setImmediate done

      it 'should clear loading state', ->
        expect(@wrapper.vm.loading).to.be.false
      
      it 'should commit', ->
        expect(@mutations.set_user).to.have.been
          .calledWith sinon.match.object, users_fixture.austin

      it 'should create toast', ->
        expect(Toaster.create).to.have.been
          .calledWith 'info', 'Welcome austin!'

      it 'should redirect to dashboard', ->
        expect(@router.push).to.have.been.calledWith '/dashboard'

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
            errors: [( code: 'USERNAME_NOT_UNIQUE' )]
        setImmediate done

      it 'should turn off loading state', ->
        expect(@wrapper.vm.loading).to.be.false

      it 'should create toast', ->
        expect(Toaster.create).to.have.been
          .calledWith 'danger', 'That username has been taken.'
