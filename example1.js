'use strict'; // jshint ignore:line

// jshint esversion: 6
/* globals require: true, __dirname: true, process: true, console: true, module: true */


var BitFinexAPI = require(".");

var options = {
    events: false,
    refresh: 5, // Refresh time in seconds (Default: 60)
    convert: "USD" // Convert price to different currencies. (Default USD)
};

var bitfinex = new BitFinexAPI(options);

/* Tested: Ok
bitfinex.getPlatformStatus(platformStatus => {
    console.log('\n\nBitFinex platform status: \n');
    console.log(platformStatus);
});
*/
/* Tested: Ok
bitfinex.getSymbols(symbols => {
    console.log('\n\nBitFinex symbols: \n');
    console.log(symbols);
});
*/
/* Tested: Ok
bitfinex.getTradingPairs(TradingPairs => {
  console.log('\n\nBitFinex  TradingPairs (currency: %s): \n', options.convert);
  console.log(TradingPairs);
});
*/
/* Tested: Ok
var topNum = 5;
bitfinex.getTopSymbols(topNum, symbols => {
  console.log('\n\nBitFinex top traded %s symbols: \n', topNum);
  console.log(symbols);
});
*/
/* Tested: Ok
bitfinex.getTicker('btc', ticker => {
    console.log('\n\nBitcoin ticker info (currency: %s): \n', options.convert);
  console.log(ticker);
});
*/

/* Tested: Ok
bitfinex.getTickers('btc,eth,ltc', ticker => {
    console.log('\n\nBitcoin tickers info (currency: %s): \n', options.convert);
  console.log(ticker);
});
*/
/* Tested: Ok
bitfinex.getAllTickers(tickers => {
      console.log('\n\nBitFinex all tickers: \n');
      console.log(tickers);
});
*/
/* Tested: Ok
bitfinex.getSymbolStats('btc', symbol => {
    console.log('\n\nBitcoin stats (currency: %s): \n', options.convert);
  console.log(symbol);
});
*/
/* Tested: Ok
bitfinex.getSymbolRecentTrades('btc', symbol => {
    console.log('\n\nBitcoin recent trades (currency: %s): \n', options.convert);
  console.log(symbol);
});
*/
/* Tested: Ok
bitfinex.getSymbolOrderBook('btc', book => {
    console.log('\n\nBitcoin order book (currency: %s): \n', options.convert);
  console.log(book);
});
*/


