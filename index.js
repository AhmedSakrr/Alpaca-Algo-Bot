const _ = require('lodash');
const Alpaca = require('@alpacahq/alpaca-trade-api');
const ADX = require('technicalindicators').ADX;
const MINUS_DI = require('technicalindicators').MDM;
const PLUS_DI = require('technicalindicators').PDM;

// set up paper trading API.
const alpaca = new Alpaca({
  keyId: process.env.API_KEY,
  secretKey: process.env.SECRET_API_KEY,
  paper: true,
  usePolygon: false
});

// Declaring Variables.
let lastOrder = 'SELL';
let ADX14, adx, pdi, mdi;
let close, high, low, period, input;


// Get Stock Data
async function initializeAverages() {
  const initialData = await alpaca.getBars(
    '15Min',
    'TSLA',
    {
      limit: 30,
      until: new Date()
    }
  );
  
  // get stock close, high, low, and period.
  close = _.map(initialData.TSLA, (bar) => bar.closePrice);
  high = _.map(initialData.TSLA, (bar) => bar.highPrice);
  low = _.map(initialData.TSLA, (bar) => bar.lowPrice);
  period = 14
  input =  {close: close, high: high, low: low, period: period}

  // organize ADX indicator
  ADX14 = new ADX(input).getResult()
  adx = ADX14[ADX14.length - 1]['adx']
  pdi = ADX14[ADX14.length - 1]['pdi']
  mdi = ADX14[ADX14.length - 1]['mdi']
  console.log(ADX14)
  console.log('adx: ' + adx);
  console.log('pdi: ' + pdi);
  console.log('mdi: ' + mdi);
}

initializeAverages();


/*
const client = alpaca.data_ws;

client.onConnect(() => {
  client.subscribe(['alpacadatav1/AM.SPY']);
  setTimeout(() => client.disconnect(), 6000*1000);
});

client.onStockAggMin((subject, data) => {
  const nextValue = data.closePrice;

  const next20 = sma20.nextValue(nextValue);
  const next50 = sma50.nextValue(nextValue);

  console.log(`next20: ${next20}`);
  console.log(`next50: ${next50}`);

  if (next20 > next50 && lastOrder !== 'BUY') {
    alpaca.createOrder({
      symbol: 'SPY',
      qty: 300,
      side: 'buy',
      type: 'market',
      time_in_force: 'day'
    });

    lastOrder = 'BUY';
    console.log('\nBUY\n');
  } else if (next20 < next50 && lastOrder !== 'SELL') {
    alpaca.createOrder({
      symbol: 'SPY',
      qty: 300,
      side: 'sell',
      type: 'market',
      time_in_force: 'day'
    });

    lastOrder = 'SELL';
    console.log('\nSELL\n');
  }
});

client.connect();*/