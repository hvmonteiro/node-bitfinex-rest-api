var BitFinEx = require(".");

var options = {
    events: false,
    refresh: 5, // Refresh time in seconds (Default: 60)
    convert: "USD" // Convert price to different currencies. (Default USD)
};

var bitfinex = new BitFinEx(options);


bitfinex.getPlatformStatus(platformStatus => {
    console.log('\n\nBitFinex platform status: \n');
    console.log(platformStatus);
});
/*
bitfinex.getAvailableSymbolPairs(symbolPairs => {
  console.log('\n\nBitFinex available symbol pairs (currency: %s): \n', options.convert);
  console.log(symbolPairs);
});

bitfinex.getAvailableSymbols(symbols => {
    console.log('\n\nBitFinex available symbols: \n');
    console.log(symbols);
});

var topNum = 5;
bitfinex.getTopSymbols(topNum, symbols => {
  console.log('\n\nBitFinex top %s symbols: \n', topNum);
  console.log(symbols);
});

bitfinex.getTicker('btc', ticker => {
    console.log('\n\nBitcoin ticker info (currency: %s): \n', options.convert);
  console.log(ticker);
});

bitfinex.getTickers('btc,eth,ltc', ticker => {
    console.log('\n\nBitcoin tickers info (currency: %s): \n', options.convert);
  console.log(ticker);
});

bitfinex.getAllTickers(tickers => {
      console.log('\n\nBitFinex all tickers: \n');
      console.log(tickers);
});

bitfinex.getSymbolStats('btc', symbol => {
    console.log('\n\nBitcoin stats (currency: %s): \n', options.convert);
  console.log(symbol);
});
*/
bitfinex.getAllSymbolStats(symbol => {
    console.log('\n\nBitcoin stats (currency: %s): \n', options.convert);
  console.log(symbol);
});
/*
bitfinex.getSymbolRecentTrades('btc', symbol => {
    console.log('\n\nBitcoin recent trades (currency: %s): \n', options.convert);
  console.log(symbol);
});

bitfinex.getSymbolOrderBook('btc', book => {
    console.log('\n\nBitcoin order book (currency: %s): \n', options.convert);
  console.log(book);
});
*/

