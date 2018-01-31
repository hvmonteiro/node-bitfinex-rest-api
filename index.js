var request = require('request');

class BitFinEx {

	constructor(options={}){
		this.API_URL = options.API_URL || "https://api.bitfinex.com/v1";
		this.convert = options.convert || "USD";
		this.convert = this.convert.toLowerCase();
		this.events = options.events || false;
		if(this.events){
			this.refresh = options.refresh*1000 || 60*1000;
			this.events = [];
			this._emitter();
			setInterval(this._emitter.bind(this), this.refresh);
		}
	}

	_getJSON(url, callback) {
		request(this.API_URL+url, (error, response, body) => {
			if(error){
				callback(false);
				return this;
			}
			if(response && response.statusCode == 200){
				callback(JSON.parse(body));
			} else {
				callback(false);
				return this;
			}
		});
	}

	_find(symbols, symbol) {
		return symbols.find(o => o.symbol === symbol.toUpperCase()) ||
		       symbols.find(o => o.id === symbol.toLowerCase());
	}

	_emitter(){
		this._getJSON('', (symbols) => {
			if(!symbols){ return false; }

			this.events.filter(e => e.type == "update").forEach(event => {
				var res = this._find(symbols, event.symbol);
				if(res){
					event.callback(res, event);
				}
			});

			this.events.filter(e => e.type == "greater").forEach(event => {
				var res = this._find(symbols, event.symbol);
				if(res){
					if(res["price_"+this.convert] >= event.price){
						event.callback(res, event);
					}
				}
			});

			this.events.filter(e => e.type == "lesser").forEach(event => {
				var res = this._find(symbols, event.symbol);
				if(res){
					if(res["price_"+this.convert] <= event.price){
						event.callback(res, event);
					}
				}
			});

			this.events.filter(e => e.type == "percent1h").forEach(event => {
				var res = this._find(symbols, event.symbol);
				if(res){
					if(event.percent < 0 && res.percent_change_1h <= event.percent ){
						event.callback(res, event);
					} else if(event.percent > 0 && res.percent_change_1h >= event.percent){
						event.callback(res, event);
					} else if(event.percent == 0 && res.percent_change_1h == 0){
						event.callback(res, event);
					}
				}
			});

			this.events.filter(e => e.type == "percent24h").forEach(event => {
				var res = this._find(symbols, event.symbol);
				if(res){
					if(event.percent < 0 && res.percent_change_24h <= event.percent ){
						event.callback(res, event);
					} else if(event.percent > 0 && res.percent_change_24h >= event.percent){
						event.callback(res, event);
					} else if(event.percent == 0 && res.percent_change_24h == 0){
						event.callback(res, event);
					}
				}
			});

			this.events.filter(e => e.type == "percent7d").forEach(event => {
				var res = this._find(symbols, event.symbol);
				if(res){
					if(event.percent < 0 && res.percent_change_7d <= event.percent ){
						event.callback(res, event);
					} else if(event.percent > 0 && res.percent_change_7d >= event.percent){
						event.callback(res, event);
					} else if(event.percent == 0 && res.percent_change_7d == 0){
						event.callback(res, event);
					}
				}
			});
		});
	}

	multi(callback){ // FIXME - not yet done
		this._getJSON('', (symbols) => {
			if(symbols && callback){
				console.log(symbols);
				var response = {};
				response.data = symbols;
				response.getTicker = function(symbol){ return this.data.find(o => o.symbol === symbol.toUpperCase()) || this.data.find(o => o.id === symbol.toLowerCase()); };
				response.getAvailableSymbols = function(){ return this.data; };
				response.getAvailableSymbolPairs = function(){ return this.data; };
				callback(response);
			}
		});
		return this;
	}
		/* Usage:
				BitFinEx.multi(symbols => {
				    console.log(symbols.getTicker("BTC").last_price); // Prints price of BTC
				    console.log(symbols.getTicker("ETH").last_price); // Print price of ETH
				 });
		*/

