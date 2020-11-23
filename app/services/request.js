const request = require('request');

class RequestService {
  constructor() {
    this.request = request;
  }

  get(url) {
    return new Promise((resolve, reject) => {
      this.request(url, (err, response, body) => {
        if (err) {
          return reject(err);
        } else if (!response || response.statusCode !== 200) {
          const statusErr = new Error(body);
          statusErr.status = (response) ? (response.statusCode || 500) : 500;

          return reject(statusErr);
        }

        return resolve(JSON.parse(body));
      });
    });
  }

  head(url) {
    return new Promise((resolve, reject) => {
      this.request.head(url, (headErr, headResponse) => {
        if (headErr) {
          return reject(headErr);
        } else if (!headResponse) {
          const statusErr = new Error();
          statusErr.status = (headResponse) ? (headResponse.statusCode || 500) : 500;

          return reject(statusErr);
        }

        return resolve(headResponse);
      });
    });
  }

  download(url) {
    return new Promise((resolve, reject) => this.request({
      url,
      encoding: null,
    }, (err, response, body) => {
      if (err) {
        return reject(err);
      } else if (!response || response.statusCode !== 200) {
        const statusErr = new Error(body);
        statusErr.status = (response) ? (response.statusCode || 500) : 500;

        return reject(statusErr);
      }

      return resolve(body);
    }));
  }
}

module.exports = RequestService;
