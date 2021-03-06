define(['simple/view', 'tpl!app/template/control.tpl'], function (View, tpl) {
  return View.extend({
    init: function (options) {
      View.prototype.init.apply(this, arguments);
      this.ws = options.websocket;
      this.id = '0';
    },
    template: tpl,
    el: '#left',
    data: {
      slideData: {},
      remote: {},
    },
    behaviorHandlers: {
      'fullScreenPlay': 'onFullScreenPlay',
      'changeSlide': 'onChangeSlide',
      'remoteConnect': 'onRemoteConnect',
      'remoteUnConnect': 'onRemoteUnConnect',
      'addNewSlides': 'onAddNewSlides',
      'saveSlide': 'onSaveSlide',
      'onAdd': 'onAddPage',
      'addPage': 'onAddPage',
      'delPage': 'onDelPage',
      'upPage': 'onUpPage',
      'downPage': 'onDownPage'
    },
    eventHandlers: {
      'exitPlaySlide': 'onExitPlaySlide',
      'remote:changeSlide': 'onRemoteChangeSlide',
    },
    onFullScreenPlay: function () {
      this.syncPlaying = true;
      this.emit('playSlide');
    },
    onExitPlaySlide: function () {
      this.syncPlaying = false;
    },
    onRemoteChangeSlide: function (num) {
      if (this.syncPlaying) {
        this.onChangeSlide(num);
      }
    },
    onChangeSlide: function (n) {
      this.emit('changeSlide', n);
    },
    onAddNewSlides: function(){
      this.ds.addNewSlide();
    },
    onSaveSlide: function () {
      this.ds.update({
        id: this.id,
        data: this.data.slideData
      });
    },
    onAddPage: function () {
      this.ds.addPage();
      var slideData = this.data.slideData
      slideData.currentPage = slideData.pages.length - 1;
    },
    onDelPage: function () {
      this.ds.delPage();
    },
    onUpPage: function () {
      var currentPage = this.data.slideData.currentPage;
      this.ds.exchangePage(currentPage, currentPage - 1);
      this.emit('changeSlide', currentPage - 1);
    },
    onDownPage: function () {
      var currentPage = this.data.slideData.currentPage;
      this.ds.exchangePage(currentPage, currentPage + 1);
      this.emit('changeSlide', currentPage + 1);
    },
    onRemoteConnect: function () {
      var self = this,
        ws = this.ws;
      ws.connect().then(function () {
        return ws.verify(self.id, self.data.connectCode);
      }).then(function (data) {});
    },
    onRemoteUnConnect: function () {
      this.data.status = 'unlink';
      this.ws.close();
    },
    onKeyDown: function (e) {
      key = e.keyCode;
      if (key === 39 || key === 40) {
        if (this.syncPlaying) {}
        this.emit('changeSlide', this.data.slideData.currentPage + 1);
      }
      if (key === 37 || key === 38) {
        this.emit('changeSlide', this.data.slideData.currentPage - 1);
      }
    },
    startControl: function () {
      var self = this;
      this.data.remote = this.ws.data;
      this.ds.load({
        id: this.id
      }).then(function (result) {
        self.data.slideData = result.data;
        self.data.connectCode = '';
        self.emit('getData', result.data);
      });
      document.addEventListener('keydown', function (e) {
        self.onKeyDown(e);
      });
    }
  });
})