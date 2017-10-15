import verify_email from '.'
import { mount } from 'avoriaz'
import { nextTick } from 'vue'
import email_preferences_fixture from 'fixtures/email_preferences'
import users_fixture from 'fixtures/users'
import sinon from 'sinon'
import Toaster from 'lib/toaster'
import Vuex from 'vuex'

describe 'verify-email', ->
  beforeEach ->
    sinon.stub Toaster, 'create'
    @mutations =
      set_email_preferences: sinon.spy()
      set_user: (state, user) -> state.user = user
    @store = new Vuex.Store
      state: {}
      mutations: @mutations

  afterEach ->
    Toaster.create.restore()

  it 'should render element', ->
    wrapper = mount verify_email, store: @store, globals:
      $route:
        path: '/passwordResets/complete'
        query: (verificationCode: 'apples')
    expect(wrapper.vm.verificationCode).to.eql 'apples'
    nextTick().then ->
      code_input = wrapper.first 'input[name=verificationCode]'
      expect(code_input.element.value).to.eql 'apples'

  describe 'loading state', ->
    beforeEach ->
      @wrapper = mount verify_email
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
      @router =
        query: ''
        push: sinon.spy()
      @wrapper = mount verify_email, store: @store, globals:
        $router: @router
      @fill_in(@wrapper.first('input[name=verificationCode]')).with 'blep'
      @wrapper.first('form').trigger 'submit'

    it 'should submit', ->
      expect(@fetches.first).to.include
        url: '/api/users/me/emailPreferences'
        method: 'PATCH'
      expect(@fetches.first.headers).to.eql
        Accept: 'application/json'
        'Content-Type': 'application/json'
      expect(@fetches.first.body).to.eql
        action: 'verify'
        verificationCode: 'blep'
    
    it 'should set loading state', ->
      expect(@wrapper.vm.loading).to.be.true

    describe 'on success', ->
      respond = ->
        beforeEach (done) ->
          @fetches.first.respond_with
            body:
              ok: true
              record: email_preferences_fixture.verified
          setImmediate done
      
      describe 'when logged in', ->
        beforeEach ->
          @store.commit 'set_user', users_fixture.austin
          nextTick()
        
        respond()

        it 'should turn off loading state', ->
          expect(@wrapper.vm.loading).to.be.false

        it 'should create toast', ->
          message = 'Thanks for verifying your email.'
          expect(Toaster.create).to.have.been
            .calledWith 'success', message, 'Success!'

        it 'should redirect to dashboard', ->
          expect(@router.push).to.have.been.calledWith '/dashboard'

      describe 'when not logged in', ->
        respond()

        it 'should turn off loading state', ->
          expect(@wrapper.vm.loading).to.be.false

        it 'should redirect to login', ->
          expect(@router.push).to.have.been.calledWith '/'

        it 'should create toast', ->
          message = 'Thanks for verifying your email. Please log in now.'
          expect(Toaster.create).to.have.been
            .calledWith 'success', message, 'Success!'

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
            errors: [( code: 'BAD_CODE' )]
        setImmediate done

      it 'should turn off loading state', ->
        expect(@wrapper.vm.loading).to.be.false

      it 'should create toast', ->
        expect(Toaster.create).to.have.been
          .calledWith 'danger', 'This link is invalid or has expired.'
