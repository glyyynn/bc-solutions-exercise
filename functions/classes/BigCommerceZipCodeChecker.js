'use strict'
const functions = require('firebase-functions'),
      fetch = require('node-fetch');

const ACCESS_TOKEN = ''

class ZipCodeChecker {
    constructor() {
    }

    async getProductEligibilityForCustomerLocation(customerID, productID) {
        try {
            const fetchResponse = await this.fetchZipCodesAndAddresses(customerID, productID);

            const [ customerAddressesArray, currentProductZipCodesArray ] = fetchResponse;
            const parsedZipCodeArray = currentProductZipCodesArray.filter((field) => { return field.name === "Valid ZipCodes"})[0].value.split(',');
            
            const { amountOfCustomerAddresses, matchedAddressesArray } = this.matchZipCodesToAddressesArray(customerAddressesArray, parsedZipCodeArray);

            if (matchedAddressesArray.length === 0) return 'Sorry, none of the addresses on your account are eligible for this product';

            if (amountOfCustomerAddresses === 1) {
                if (matchedAddressesArray.length === 1) return 'Success';
            } else if (amountOfCustomerAddresses >= 2) {
                if (matchedAddressesArray.length === 1) { 
                    return `This product is only elibible for one of your addresses on file - the one with zip code ${matchedAddressesArray[0].zip}`;
                } else if (matchedAddressesArray.length >= 2) {
                    return 'Success';
                } else {
                    throw 'Error - no matched arrays with multiple customer addresses';
                }
            } else {
                throw 'Error - no customer addresses returned';
            }
        } catch (e) {
            return e;
        }
    }

    matchZipCodesToAddressesArray(customerAddressesArray, currentProductZipCodeArray) {
        const amountOfCustomerAddresses = customerAddressesArray.length
        const matchedAddressesArray = customerAddressesArray.filter(function(addressObject){
            let currentZip = addressObject['zip'];
            return currentProductZipCodeArray.indexOf(currentZip) > -1;
        });

        return { amountOfCustomerAddresses, matchedAddressesArray };
    }

    async fetchZipCodesAndAddresses(customerID, productID) {
        const [addresses, zipCodes] = await Promise.all([
          this.getCustomerAddressesArray(customerID),
          this.getProductZipCodesArray(productID)
        ]);
        return [addresses, zipCodes.data];
    }

    async getCustomerAddressesArray(customerID) {
        const addresses = await fetch(`https://api.bigcommerce.com/stores/2pys62qxl6/v2/customers/${customerID}/addresses`, {
            method: 'GET',
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
                "X-Auth-Token": ACCESS_TOKEN,
            },
        });
        const parsedAddressesArray = await addresses.json();

        return parsedAddressesArray;
    }

    async getProductZipCodesArray(productID) {
        const productCustomFields = await fetch(`https://api.bigcommerce.com/stores/2pys62qxl6/v3/catalog/products/${productID}/custom-fields`, {
            method: 'GET',
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
                "X-Auth-Token": ACCESS_TOKEN,
            },
        });
        const parsedProductCustomFields = await productCustomFields.json();        

        return parsedProductCustomFields;
    }
}

module.exports = ZipCodeChecker;