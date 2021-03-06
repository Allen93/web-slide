define(['simple/basic', 'utils/makeGetUrl'], function (Basic, makeGetUrl) {
  return Basic.extend({
    _loadData: function (url, method, data) {
      var self = this,
        result,
        http_request;
      if (window.XMLHttpRequest) {
        http_request = new XMLHttpRequest();
      } else if (window.ActiveXObject) {
        // IE 
        try {
          http_request = new ActiveXObject("Msxml2.XMLHTTP");
        } catch (e) {
          try {
            http_request = new ActiveXObject("Microsoft.XMLHTTP");
          } catch (e) {
            alert("您的浏览器不支持Ajax");
            return false;
          }
        }
      }
      return new Promise(function (resolve, reject) {
        http_request.open(method, url, true);
        if (method === 'POST') {
          http_request.setRequestHeader("Content-type", "application/json;charset=UTF-8");
        }
        http_request.send(data);
        http_request.onreadystatechange = function () {
          if (http_request.readyState == 4) {
            if (http_request.status == 200) {
              result = JSON.parse(http_request.responseText);
              resolve(result);
            } else {
              reject('There was a problem with the request.');
            }
          }
        };
      });
    },
    _loadFromLocal: function (url) {
      return localStorage.getItem('data:' + url || '');
    },
    _load: function (options) {
      var url = (options && options.url) || this.url,
        data = (options && options.data) || {},
        self = this;
      finalUrl = makeGetUrl(url, data);
      return this._loadData(finalUrl, 'GET', null).then(function (data) {
        var result = data.result;
        if(data.status === 1){
          self.data = result;
          return Promise.resolve({
            from: 'remote',
            data: result
          });
        } else {
          return Promise.reject(result)
        }
      }, function (e) {
        var data;
        if (self.cache) {
          data = JSON.parse(self._loadFromLocal(url) || null);
          if (data) {
            return Promise.resolve({
              from: 'local',
              data: data
            });
          }
        }
        return Promise.reject(e);
      });
    },
    _update: function (options) {
      var data = JSON.stringify(options.data),
        url = (options && options.url) || this.url;
      if (this.cache) {
        localStorage.setItem('data:' + url, data);
      }
      return this._loadData(url, 'POST', data).then(function (data) {
        if(data.status === 1){
          return Promise.resolve({
            data: data.result
          });
        } else {
          return Promise.reject(data.result)
        }
      }, function (e) {
        return Promise.reject(e);
      });
    }
  });
});