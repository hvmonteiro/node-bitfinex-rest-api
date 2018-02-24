'use strict'; // jshint ignore:line

// jshint esversion: 6
/* globals require: true, __dirname: true, setInterval: true, console: true, module: true */


var request = require('request');

class BitFinexAPI {

    constructor(options={}) {
        this.API_URL = options.API_URL || "https://api.bitfinex.com";
        this.convert = options.convert || "USD";
        //this.events = options.events || false;
        this.events = false; // FIXME: Events not working yet. Remove this after it's working
        if (this.events) {
            this.refresh = options.refresh*1000 || 60*1000;
            this.events = [];
            this._emitter();
            setInterval(this._emitter.bind(this), this.refresh);
        }
    }

    _getJSON(url, callback) {
        request(this.API_URL+url, (error, response, body) => {
            if (error) {
                callback(false);
                return this;
            }
            if (response && response.statusCode == 200) {
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

    _emitter() {
        /* Working on Events: Still not working!!!
            var symbolPair = symbol.toUpperCase() + this.convert.toUpperCase();
            this._getJSON('/v2/ticker/t'+symbolPair, (res) => {
        */
        this.getSymbols(symbols => {
            if (!symbols) { return false; } // FIXME

            this.events.filter(e => e.type == "update").forEach(event => {
                var res = this._find(symbols, event.symbol);
                if (res) {
                    event.callback(res, event);
                }
            });

            this.events.filter(e => e.type == "priceGreater").forEach(event => {
                var res = this._find(symbols, event.symbol);
                if (res) {
                    if (res["price_"+this.convert] >= event.price) {
                        event.callback(res, event);
                    }
                }
            });

            this.events.filter(e => e.type == "priceLesser").forEach(event => {
                var res = this._find(symbols, event.symbol);
                if (res) {
                    if (res["price_"+this.convert] <= event.price) {
                        event.callback(res, event);
                    }
                }
            });

            this.events.filter(e => e.type == "pricePercentChange1h").forEach(event => {
                var res = this._find(symbols, event.symbol);
                if (res) {
                    if (event.percent < 0 && res.percent_change_1h <= event.percent ) {
                        event.callback(res, event);
                    } else if (event.percent > 0 && res.percent_change_1h >= event.percent) {
                        event.callback(res, event);
                    } else if (event.percent == 0 && res.percent_change_1h == 0) {
                        event.callback(res, event);
                    }
                }
            });

            this.events.filter(e => e.type == "pricePercentChange24h").forEach(event => {
                var res = this._find(symbols, event.symbol);
                if (res) {
                    if (event.percent < 0 && res.percent_change_24h <= event.percent ) {
                        event.callback(res, event);
                    } else if (event.percent > 0 && res.percent_change_24h >= event.percent) {
                        event.callback(res, event);
                    } else if (event.percent == 0 && res.percent_change_24h == 0) {
                        event.callback(res, event);
                    }
                }
            });

            this.events.filter(e => e.type == "pricePercentChange7d").forEach(event => {
                var res = this._find(symbols, event.symbol);
                if (res) {
                    if (event.percent < 0 && res.percent_change_7d <= event.percent ) {
                        event.callback(res, event);
                    } else if (event.percent > 0 && res.percent_change_7d >= event.percent) {
                        event.callback(res, event);
                    } else if (event.percent == 0 && res.percent_change_7d == 0) {
                        event.callback(res, event);
                    }
                }
            });
        });
    }


    /*
     * Function: _getTickerArray()
     *
     * Description: Accepts a object and returns a array
     *
     * params: {
     *         symbol: 'ELF',
     *         bid: 0.0015233,
     *         bidSize: 115210.00662534,
     *         ask: 0.0015405,
     *         askSize: 14571.10127627,
     *         dailyChange: 0.0000491,
     *         dailyChangePerc: 0.0332,
     *         lastPrice: 0.0015269,
     *         volume: 44796.30665487,
     *         high: 0.0015855,
     *         low: 0.001458 
     *        }
     *
     * returns: array = [
     *         'ELF',
     *         10067,
     *         59.44536362,
     *         10069,
     *         29.15006837,
     *         -333.08973822,
     *         -0.032,
     *         10071,
     *         65248.68663377,
     *         10544,
     *         9760 ]
     *
     */
    _getTickerArray(data = []) {

        if (data.length === -1) return data;

        let {
            symbol,
            bid,
            bidSize,
            ask,
            askSize,
            dailyChange,
            dailyChangePerc,
            lastPrice,
            volume,
            high,
            low,
        } = data;

        return [
            symbol,
            bid,
            bidSize,
            ask,
            askSize,
            dailyChange,
            dailyChangePerc,
            lastPrice,
            volume,
            high,
            low
        ];

    }

    /*
     * Function: _getTickerObject()
     *
     * Description: Accepts an Array and output a object
     *
     * params: array = [
     *         10067,
     *         59.44536362,
     *         10069,
     *         29.15006837,
     *         -333.08973822,
     *         -0.032,
     *         10071,
     *         65248.68663377,
     *         10544,
     *         9760 ]
     *
     * returns: {
     *         symbol: 'tELFETH',
     *         bid: 0.0015233,
     *         bidSize: 115210.00662534,
     *         ask: 0.0015405,
     *         askSize: 14571.10127627,
     *         dailyChange: 0.0000491,
     *         dailyChangePerc: 0.0332,
     *         lastPrice: 0.0015269,
     *         volume: 44796.30665487,
     *         high: 0.0015855,
     *         low: 0.001458 
     *        }
     *
     */
    _getTickerObject(data = []) {

        if (data.length === -1) return data;
        return {
            'symbol' : data[0],
            'bid' : data[1],
            'bidSize' : data[2],
            'ask' : data[3],
            'askSize' : data[4],
            'dailyChange' : data[5],
            'dailyChangePerc' : data[6],
            'lastPrice' : data[7],
            'volume' : data[8],
            'high' : data[9],
            'low' : data[10],
        };
    }




    /*
     * Function: getPlatformStatus(callback)
     *
     * Description: Get the current status of the platform (1=operative, 0=maintenance).
     *
     *             When the platform is marked in MAINTENANCE MODE bots should stop trading activity.
     *             Cancelling orders will be still possible.
     *
     *
     * params: callback
     *
     * GET: https://api.bitfinex.com/v2/platform/status
     *
     * Response: 200 OK
     *       [1]
     *
     * Response: 400 Bad Request
     *       {
     *         "message": "Unknown symbol"
     *       }
     *
     * returns:
     *       { status: 'operative' }
     *
     *
     */
    getPlatformStatus(callback) {
        if (callback) {
            this._getJSON('/v2/platform/status', res => {
                var platformStatus = (res[0] == 1) ? { 'status' : 'operative' } : { 'status' : 'maintenance' };
                return callback(platformStatus);
            });
            return this; // (error, response, body)
        } else {
            return false;
        }
    }



    /*
     * Function: getTradingPairs(callback)
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
     *
     * Returns: 
     *
     *       [
     *         "BTCUSD",
     *         "ETHUSD",
     *         "ETHBTC",
     *         "LTCUSD",
     *         "LTCBTC",
     *         ...
     *       ]
     *
     */
    getTradingPairs(callback) {
        if (callback) {
            this._getJSON('/v1/symbols', (symbolPairs) => {
                symbolPairs.sort();
                var res = symbolPairs.map(function(pair) { return pair.toUpperCase(); });
                if (res.length > 0) { callback(res); }
            });
            return this;
        } else {
            return false;
        }
    }



    /*
     * Function: getSymbols(callback)
     *
     * Description: Gets a sorted list of all available symbols.
     *
     * params: callback
     *
     * GET: https://api.bitfinex.com/v1/symbols
     *
     * Response: 200 OK
     *       [
     *         "btc",
     *         "eth",
     *         "ltc",
     *         ...
     *       ]
     *
     * Response: 400 Bad Request
     *       {
     *         "message": "Unknown symbol"
     *       }
     *
     *
     * Returns: 
     *
     *       [
     *         "BTC",
     *         "ETH",
     *         "LTC",
     *         ...
     *       ]
     */
    getSymbols(callback) {
        if (callback) {
            var convert = this.convert.toLowerCase();
            this._getJSON('/v1/symbols', (symbols) => {
                var res = [];
                var symbolPairs = [];
                symbols.forEach(function(pair) {
                    if ( pair.endsWith(convert) ) symbolPairs.push(pair.slice(0, pair.indexOf(convert))); // Returns symbol only, removing setup 'options.convert'.
                });
                symbolPairs.sort();
                res = symbolPairs.map(function(pair) { return pair.toUpperCase(); });
                if (res.length > 0) { callback(res); }
            });
            return this;
        } else {
            return false;
        }
    }



    /*
     * Function: getTopSymbols(top, callback)
     *
     * Description: Gets a UNSORTED list of top <n> available symbols.
     *
     * params: top = number
     *         callback
     *
     * GET: https://api.bitfinex.com/v1/symbols
     *
     * Response: 200 OK
     *       [
     *         "btc",
     *         "eth",
     *         "ltc",
     *         ...
     *       ]
     *
     * Response: 400 Bad Request
     *       {
     *         "message": "Unknown symbol"
     *       }
     *
     */
    getTopSymbols(limit, callback) {
        if (limit && callback) {
            var convert = this.convert.toLowerCase();
            this._getJSON('/v1/symbols', (symbols) => {
                var res = [];
                var symbolPairs = [];
                symbols.forEach(function(pair) {
                    if ( pair.endsWith(convert) ) symbolPairs.push(pair.slice(0, pair.indexOf(convert))); // Returns symbol only, removing setup 'options.convert'.
                });
                res = symbolPairs.map(function(pair) { return pair.toUpperCase(); });
                if (res.length > 0) {callback(res.slice(0, limit));}
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
     * Attention: It will use the current set currency in variable 'this.convert'.
     *
     * params: symbol = 'BTC'
     *         callback
     *
     * GET: https://api.bitfinex.com/v2/ticker/tBTCUSD
     *
     * Response: 200 OK
     *       [ 10067,
     *         59.44536362,
     *         10069,
     *         29.15006837,
     *         -333.08973822,
     *         -0.032,
     *         10071,
     *         65248.68663377,
     *         10544,
     *         9760 ]
     *
     *
     * Response: 400 Bad Request
     *       {
     *         "message": "Unknown symbol"
     *       }
     *
     * Returns:
     *      {
     *         symbol: 'tELFETH',
     *         bid: 0.0015233,
     *         bidSize: 115210.00662534,
     *         ask: 0.0015405,
     *         askSize: 14571.10127627,
     *         dailyChange: 0.0000491,
     *         dailyChangePerc: 0.0332,
     *         lastPrice: 0.0015269,
     *         volume: 44796.30665487,
     *         high: 0.0015855,
     *         low: 0.001458 
     *      }
     *
     */
    getTicker(symbol, callback) {
        if (symbol && callback) {
            var symbolPair = symbol.toUpperCase() + this.convert.toUpperCase();
            this._getJSON('/v2/ticker/t'+symbolPair, (res) => {
                console.log(res);
                res.splice(0, 0, symbol.toUpperCase()); // insert symbol at array index [0]
                if (res) {callback(this._getTickerObject(res));}
            });
            return this;
        } else {
            return false;
        }
    }



    /*
     * Function: getTickers(symbols, callback)
     *
     * Description: Get ticker for specified symbols.
     *             The ticker is a high level overview of the state of the market.
     *             It shows you the current best bid and ask, as well as the last trade price.
     *             It also includes information such as daily volume and how much the price
     *             has moved over the last day.
     *
     * Attention: It will use the current set currency in variable 'this.convert'.
     *
     * params: symbols = 'BTC, ETH, ...'
     *         callback
     *
     * GET: https://api.bitfinex.com/v2/tickers?symbols=tBTCUSD,tETHUSD,...
     *
     * Response: 200 OK
     * // as trading pairs (ex. tBTCUSD)
     *      [ [
     *        SYMBOL,
     *        BID, 
     *        BID_SIZE, 
     *        ASK, 
     *        ASK_SIZE, 
     *        DAILY_CHANGE, 
     *        DAILY_CHANGE_PERC, 
     *        LAST_PRICE, 
     *        VOLUME, 
     *        HIGH, 
     *        LOW
     *      ],[
     *       ...
     *      ] ]
     *
     * Response: 400 Bad Request
     *       {
     *         "message": "Unknown symbol"
     *       }
     *
     * Returns:
     *      [ {
     *         symbol: 'ELF',
     *         bid: 0.0015233,
     *         bidSize: 115210.00662534,
     *         ask: 0.0015405,
     *         askSize: 14571.10127627,
     *         dailyChange: 0.0000491,
     *         dailyChangePerc: 0.0332,
     *         lastPrice: 0.0015269,
     *         volume: 44796.30665487,
     *         high: 0.0015855,
     *         low: 0.001458 
     *      },{
     *         symbol: 'ELF',
     *         bid: 0.0015233,
     *         ...
     *      },{
     *      ...
     */
    getTickers(symbols, callback) {
        if (symbols && callback) {
            var allSymbolPairs = [];
            symbols.split(',').forEach(symbol => {

                var symbolPair = symbol.toUpperCase() + this.convert.toUpperCase();
                allSymbolPairs.push('t'+symbolPair);
            });
            this._getJSON('/v2/tickers?symbols='+allSymbolPairs.join(','), (res) => {
                var tickers = [];
                res.forEach( tickerData => {
                    tickerData[0] = tickerData[0].replace(/^t/ig, '').substring(0, tickerData[0].length - 4).toUpperCase(); // in: 'tBTCUSD' => out: 'BTC'
                    tickers.push(this._getTickerObject(tickerData));
                });
                if (res) { callback(tickers); }
            });
            return this;
        } else {
            return false;
        }
    }



    /*
     * Function: getAllTickers(callback)
     *
     * Description: Get ticker for all available symbols.
     *             The ticker is a high level overview of the state of the market.
     *             It shows you the current best bid and ask, as well as the last trade price.
     *             It also includes information such as daily volume and how much the price
     *
     * Attention: It will use the current set currency in variable 'this.convert'.
     *             has moved over the last day.
     *
     * params: callback
     *
     * Response: 200 OK
     * // as trading pairs (ex. tBTCUSD)
     *    [ [
     *        SYMBOL,
     *        BID, 
     *        BID_SIZE, 
     *        ASK, 
     *        ASK_SIZE, 
     *        DAILY_CHANGE, 
     *        DAILY_CHANGE_PERC, 
     *        LAST_PRICE, 
     *        VOLUME, 
     *        HIGH, 
     *        LOW
     *      ],[
     *       ...
     *      ] ]
     *
     * Response: 400 Bad Request
     *       {
     *         "message": "Unknown symbol"
     *       }
     *
     * Returns:
     *      [ {
     *         symbol: 'ELF',
     *         bid: 0.0015233,
     *         bidSize: 115210.00662534,
     *         ask: 0.0015405,
     *         askSize: 14571.10127627,
     *         dailyChange: 0.0000491,
     *         dailyChangePerc: 0.0332,
     *         lastPrice: 0.0015269,
     *         volume: 44796.30665487,
     *         high: 0.0015855,
     *         low: 0.001458 
     *      },{
     *         symbol: 'ELF',
     *         bid: 0.0015233,
     *         ...
     *      },{
     *      ...
     *      } ]
     */
    getAllTickers(callback) {
        if (callback) {
            this.getSymbols(symbols => {
                if (symbols && callback) {
                    var allSymbolPairs = [];
                    symbols.forEach(symbol => {

                        var symbolPair = symbol.toUpperCase() + this.convert.toUpperCase();
                        allSymbolPairs.push('t'+symbolPair);
                    });
                    this._getJSON('/v2/tickers?symbols='+allSymbolPairs.join(','), (res) => {
                        var tickers = [];
                        res.forEach( tickerData => {
                            tickerData[0] = tickerData[0].replace(/^t/ig, '').toUpperCase(); // in: 'tBTCUSD' => out: 'BTC'
                            tickers.push(this._getTickerObject(tickerData));
                        });
                        if (res) { callback(tickers); }
                    });
                    return this;
                } else {
                    return false;
                }
            });
            return this;
        } else {
            return false;
        }
    }


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
     *       [ { period: 1, volume: '54275.55265163' },
     *       { period: 7, volume: '444550.89986689' },
     *       { period: 30, volume: '2016074.12541456' } ]
     *
     * Response: 400 Bad Request
     *      {
     *        "message": "Unknown symbol"
     *      }
     *
     */
    getSymbolRecentTrades(symbol, callback) {
        if (symbol && callback) {
            var symbolPair = symbol.toLowerCase() + this.convert.toLowerCase();
            this._getJSON(`/v1/trades/${symbolPair}`, (res) => {
                if (res) { callback(res); }
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
     *      [ { timestamp: 1519493551,
     *          tid: 202303833,
     *          price: '9664.3',
     *          amount: '1.5',
     *          exchange: 'bitfinex',
     *          type: 'buy' },
     *        { timestamp: 1519493551,
     *          tid: 202303832,
     *          price: '9664.0',
     *          amount: '0.02',
     *          exchange: 'bitfinex',
     *          type: 'buy' } ]
     *
     * Response: 400 Bad Request
     *      {
     *        "message": "Unknown symbol"
     *      }
     *
     */
    getSymbolStats(symbol, callback) {
        if (symbol && callback) {
            var symbolPair = symbol.toLowerCase() + this.convert.toLowerCase();
            this._getJSON(`/v1/stats/${symbolPair}`, (res) => {
                if (res) { callback(res); }
            });
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
     *      { bids: 
     *         [ { price: '10067', amount: '0.1', timestamp: '1517419047.0' },
     *           { price: '10064', amount: '0.2', timestamp: '1517419047.0' },
     *           ...
     *           { price: '10032', amount: '0.5726', timestamp: '1517419047.0' } ],
     *          asks: 
     *           [ { price: '10069', amount: '0.9622', timestamp: '1517419047.0' },
     *             { price: '10070',
     *               amount: '4.63761686',
     *               timestamp: '1517419047.0' },
     *               ...
     *             { price: '10103', amount: '3.4', timestamp: '1517419047.0' } ] }
     *
     *
     * Response: 400 Bad Request
     *       {
     *         "message": "Unknown symbol"
     *       }
     *
     */
    getSymbolOrderBook(symbol, callback) {
        if (symbol && callback) {
            var symbolPair = symbol.toLowerCase() + this.convert.toLowerCase();
            this._getJSON(`/v1/book/${symbolPair}`, (res) => {
                if (res) { callback(res); }
            });
            return this;
        } else {
            return false;
        }
    }



    /* Events */



    on(symbol, callback) {
        if (this.events) {
            this.events.push({symbol, callback, type: "update"});
        } else {
            return false;
        }
    }

    onPriceGreater(symbol, price, callback) {
        if (this.events) {
            this.events.push({symbol, price, callback, type: "priceGreater"});
        } else {
            return false;
        }
    }

    onPriceLesser(symbol, price, callback) {
        if (this.events) {
            this.events.push({symbol, price, callback, type: "priceLesser"});
        } else {
            return false;
        }
    }

    onPricePercentChange(symbol, percent, callback) {
        if (this.events) {
            this.events.push({symbol, percent, callback, type: "pricePercent"});
        } else {
            return false;
        }
    }

    onPricePercentChange1h(symbol, percent, callback) {
        if (this.events) {
            this.events.push({symbol, percent, callback, type: "pricePercentChange1h"});
        } else {
            return false;
        }
    }

    onPricePercentChange24h(symbol, percent, callback) {
        if (this.events) {
            this.events.push({symbol, percent, callback, type: "pricePercentChange24h"});
        } else {
            return false;
        }
    }

    onPricePercentChange7d(symbol, percent, callback) {
        if (this.events) {
            this.events.push({symbol, percent, callback, type: "pricePercentChange7d"});
        } else {
            return false;
        }
    }

    onVolumeChange(symbol, value, callback) {
        if (this.events) {
            this.events.push({symbol, value, callback, type: "volumeChange"});
        } else {
            return false;
        }
    }

    onVolumeChange1h(symbol, percent, callback) {
        if (this.events) {
            this.events.push({symbol, percent, callback, type: "volumeChange1h"});
        } else {
            return false;
        }
    }

    onVolumeChange24h(symbol, value, callback) {
        if (this.events) {
            this.events.push({symbol, value, callback, type: "volumeChange24h"});
        } else {
            return false;
        }
    }

    onVolumeChange7d(symbol, value, callback) {
        if (this.events) {
            this.events.push({symbol, value, callback, type: "volumeChange7d"});
        } else {
            return false;
        }
    }


    onVolumePercentChange(symbol, percent, callback) {
        if (this.events) {
            this.events.push({symbol, percent, callback, type: "volumePercentChange"});
        } else {
            return false;
        }
    }

    onVolumePercentChange1h(symbol, percent, callback) {
        if (this.events) {
            this.events.push({symbol, percent, callback, type: "volumePercentChange1h"});
        } else {
            return false;
        }
    }

    onVolumePercentChange24h(symbol, percent, callback) {
        if (this.events) {
            this.events.push({symbol, percent, callback, type: "volumePercentChange24h"});
        } else {
            return false;
        }
    }

    onVolumePercentChange7d(symbol, percent, callback) {
        if (this.events) {
            this.events.push({symbol, percent, callback, type: "volumePercentChange7d"});
        } else {
            return false;
        }
    }

    deleteEvent(event) {
        this.events.splice(this.events.indexOf(event), 1);
        return this;
    }
}

module.exports = BitFinexAPI;

