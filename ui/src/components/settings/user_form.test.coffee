import user_form from './user_form'
import { mount } from 'avoriaz'
import Vue, { nextTick } from 'vue'
import Vuex from 'vuex'
import sinon from 'sinon'
import users_fixture from 'fixtures/users'
import email_preferences_fixture from 'fixtures/email_preferences'
import Toaster from 'lib/toaster'

Vue.use Vuex

describe 'user-form', ->
  beforeEach ->
    sinon.stub Toaster, 'create'
    @mutations =
      set_user: sinon.spy()
    @store = new Vuex.Store
      state: {}
      mutations: @mutations

  afterEach ->
    Toaster.create.restore()

  form_submission_on_success = ->
    describe 'on success', ->
      beforeEach (done) ->
        @new_user = Object.assign {}, users_fixture.austin, username: 'jeffrey'
        @fetches.first.respond_with
          body:
            ok: true
            user: @new_user
        setImmediate done

      it 'should commit to store', ->
        set_user = @mutations.set_user
        expect(set_user).to.have.been.calledWith sinon.match.object, @new_user

      it 'should create toast', ->
        expect Toaster.create
          .to.have.been.calledWith 'success', 'You’ve been updated.', 'Great!'

      it 'should clear loading state', ->
        expect(@wrapper.vm.loading).to.be.false

  form_submission_on_server_error = ->
    describe 'on server error', ->
      beforeEach (done) ->
        @fetches.first.respond_with
          body:
            ok: false
        setImmediate done

      it 'should not commit to store', ->
        expect(@mutations.set_user).to.not.have.been.called

      it 'should create toast', ->
        expect(Toaster.create).to.have.been
          .calledWith 'danger', 'Please try again later.', 'Server Error!'

      it 'should clear loading state', ->
        expect(@wrapper.vm.loading).to.be.false

  form_submission_on_client_error = ->
    describe 'on client error', ->
      beforeEach (done) ->
        @fetches.first.respond_with
          body:
            ok: false
            errors: [( code: 'WRONG_PASSWORD' )]
        setImmediate done

      it 'should not commit to store', ->
        expect(@mutations.set_user).to.not.have.been.called

      it 'should create toast', ->
        expect(Toaster.create).to.have.been
          .calledWith 'warn', 'The current password wasn’t correct.'

      it 'should clear loading state', ->
        expect(@wrapper.vm.loading).to.be.false

  describe 'loading state', ->
    beforeEach ->
      @wrapper = mount user_form, store: @store, propsData:
        user: users_fixture.austin
        email_preferences: email_preferences_fixture.verified
      @wrapper.vm.loading = true
      nextTick()

    it 'should disable inputs', ->
      @wrapper.find('input').forEach (input) ->
        expect(input.element.getAttribute('disabled')).to.eql 'disabled'
      @wrapper.find('button').forEach (input) ->
        expect(input.element.getAttribute('disabled')).to.eql 'disabled'

  describe 'behavior', ->
    beforeEach ->
      @wrapper = mount user_form, store: @store, propsData:
        user: users_fixture.austin
        email_preferences: email_preferences_fixture.verified

    describe 'setting username', ->
      beforeEach ->
        input_username = @wrapper.first 'input[name=username]'
        @fill_in(input_username).with 'jeffrey'
        expect(@wrapper.vm.username).to.eql 'jeffrey'
        @wrapper.first('form').trigger 'submit'

      it 'should be in loading state', ->
        expect(@wrapper.vm.loading).to.be.true

      it 'should update record', ->
        expect(@fetches.first).to.include
          method: 'PUT'
          url: '/api/users/me'
          credentials: 'same-origin'
        expect(@fetches.first.body).to.eql
          email: 'austin@makes.audio'
          username: 'jeffrey'

      form_submission_on_success()
      form_submission_on_server_error()
      form_submission_on_client_error()

    describe 'setting email', ->
      beforeEach ->
        input_email = @wrapper.first 'input[name=email]'
        @fill_in(input_email).with 'austin@bakes.audio'
        expect(@wrapper.vm.email).to.eql 'austin@bakes.audio'
        @wrapper.first('form').trigger 'submit'

      it 'should be in loading state', ->
        expect(@wrapper.vm.loading).to.be.true

      it 'should update record', ->
        expect(@fetches.first).to.include
          method: 'PUT'
          url: '/api/users/me'
          credentials: 'same-origin'
        expect(@fetches.first.body).to.eql
          email: 'austin@bakes.audio'
          username: 'austin'

      form_submission_on_success()
      form_submission_on_server_error()
      form_submission_on_client_error()

    describe 'setting password', ->
      beforeEach ->
        input_password = @wrapper.first 'input[name=password]'
        @fill_in(input_password).with 'donkey7'
        input_password = @wrapper.first 'input[name=currentPassword]'
        @fill_in(input_password).with 'apple'

        expect(@wrapper.vm.password).to.eql 'donkey7'
        expect(@wrapper.vm.currentPassword).to.eql 'apple'

        @wrapper.find('form')[1].trigger 'submit'

      it 'should be in loading state', ->
        expect(@wrapper.vm.loading).to.be.true

      it 'should update record', ->
        expect(@fetches.first).to.include
          method: 'PUT'
          url: '/api/users/me'
          credentials: 'same-origin'
        expect(@fetches.first.body).to.eql
          password: 'donkey7'
          currentPassword: 'apple'

      describe 'on success', ->
        beforeEach (done) ->
          @fetches.first.respond_with
            body:
              ok: true
          setImmediate done

        it 'should create toast', ->
          expect(Toaster.create).to.have.been.calledWith 'success', 'Done!'

        it 'should clear loading state', ->
          expect(@wrapper.vm.loading).to.be.false

        it 'should reset inputs', ->
          expect(@wrapper.find('input[type=password]')[0].value()).to.be.false
          expect(@wrapper.find('input[type=password]')[1].value()).to.be.false

      form_submission_on_server_error()
      form_submission_on_client_error()

  describe 'resending verification email', ->
    describe 'when already verified', ->
      beforeEach ->
        @wrapper = mount user_form, store: @store, propsData:
          user: users_fixture.austin
          email_preferences: email_preferences_fixture.verified

      it 'should not show link', ->
        expect(@wrapper.contains('.verify-email-warning a')).to.be.false

    describe 'when not verified', ->
      beforeEach ->
        @wrapper = mount user_form, store: @store, propsData:
          user: users_fixture.austin
          email_preferences: email_preferences_fixture.not_verified

      it 'should show link', ->
        expect(@wrapper.contains('.verify-email-warning a')).to.be.true

      describe 'clicking `resend`', ->
        beforeEach ->
          @wrapper.first('.verify-email-warning a').trigger 'click'

        it 'should set loading state', ->
          expect(@wrapper.vm.loading).to.be.true

        it 'should make request', ->
          expect(@fetches.first).to.include
            url: '/api/users/me/emailPreferences/sendVerificationEmail'
            method: 'POST'
            credentials: 'same-origin'

        describe 'on success', ->
          beforeEach (done) ->
            @fetches.first.respond_with
              body:
                ok: true
            setImmediate done

          it 'should clear loading state', ->
            expect(@wrapper.vm.loading).to.be.false

          it 'should create toast', ->
            message = 'Please check your email for a verification link.'
            expect(Toaster.create).to.have.been.calledWith 'success', message

        describe 'on error', ->
          beforeEach (done) ->
            @fetches.first.respond_with
              body:
                ok: false
            setImmediate done

          it 'should clear loading state', ->
            expect(@wrapper.vm.loading).to.be.false

          it 'should create toast', ->
            message = 'Something went wrong.'
            expect(Toaster.create).to.have.been.calledWith 'danger', message
