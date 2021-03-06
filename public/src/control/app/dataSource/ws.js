define(['simple/websocket', 'utils/util/lang'], function (Websocket, _) {
  function converTotMsg(arr) {
    if (_.isArray(arr)) return arr.join('#');
  }
  return Websocket.extend({
    events: {
      'verifySuccess': 'onVerifySuccess',
      'play': 'onPlay',
      'join': 'onRemoteMemberChange',
      'left': 'onRemoteMemberChange'
    },
    data: {
      status: 'unlink',
      controlPic: '',
      connectCode: '',
      onlineNum: 1,
    },
    verify: function (id, pw) {
      var self = this;
      if (this.ws) {
        pw = pw || 'free';
        this.send(converTotMsg(['verify', id, pw]));
      }
      return this.connection.then(function () {
        return new Promise(function (resolve, reject) {
          self.once('controlWS:verifySuccess', function (data) {
            resolve(data);
          });
        });
      });
    },
    changeSlide: function (num) {
      this.send(converTotMsg(['play', num]));
    },
    onVerifySuccess: function (data) {
      var num = parseInt(data);
      this.emit('controlWS:verifySuccess', num);
    },
    onPlay: function (data) {
      var num = parseInt(data);
      this.emit('remote:changeSlide', num);
    },
    onRemoteMemberChange: function (data) {
      var num = parseInt(data);
      this.data.onlineNum = num;
    },
    close: function () {
      Websocket.prototype.close.apply(this, arguments);
      this.data.onlineNum = 1;
      this.data.status = 'unlink'
    }
  });
});