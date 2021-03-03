 "firebase-functions/lib/logger";

const functions = require('firebase-functions'),
      admin = require('firebase-admin'),
      express = require('express'),
      cors = require('cors'),
      helmet = require('helmet'),
      morgan = require('morgan'),
      bodyParser = require('body-parser'),
      app = express();

const BigCommerceZipCodeCheckerClass = require('./classes/BigCommerceZipCodeChecker.js');
const ZipCodeChecker = new BigCommerceZipCodeCheckerClass();

admin.initializeApp();

app.use(helmet());
app.use(bodyParser.json());
app.use(morgan('combined'));
var whitelist = ['https://www.google.com', 'https://shaman.cf']
var corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  }
}

app.get('/', cors(corsOptions), async function (req, res) {  
    const customerID = req.query.CID, productID = req.query.PID;
    const eligibilityTextResponse = await ZipCodeChecker.getProductEligibilityForCustomerLocation(customerID, productID);
    const response = JSON.parse(`{ "text": "${eligibilityTextResponse}" }`);
    await res.json(response);
});

exports.app = functions.https.onRequest(app);

