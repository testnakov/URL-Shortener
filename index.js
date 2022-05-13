const express = require('express');
const app = express();
app.use(express.static('public'))
app.set('view engine', 'pug');

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended:true}));

const data = require("./data/app-data");
data.seedSampleData();

const mvcController = require(
  "./controllers/mvc-controller");
mvcController.setup(app, data);

let port = process.argv[2];
if (!port) port = process.env['PORT'];
if (!port) port = 8080;

app.listen(port, () => {
  console.log(`App started. Listening at http://localhost:${port}`);
})
.on('error', function(err) {
  if (err.errno === 'EADDRINUSE')
    console.error(`Port ${port} busy.`);
  else 
    throw err;
});
