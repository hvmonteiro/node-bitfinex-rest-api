'use strict'; // jshint ignore:line

// jshint esversion: 6
/* globals require: true, __dirname: true, process: true, console: true, module: true */


var BitFinexAPI = require('.');

var options = {
    events: false,
    refresh: 10,     // Refresh time in seconds (Default: 60)
    currency: 'USD'  // Convert price to different currencies. If not set, get trading pair as is. (Default: '')
};

var bitfinex = new BitFinexAPI(options);

// Uncomment each code block below and run 'node example1.js' to get output examples //
//
bitfinex.tradingPairExists('ltcbtc', exists => {
    console.log('"ltcbtc" trading pair: %s', exists);
});

bitfinex.symbolExists('ltc', exists => {
    console.log('"ltc" symbol: %s', exists);
});

/* Tested: Ok */

console.log('\nbitfinex.getPlatformStatus(): ');
bitfinex.getPlatformStatus(platformStatus => {
    console.log('\nBitFinex platform status: \n');
    console.log(platformStatus);
});

/* Tested: Ok */
/*
console.log('\nbitfinex.getSymbols(symbols): ');
bitfinex.getSymbols(symbols => {
    console.log('\nBitFinex symbols: \n');
    console.log(symbols);
});
*/
/* Tested: Ok */
/*
console.log('\nbitfinex.getTradingPairs(): ');
bitfinex.getTradingPairs(TradingPairs => {
    console.log('\nBitFinex  TradingPairs: \n', options.currency);
    console.log(TradingPairs);
});
*/
/* Tested: Ok */
/*
var topNum = 5;
console.log('\nbitfinex.getTopSymbols(%s): ', topNum);
bitfinex.getTopSymbols(topNum, symbols => {
    console.log('\nBitFinex top traded %s symbols: \n', topNum);
    console.log(symbols);
});
*/
/* Tested: Ok */
/*
console.log('\nbitfinex.getTicker("btc"): ');
bitfinex.getTicker('btc', ticker => {
    console.log('\nBitcoin ticker info (currency: %s): \n', options.currency);
    console.log(ticker);
});
*/
/* Tested: Ok */
/*
console.log('\nbitfinex.getTickers("btc,eth,ltc"): ');
bitfinex.getTickers('btc,eth,ltc', ticker => {
    console.log('\nBitcoin tickers info (currency: %s): \n', options.currency);
    console.log(ticker);
});
*/
/* Tested: Ok */
/*
console.log('\nbitfinex.getAllTickers(): ');
bitfinex.getAllTickers(tickers => {
    console.log('\nBitFinex all tickers: \n');
    console.log(tickers);
});
*/
/* Tested: Ok */
/*
console.log('\nbitfinex.getSymbolStats("btc"): ');
bitfinex.getSymbolStats('btc', symbol => {
    console.log('\nBitcoin stats (currency: %s): \n', options.currency);
    console.log(symbol);
});
/*
/* Tested: Ok */
/*
console.log('\nbitfinex.getSymbolRecentTrades("btc"): ');
bitfinex.getSymbolRecentTrades('btc', symbol => {
    console.log('\nBitcoin recent trades (currency: %s): \n', options.currency);
    console.log(symbol);
});
*/
/* Tested: Ok */
/*
console.log('\nbitfinex.getSymbolOrderBook("btc"): ');
bitfinex.getSymbolOrderBook('ltcbtc', book => {
    console.log('\nBitcoin order book (currency: %s): \n', options.currency);
    console.log(book);
});
*/


/*********************************/
/* Requests with no currency set */
/*********************************/

/* Tested: Ok */
/*
bitfinex.currency = '';
console.log('\nbitfinex.getTicker("ltcbtc"): \n');
bitfinex.getTicker('ltcbtc', ticker => {
    console.log('\nBitcoin ticker info (currency: %s): \n', options.currency);
    console.log(ticker);
});
*/
/* Tested: Ok */
/*
bitfinex.currency = '';
console.log('\nbitfinex.getTickers("btceur,ethusd,ltcbtc"): ');
bitfinex.getTickers('btceur,ethusd,ltcbtc', ticker => {
    console.log('\nBitcoin tickers info (currency: %s): \n', options.currency);
    console.log(ticker);
});
*/
/* Tested: Ok */
/*
bitfinex.currency = '';
console.log('\nbitfinex.getAllTickers(): ');
bitfinex.getAllTickers(tickers => {
    console.log('\nBitFinex all tickers: \n');
    console.log(tickers);
});
*/
/* Tested: Ok */
/*
bitfinex.currency = '';
console.log('\nbitfinex.getSymbolStats("ltcbtc"): ');
bitfinex.getSymbolStats('ltcbtc', symbol => {
    console.log('\nBitcoin stats (currency: %s): \n', options.currency);
    console.log(symbol);
});
*/
/* Tested: Ok */
/*
console.log('\nbitfinex.getSymbolRecentTrades("ltcbtc", symbol');
bitfinex.getSymbolRecentTrades('ltcbtc', symbol => {
    console.log('\nBitcoin recent trades (currency: %s): \n', options.currency);
    console.log(symbol);
});
*/
/* Tested: Ok */
/*
bitfinex.currency = '';
console.log('\nbitfinex.getSymbolOrderBook("btc", book)');
bitfinex.getSymbolOrderBook('ltcbtc', book => {
    console.log('\nBitcoin order book (currency: %s): \n', options.currency);
    console.log(book);
});
*/
