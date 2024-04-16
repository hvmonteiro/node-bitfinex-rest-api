# bitfinex-api-events

A node module to connect to Bitfinex API and retrieve available symbols, ticker info, order books and stats of available cryptocurrencies.
It uses both Bitfinex REST API version 1 and version 2 as both versions return different data.

It supports events to get alerts on several data.

## Installation

```console
$ npm install bitfinex-api-events
```

## Usage Example
```js
var BitFinex = require('node-bitfinex-rest-api');

var options = {
	currency: 'USD' // Get symbol in a specific currency. Ominting this, will require you to specify a trading pair (ex: BTCUSD) instead.
}
var bitfinex = new BitFinex(options);

// If you want to check a single symbol, use getTicker()

bitfinex.getTicker('btc', symbol => {
  console.log(symbol.lastPrice); // Prints the price in USD of BTC at the moment.
});

// If you want to check multiple symbols, use multi():
bitfinex.getTickers('btc,eth,ltc', symbols => {
  console.log(symbols['BTC'].lastPrice); // Prints price of BTC in USD
  console.log(symbols['ETH'].lastPrice); // Print price of ETH in USD
  console.log(symbols['ETH'].lastPrice); // Print price of ETH in BTC
});
```
## Usage Example with Events

```js
var BitFinex = require('node-bitfinex-rest-api');

var options = {
	events: true, // Enable event system
	refresh: 60, // Refresh time in seconds (Default: 60)
	currency: 'USD' // Get symbol in a specific currency. Ominting this, will require you to specify a trading pair (ex: BTCUSD) instead.
}
var bitfinex = new BitFinex(options);

// Trigger this event when BTC price is greater than 4000
bitfinex.onPriceAbove('BTC', 4000, (symbol) => {
	console.log('BTC price is above than 4000 of your defined currency');
});

// Trigger this event when BTC price is less than 50000
bitfinex.onPriceAbove('BTC', 50000, (symbol) => {
	console.log('BTC price is below 50000 of your defined currency');
});
// Trigger this event when BTC percent change is greater than 20
bitfinex.onPricePercentChange24h('BTC', 20, (symbol) => {
	console.log('BTC has a percent change above 20% in the last 24 hours');
});

// Trigger this event every 60 seconds with information about BTC
bitfinex.onTickerUpdate('BTC', (symbol) => {
	console.log(symbol);
});
```
For a full list of examples with simple ticker requests, check: https://github.com/hvmonteiro/bitfinex-api-events/blob/master/example1.js  
  
For a full list of examples with events, check: https://github.com/hvmonteiro/bitfinex-api-events/blob/master/example2.js  