    /*
     * Function: getSymbolRecentTrades(symbol, callback)
     *
     * Description: Get a list of the most recent trades for the given symbol.
     *
     * params: symbol = 'btc'
     *         callback
     *
     * GET: https://api.bitfinex.com/v1/trades/<symbol>
     *
     * Response: 200 OK
     *      [{
     *        "timestamp":1444266681,
     *        "tid":11988919,
     *        "price":"244.8",
     *        "amount":"0.03297384",
     *        "exchange":"bitfinex",
     *        "type":"sell"
     *      }, {
     *      ...
     *      }]
     *
     * Response: 400 Bad Request
     *      {
     *        "message": "Unknown symbol"
     *      }
     */
	getSymbolRecentTrades(symbol, callback){
		if(callback){
			this._getJSON(`/trades/${symbol}${this.convert}`, (res) => {
				if(res){callback(res);}
			});
			return this;
		} else {
			return false;
		}
	}

    /*
     * Function: getSymbolStats(symbol, callback)
     *
     * Description: Various statistics about the requested pair.
     *
     * params: symbol = 'btc'
     *         callback
     *
     * GET: https://api.bitfinex.com/v1/stats/<symbol>
     *
     * Response: 200 OK
     *      [{
     *        "period":1,
     *        "volume":"7967.96766158"
     *      },{
     *        "period":7,
     *        "volume":"55938.67260266"
     *      },{
     *        "period":30,
     *        "volume":"275148.09653645"
     *      }]
     *
     * Response: 400 Bad Request
     *      {
     *        "message": "Unknown symbol"
     *      }
     */
	getSymbolStats(symbol, callback) {
		if(callback){
			this._getJSON(`/stats/${symbol}${this.convert}`, (res) => {
				if(res){callback(res);}
			});
			return this;
		} else {
			return false;
		}
	}



    /*
     * Function: getTicker(symbol, callback)
     *
     * Description: The ticker is a high level overview of the state of the market.
     *             It shows you the current best bid and ask, as well as the last trade price.
     *             It also includes information such as daily volume and how much the price
     *             has moved over the last day.
     *
     * params: symbol = 'btcusd'
     *         callback
     *
     * GET: https://api.bitfinex.com/v1/pubticker/<symbol>
     *
     * Response: 200 OK
     *       {
     *         "mid":"244.755",
     *         "bid":"244.75",
     *         "ask":"244.76",
     *         "last_price":"244.82",
     *         "low":"244.2",
     *         "high":"248.19",
     *         "volume":"7842.11542563",
     *         "timestamp":"1444253422.348340958"
     *       }
     *
     * Response: 400 Bad Request
     *       {
     *         "message": "Unknown symbol"
     *       }
     */
	getTicker(symbol, callback){
		if(callback){
			this._getJSON(`/pubticker/${symbol}${this.convert}`, (res) => {
				if(res){callback(res);}
			});
			return this;
		} else {
			return false;
		}
	}



    /*
     * Function: getAvailableSymbolPairs(callback)
     *
     * Description: Gets a list of symbol pairs on the specified base currency (options.currency)
     *
     * params: callback
     *
     * GET: https://api.bitfinex.com/v1/symbols
     *
     * Response: 200 OK
     *       [
     *         "btcusd",
     *         "ethusd",
     *         "ethbtc",
     *         "ltcusd",
     *         "ltcbtc",
     *         ...
     *       ]
     *
     * Response: 400 Bad Request
     *       {
     *         "message": "Unknown symbol"
     *       }
     *
     */
	getAvailableSymbolPairs(callback){
		if(callback){
			this._getJSON('/symbols', (symbols) => {
                var res = [];
								var currencyRegExp = RegExp(this.convert, 'gi');
                symbols.forEach(function(pair) {
                    if ( pair.match(currencyRegExp) ) res.push(pair);
                });
				if (res.length > 0){callback(res);}
			});
			return this;
		} else {
			return false;
		}
	}



    /*
     * Function: getAvailableSymbols(callback)
     *
     * Description: Gets a list of all available symbol pairs.
     *
     * params: callback
     *
     * GET: https://api.bitfinex.com/v1/symbols
     *
     * Response: 200 OK
     *       [
     *         "btcusd",
     *         "ethusd",
     *         "ltcusd",
     *         ...
     *       ]
     *
     * Response: 400 Bad Request
     *       {
     *         "message": "Unknown symbol"
     *       }
     *
     */
	getAvailableSymbols(callback){
		if(callback){
			this._getJSON('/symbols', callback);
			return this;
		} else {
			return false;
		}
	}


