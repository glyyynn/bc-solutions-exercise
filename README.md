# bc-solutions-exercise

Very small, quick BigCommerce POC example for comparing product zip codes to customer zip codes. Currently this is only whitelisted for 'https://www.google.com' and 'https://shaman.com'. It simply returns a string with one of the following three values based on permutations of current customer addresses and addresses matched to product custom field containing available product zip codes:
```
var first = 'Sorry, none of the addresses on your account are eligible for this product',
    second = `This product is only eligible for one of your addresses on file - the one with zip code XXXXX`,
    third = 'Success'
```

Only requires a CID - BigCommerce Customer ID value, and a PID - a BigCommerce product ID value, both from the same storefront. No authentication currently.

Example:
``` javascript
const customerID = 15;
const productID = 153;
const endpoint = `https://us-central1-bc-transistor.cloudfunctions.net/app?CID=${customerID}&PID=${productID}`;

fetch(endpoint).then(response => response.json())
  .then(data => console.log(data));
```
