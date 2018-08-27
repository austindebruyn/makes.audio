import app_template from './app_template'
import drop_container from 'components/structure/drop_container'
import { mount, shallow } from 'avoriaz'
import Toaster from 'lib/toaster'
import sinon from 'sinon'
import Vuex from 'vuex'

describe 'app_template', ->
  it 'should start with nav closed', ->
    wrapper = shallow app_template
    expect(wrapper.hasClass('nav-open')).to.be.false
    expect(wrapper.vm.nav_open).to.be.false

  it 'should render slots', ->
    wrapper = mount app_template, slots:
      default: (template: '<div id="slot"></div>')
    expect(wrapper.contains('.container > #slot')).to.be.true

  describe 'clicking nav', ->
    beforeEach ->
      @wrapper = mount app_template

      @toggler = @wrapper.first('nav .navbar-toggler')
      @toggler.trigger 'click'

    it 'should open nav', ->
      expect(@wrapper.hasClass('nav-open')).to.be.true
      expect(@wrapper.first('.collapse').hasClass('show')).to.be.true
      expect(@wrapper.vm.nav_open).to.be.true
      expect(@toggler.hasClass('toggled')).to.be.true

    describe 'clicking again', ->
      beforeEach ->
        @toggler.trigger 'click'

      it 'should close nav', ->
        expect(@wrapper.hasClass('nav-open')).to.be.false
        expect(@wrapper.first('.collapse').hasClass('show')).to.be.false
        expect(@wrapper.vm.nav_open).to.be.false
        expect(@toggler.hasClass('toggled')).to.be.false

  describe 'clicking logout', ->
    beforeEach (done) ->
      sinon.stub Toaster, 'create'

      @router =
        push: sinon.spy()
      @mutations =
        set_user: sinon.spy()
      @store = new Vuex.Store
        state: {}
        mutations: @mutations

      @wrapper = mount app_template, store: @store, globals:
        $router: @router
      logout_link = @wrapper.first('nav ul li:last-child a')
      logout_link.trigger 'click'
      setImmediate done

    afterEach ->
      Toaster.create.restore()

    it 'should make request', ->
      expect(@fetches.first).to.include
        url: '/logout'
        method: 'POST'

    describe 'on success', ->
      beforeEach (done) ->
        @fetches.first.respond_with
          status: 200
          body: (ok: true)
        setImmediate done

      it 'should create toast', ->
        expect(Toaster.create).to.have.been
          .calledWith 'info', "You're signed out.", 'Bye!'

      it 'should commit', ->
        expect(@mutations.set_user).to.have.been
          .calledWith sinon.match.object, null

      it 'should redirect', ->
        expect(@router.push).to.have.been.calledWith '/'

    describe 'on error', ->
      beforeEach (done) ->
        @fetches.first.respond_with
          status: 500
          body: (ok: false)
        setImmediate done

      it 'should create toast', ->
        expect(Toaster.create).to.have.been
          .calledWith 'danger', "You weren't signed out."

      it 'should not commit', ->
        expect(@mutations.set_user).to.not.have.been.called

      it 'should not redirect', ->
        expect(@router.push).to.not.have.been.called

  describe 'dragging files over the component', ->
    beforeEach ->
      @wrapper = mount app_template

    it 'should increase counter on dragenter and dragover', ->
      expect(@wrapper.vm.dragging).to.eql(
        counter: 0
        started: false
      )
      expected_result =
        counter: 1
        started: true
      @wrapper.first('div').trigger 'dragenter'
      expect(@wrapper.vm.dragging).to.eql(expected_result)
      @wrapper.first('div').trigger 'dragover'
      expect(@wrapper.vm.dragging).to.eql(expected_result)
    
    it 'should decrease counter on dragleave', ->
      @wrapper.vm.dragging =
        counter: 1
        started: true
      @wrapper.first('div').trigger 'dragleave'
      expect(@wrapper.vm.dragging).to.eql(
        counter: 0
        started: false
      )
