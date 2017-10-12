import complete_password_reset from './complete'
import { mount, shallow } from 'avoriaz'
import { nextTick } from 'vue'
import users_fixture from 'fixtures/users'
import sinon from 'sinon'
import Toaster from 'lib/toaster'
import Vuex from 'vuex'

describe 'complete-password-reset', ->
  beforeEach ->
    sinon.stub Toaster, 'create'
    @mutations =
      set_user: sinon.spy()
    @store = new Vuex.Store
      state: {}
      mutations: @mutations

  afterEach ->
    Toaster.create.restore()

  it 'should render element', ->
    wrapper = mount complete_password_reset, store: @store, globals:
      $route:
        path: '/passwordResets/complete'
        query: (code: 'apples')
    expect(wrapper.vm.code).to.eql 'apples'
    nextTick().then ->
      expect(wrapper.first('input[name=code]').element.value).to.eql 'apples'

  describe 'loading state', ->
    beforeEach ->
      @wrapper = mount complete_password_reset
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
        query: ''
        push: sinon.spy()
      @wrapper = mount complete_password_reset, store: @store, globals:
        $router: @router
      @fill_in(@wrapper.first('input[name=code]')).with 'ksdjflsadfj'
      @fill_in(@wrapper.first('input[name=password]')).with 'naples2'
      @fill_in(@wrapper.first('input[name=password2]')).with 'naples2'
      @wrapper.first('form').trigger 'submit'

    it 'should submit', ->
      expect(@fetches.first).to.include
        url: '/api/passwordResets/complete'
        method: 'POST'
      expect(@fetches.first.headers).to.eql
        Accept: 'application/json'
        'Content-Type': 'application/json'
      expect(@fetches.first.body).to.eql
        code: 'ksdjflsadfj'
        password: 'naples2'
        password2: 'naples2'
    
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

      it 'should commit', ->
        expect(@mutations.set_user).to.have.been
          .calledWith sinon.match.object, users_fixture.austin

      it 'should create toast', ->
        expect(Toaster.create).to.have.been
          .calledWith 'success', 'Your password has been changed.', 'Success!'
      
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
            errors: [( code: 'MISSING_EMAIL' )]
        setImmediate done

      it 'should turn off loading state', ->
        expect(@wrapper.vm.loading).to.be.false

      it 'should create toast', ->
        expect(Toaster.create).to.have.been
          .calledWith 'danger', 'You didn’t enter an email.'
