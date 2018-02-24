'use strict'; // jshint ignore:line

// jshint esversion: 6
/* globals require: true, __dirname: true, process: true, console: true, module: true */


var BitFinexAPI = require(".");

var options = {
	events: true,
	refresh: 60, // Refresh time in seconds (Default: 60)
	convert: "EUR" // Convert price to different currencies. (Default USD)
};
var bitfinex = new BitFinexAPI(options); 

// Put event for price greater or equal than X
bitfinex.onPriceGreater("BTC", 4000, (symbol, event) => {
	console.log("BTC price is greater than 4000 of your defined currency");
	event.price = event.price + 100; // Increase the price that the event needs to be fired.
});

/*
bitfinex.onPriceLesser("BTC", 3000, (symbol, event) => {
	console.log("BTC price is lesser than 3000 of your defined currency");
	event.price = event.price - 100; // Decrease the price that the event needs to be fired.
});
*/
/*
// Put event for percent change. You can define negative and positive percent changes.
bitfinex.onPricePercentChange7d("ETH", 15, (symbol, event) => {
	console.log("BTC has a percent change above 15% in the last 7 days");
	event.percent = event.percent + 5; // Increase the percentile change that the event needs to be fired.
});
*/
/*
bitfinex.onPricePercentChange24h("ETH", -10, (symbol, event) => {
	console.log("BTC has a percent change beyond -10% in the last 24h");
	event.percent = event.percent - 5; // Decrease the percentile change that the event needs to be fired.
});
*/
/*
bitfinex.onPricePercentChange1h("LTC", 10, (symbol, event) => {
	console.log(symbol);
	bitfinex.deleteEvent(event); // Deletes the event
});
*/
/*
// Put event on BTC with no conditions. It will trigger every 60 seconds (*) with information about that symbol (*: Or the defined time in options)
bitfinex.on("BTC", (symbol, event) => {
	console.log(symbol);
	bitfinex.deleteEvent(event); // Deletes the event
});
*/
