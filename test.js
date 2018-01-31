var BitFinEx = require(".");

var options = {
	events: false,
	refresh: 5, // Refresh time in seconds (Default: 60)
	convert: "USD" // Convert price to different currencies. (Default USD)
};

var bitfinex = new BitFinEx(options);

bitfinex.multi(symbols => {
	console.log(symbols);
	console.log(symbols.getTicker("BTC").last_price);
	console.log(symbols.getTicker("ETH").last_price);
});

/*
bitfinex.getAvailableSymbols(symbols =>{
  console.log('\n\nBitFinex all available symbols: \n')
  console.log(symbols);
});


bitfinex.getAvailableSymbolPairs(symbols =>{
  console.log('\n\nBitFinex available symbols (currency: %s): \n', options.convert)
  console.log(symbols);
});


bitfinex.getSymbolStats('btc', symbol => {
	console.log('\n\nBitcoin stats (currency: %s): \n', options.convert)
  console.log(symbol);
});

bitfinex.getSymbolRecentTrades('btc', symbol => {
	console.log('\n\nBitcoin recent trades (currency: %s): \n', options.convert)
  console.log(symbol);
});


bitfinex.getTicker('btc', symbol => {
	console.log('\n\nBitcoin ticker info (currency: %s): \n', options.convert)
  console.log(symbol);
});

bitfinex.getSymbolOrderBook('btc', book => {
	console.log('\n\nBitcoin order book (currency: %s): \n', options.convert)
  console.log(book);
});
*/
