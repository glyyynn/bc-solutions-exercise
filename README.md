# bc-solutions-exercise

BigCommerce mircoservice for comparing product zip codes to customer zip codes. Only whitelisted for 'https://www.google.com' and 'https://shaman.com'.

Only requires a CID - BigCommerce Customer ID value, and a PID - a product ID value.

Example:
``` javascript
const customerID = 15;
const productID = 153;
const endpoint = `https://us-central1-bc-transistor.cloudfunctions.net/app?CID=${customerID}&PID=${productID}`;

fetch(endpoint).then(response => response.json())
  .then(data => console.log(data));
```