    /*
     * Function: getSymbolOrderBook(symbol, callback)
     *
     * Description: Get the full order book for the specified symbol piar
     *
     * params: symbol = btcusd
     *         callback
     *
     * GET: https://api.bitfinex.com/v1/book/<symbol>
     *
     * Response: 200 OK
     *      {
     *        "bids":[{
     *          "price":"574.61",
     *          "amount":"0.1439327",
     *          "timestamp":"1472506127.0"
     *        },{
     *        ...
     *        }],
     *        "asks":[{
     *          "price":"574.62",
     *          "amount":"19.1334",
     *          "timestamp":"1472506126.0"
     *        },{
     *        ...
     *        }]
     *      }
     *
     * Response: 400 Bad Request
     *       {
     *         "message": "Unknown symbol"
     *       }
     *
     */
	getSymbolOrderBook(symbol, callback){
		if(callback){
			this._getJSON(`/book/${symbol}${this.convert}`, (res) => {
				if(res){callback(res);}
			});
			return this;
		} else {
			return false;
		}
	}


	on(symbol, callback){
		if(this.events){
			this.events.push({symbol, callback, type: "update"});
		} else {
			return false;
		}
	}

	onPriceGreater(symbol, price, callback){
		if(this.events){
			this.events.push({symbol, price, callback, type: "greater"});
		} else {
			return false;
		}
	}

	onPriceLesser(symbol, price, callback){
		if(this.events){
			this.events.push({symbol, price, callback, type: "lesser"});
		} else {
			return false;
		}
	}

	onPricePercentChange(symbol, percent, callback){
		if(this.events){
			this.events.push({symbol, percent, callback, type: "pricepercent"});
		} else {
			return false;
		}
	}

	onPricePercentChange1h(symbol, percent, callback){
		if(this.events){
			this.events.push({symbol, percent, callback, type: "pricepercent1h"});
		} else {
			return false;
		}
	}

	onPricePercentChange24h(symbol, percent, callback){
		if(this.events){
			this.events.push({symbol, percent, callback, type: "pricepercent24h"});
		} else {
			return false;
		}
	}

	onPricePercentChange7d(symbol, percent, callback){
		if(this.events){
			this.events.push({symbol, percent, callback, type: "pricepercent7d"});
		} else {
			return false;
		}
	}

	onVolumeChange(symbol, value, callback){
		if(this.events){
			this.events.push({symbol, percent, callback, type: "volumechange"});
		} else {
			return false;
		}
	}

	onVolumeChange1h(symbol, percent, callback){
		if(this.events){
			this.events.push({symbol, value, callback, type: "volumechange1h"});
		} else {
			return false;
		}
	}

	onVolumeChange24h(symbol, value, callback){
		if(this.events){
			this.events.push({symbol, value, callback, type: "volumechange24h"});
		} else {
			return false;
		}
	}

	onVolumeChange7d(symbol, value, callback){
		if(this.events){
			this.events.push({symbol, value, callback, type: "volumechange7d"});
		} else {
			return false;
		}
	}


	onVolumePercentChange(symbol, percent, callback){
		if(this.events){
			this.events.push({symbol, percent, callback, type: "volumepercent"});
		} else {
			return false;
		}
	}

	onVolumePercentChange1h(symbol, percent, callback){
		if(this.events){
			this.events.push({symbol, percent, callback, type: "volumepercent1h"});
		} else {
			return false;
		}
	}

	onVolumePercentChange24h(symbol, percent, callback){
		if(this.events){
			this.events.push({symbol, percent, callback, type: "volumepercent24h"});
		} else {
			return false;
		}
	}

	onVolumePercentChange7d(symbol, percent, callback){
		if(this.events){
			this.events.push({symbol, percent, callback, type: "volumepercent7d"});
		} else {
			return false;
		}
	}

	deleteEvent(event){
		this.events.splice(this.events.indexOf(event), 1);
		return this;
	}
}

module.exports = BitFinEx;
