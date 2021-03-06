function setup(app, data) {
  app.get('/', function(req, res) {
    let visitors = 0;
    for (const url of data.urls) {
      visitors += url.visits;
    }
    let model = { urls: data.urls, visitors };
    res.render('home', model);
  });

  app.get('/urls', function(req, res) {
    let urlsForDisplay = data.urls.map(
      url => getUrlForDisplay(req, url));
    let model = { urls: urlsForDisplay };
    res.render('urls', model);
  });

  app.get('/go/:code', function(req, res) {
    let result = data.visitUrl(req.params.code);
    if (! result.errMsg) {
      res.redirect(result.url);
    } else {
      return res.render('error', result);
    }
  });

  app.get('/add-url', function(req, res) {
    let model = { url: "", code: "newCode" };
    res.render('add-url', model);
  });

  app.post('/add-url', function(req, res) {
    let result = data.addUrl(req.body.url, req.body.code);
    if (result.errMsg) {
      let model = {
        url: req.body.url, code: req.body.code,
        errMsg: result.errMsg
      };
      return res.render('add-url', model);
    } else {
      res.redirect('/urls');
    }
  });
}

function getUrlForDisplay(httpReq, url) {
  let serverUrl =
    httpReq.protocol + '://' + httpReq.hostname;
  return {
    url: url.url,
    shortCode: url.shortCode,
    shortUrl: serverUrl + "/go/" + url.shortCode,
    dateCreated: date2text(url.dateCreated),
    visits: url.visits      
  };
}

function date2text(inputDate) {
  let date = inputDate.toISOString().split('.')[0];
  date = date.replace('T', ' ');
  return date;
}

module.exports = { setup };
