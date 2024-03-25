import { AccountBorrowParams, BNBBurnParams, BNBBurnStatusResponse, BasicAssetParam, BasicMarginAssetParams, BasicMarginSymbolParams, CancelMarginOrderParams, GetAllOrdersParams, GetOrderParams, MainClient, MarginTradesParams, NewMarginOrderParams, NewSpotOrderParams, PmMarginClient, QueryMarginRecordParams, SymbolPrice, } from "../src/index";
import { v4 as uuidv4 } from 'uuid';

import * as dotenv from 'dotenv';
dotenv.config();

const key = process.env.APIKEY || 'APIKEY';
const secret = process.env.APISECRET || 'APISECRET';

const pmClient = new PmMarginClient({
    api_key: key,
    api_secret: secret,
    beautifyResponses: true,
  });

const mainClient = new MainClient({
    api_key: key,
    api_secret: secret,
    beautifyResponses: true,
  });

  
const entryAmountPercent = 50;// trigger trade with 50%
const symbol = 'BTCUSDT';
const assetDecimalPlaces = 4;


// method to trim down to decimal.
function trimToDecimalPlaces(number: number, precision: number): number {
    const array: any[] = number.toString().split('.');
    array.push(array.pop().substring(0, precision));
    const trimmedstr = array.join('.');
    return parseFloat(trimmedstr);
  }

async function testBuyMarginOrder(){
  try {
    /**
     * Get available balance
     */
    const balances = await pmClient.getBalances();
    console.log('getAccount Balance: ', balances);
    
    if(Array.isArray(balances)){
      const usdtBal = balances.find(assetBal => assetBal.asset === 'USDT');
      console.log('USDT balance object: ', usdtBal);
    }else{
      console.log(balances.asset , ' balance object: ', balances);
    }

  const btcTicker = await mainClient.getSymbolPriceTicker({ symbol: symbol }) as SymbolPrice;
  const lastPrice = btcTicker?.price;
  if (!lastPrice) {
    return console.error('Error: no price returned');
  }

  const buyAmountValue = 10;
  const buyAmountBtc = +(buyAmountValue / Number(lastPrice)).toFixed(assetDecimalPlaces);
  console.log(`Executing trade with BTC = ${buyAmountBtc} with USDT = ${buyAmountValue} value`);

  const orderId = uuidv4();
  const buyOrderRequest: NewMarginOrderParams = {
      symbol: symbol,
      quantity: buyAmountBtc,
      side: 'BUY',
      type: 'LIMIT_MAKER',
      price: 60000,
      newClientOrderId: orderId,
      // timeInForce: 'GTC',
      /**
       * ACK = confirmation of order acceptance (no placement/fill information) -> OrderResponseACK
       * RESULT = fill state -> OrderResponseResult
       * FULL = fill state + detail on fills and other detail -> OrderResponseFull
       */
      newOrderRespType: 'FULL'
    };

    console.log(`Submitting margin buy order: `, buyOrderRequest);
    const buyOrderResult = await pmClient.submitNewMarginOrder(buyOrderRequest);
    console.log(`Order result: `, JSON.stringify({ request: buyOrderRequest, response: buyOrderResult }, null, 2));

  } catch (e) {
    console.error('Error: request failed: ', e);
  }
}

async function testCancelOrder(){
  try{
    const orderClientId = "34d45559-e790-4f8f-933a-90c598142f9c";
    const cancelOrderRequest: CancelMarginOrderParams = {
      symbol: "BTCUSDT",
      origClientOrderId: orderClientId
    }
    console.log(`Cancel Order Request: `, cancelOrderRequest);
    const cancelOrderResult = await pmClient.cancelMarginOrder(cancelOrderRequest);
    console.log(`Cancel Order result: `, JSON.stringify({ request: cancelOrderRequest, response: cancelOrderResult }, null, 2));
  } catch(e){
    console.error('Error: request failed: ', e);
  }
}

async function testCancelAllSymbolMarginOrders(){
  try{
    const cancelAllSymbolMarginOrdersParams: BasicMarginSymbolParams = {
      symbol: "BTCUSDT"
    }
    console.log(`Cancel All Symbol Order Request: `, cancelAllSymbolMarginOrdersParams);
    const cancelAllSymbolResult = await pmClient.cancelAllSymbolMarginOrders(cancelAllSymbolMarginOrdersParams);
    console.log(`Cancel All Symbol Order result: `, JSON.stringify({ request: cancelAllSymbolMarginOrdersParams, response: cancelAllSymbolResult }, null, 2));
  }catch(e){
    console.error('Error: request failed: ', e);
  }
}

async function testGetMarginOrder(){
  try{
    const getOrderParams: GetOrderParams = {
      symbol: "BTCUSDT",
      origClientOrderId: "e0ec6bec-fb44-4ef5-9ded-e92da4a5d41b"
    }
    console.log(`Get Margin Order Request: `, getOrderParams);
    const getOrderParamsResult = await pmClient.getMarginOrder(getOrderParams);
    console.log(`Get Order result: `, JSON.stringify({ request: getOrderParams, response: getOrderParamsResult }, null, 2));

  }catch(e){
    console.error('Error: request failed: ', e);
  }
}

async function testGetOpenMarginOrders(){
  try{
    const getOrderParams: Partial<BasicAssetParam> = {
      asset: "BTCUSDT"
    }
    console.log(`Get All Open Margin Order Request: `, getOrderParams);
    const getOpenOrderParamsResult = await pmClient.getOpenMarginOrders(getOrderParams);
    console.log(`Get Order result: `, JSON.stringify({ request: getOrderParams, response: getOpenOrderParamsResult }, null, 2));
    
  }catch(e){
    console.error('Error: request failed: ', e);
  }
}

async function testAllMarginOrders(){
  try{
    const getOrderParams: GetAllOrdersParams = {
      symbol: "BTCUSDT"
    }
    console.log(`Get All Open Margin Order Request: `, getOrderParams);
    const getOpenOrderParamsResult = await pmClient.getAllMarginOrders(getOrderParams);
    console.log(`Get Order result: `, JSON.stringify({ request: getOrderParams, response: getOpenOrderParamsResult }, null, 2));
    
  }catch(e){
    console.error('Error: request failed: ', e);
  }
}

async function testGetMarginAccountTradeList(){
  try{
    const getMarginTradeParams: MarginTradesParams = {
      symbol: "BTCUSDT"
    }
    console.log(`Get All Open Margin Trade Request: `, getMarginTradeParams);
    const getMarginTradeResult = await pmClient.getMarginAccountTradeList(getMarginTradeParams);
    console.log(`Get Margin Trade result: `, JSON.stringify({ request: getMarginTradeParams, response: getMarginTradeResult }, null, 2));
  }catch(e){
    console.error('Error: request failed: ', e);
  }
}

async function testQueryMarginLoanRecord(){
  try{
    const queryMarginRecordParams: QueryMarginRecordParams = {
      asset: "BTC"
    }
    console.log(`Query Margin Loan Records Params: `, queryMarginRecordParams);
    const queryMarginLoanRecordResult = await pmClient.queryMarginLoanRecord(queryMarginRecordParams);
    console.log(`Get Margin Trade result: `, JSON.stringify({ request: queryMarginRecordParams, response: queryMarginLoanRecordResult }, null, 2));
  }catch(e){
    console.error('Error: request failed: ', e);
  }
}

async function testQueryMarginRepayRecord(){
  try{
    const queryMarginRecordParams: QueryMarginRecordParams = {
      asset: "BTC"
    }
    console.log(`Query Margin Repay Records Params: `, queryMarginRecordParams);
    const queryMarginRepayResult = await pmClient.queryMarginRepayRecord(queryMarginRecordParams);
    console.log(`Get Margin Trade result: `, JSON.stringify({ request: queryMarginRecordParams, response: queryMarginRepayResult }, null, 2));
  }catch(e){
    console.error('Error: request failed: ', e);
  }
}

async function testQueryMarginInterestHistory() {
  try{
    const queryMarginInterestHistoryParams: QueryMarginRecordParams = {
      asset: "BTC"
    }
    console.log(`Query Margin Interest History Params: `, queryMarginInterestHistoryParams);
    const marginInterestHistory = await pmClient.queryMarginInterestHistory(queryMarginInterestHistoryParams);
    console.log(`Get Margin Trade result: `, JSON.stringify({ request: queryMarginInterestHistoryParams, response: marginInterestHistory }, null, 2));

  }catch(e){
    console.error('Error: request failed: ', e);
  }
}

async function testQueryNegativeInterestHistory(){
  try{
    const queryNegativeInterestHistoryParams: QueryMarginRecordParams = {
      asset: "BTC"
    }
    console.log(`Query Margin Negative Interest History Params: `, queryNegativeInterestHistoryParams);
    const negativeInterestHistory = await pmClient.queryNegativeInterestHistory(queryNegativeInterestHistoryParams);
    console.log(`Get Margin Trade result: `, JSON.stringify({ request: queryNegativeInterestHistoryParams, response: negativeInterestHistory }, null, 2));

  }catch(e){
    console.error('Error: request failed: ', e);
  }
}

async function testQueryMarginMaxBorrow(){
  try{
    const marginAssetParams: BasicMarginAssetParams = {
      asset: "BTC"
    }
    console.log(`Query Margin Max Borrow Params: `, marginAssetParams);
    const marginMaxBorrowResult = await pmClient.queryMarginMaxBorrow(marginAssetParams);
    console.log(`Get Margin Max Borrow result: `, JSON.stringify({ request: marginAssetParams, response: marginMaxBorrowResult }, null, 2));
  }catch(e){
    console.error('Error: request failed: ', e);
  }
}

async function testQueryMarginWithdraw(){
  try{
    const marginAssetParams: BasicMarginAssetParams = {
      asset: "BNB"
    }
    console.log(`Query Margin Max Withdraw Params: `, marginAssetParams);
    const marginMaxWithdrawResult = await pmClient.queryMarginMaxWithdraw(marginAssetParams);
    console.log(`Get Margin Max Withdraw result: `, JSON.stringify({ request: marginAssetParams, response: marginMaxWithdrawResult }, null, 2));

  }catch(e){
    console.error('Error: request failed: ', e);
  }
}

async function testMarginAccountBorrow(){
  try{
    const accountBorrowParams: AccountBorrowParams = {
      asset: "BTC",
      amount: 0.0001
    }
    console.log(`Margin Account Borrow Params: `, accountBorrowParams);
    const accountBorrowResponseResult = await pmClient.marginAccountBorrow(accountBorrowParams);
    console.log(`Get Margin Max Withdraw result: `, JSON.stringify({ request: accountBorrowParams, response: accountBorrowResponseResult }, null, 2));

  }catch(e){
    console.error('Error: request failed: ', e);
  }
}

async function testMarginAccountRepay(){
  try{
    const accountRepayParams: AccountBorrowParams = {
      asset: "BTC",
      amount: 0.0001
    }
    console.log(`Margin Account Repay Params: `, accountRepayParams);
    const accountRepayResponseResult = await pmClient.marginAccountRepay(accountRepayParams);
    console.log(`Get Margin Max Repay result: `, JSON.stringify({ request: accountRepayParams, response: accountRepayResponseResult }, null, 2));
  } catch(e){
    console.error('Error: request failed: ', e);
  }
}

async function testGetBnbBurnStatus() {
  try{
    const bnbBurnStatusResponse = await mainClient.getBnbBurnStatus();
    console.log(`Get Bnb Burn Status: `, JSON.stringify({ response: bnbBurnStatusResponse }, null, 2));
  } catch(e){
    console.error('Error: request failed: ', e);
  }
}

async function testToggleBnbBurnStatus(){
  try{
    const bnbBurnStatusParams: BNBBurnParams = {
      interestBNBBurn: "true"
    }
    console.log(`Toggle Bnb Status Params: `, bnbBurnStatusParams);
    const toggleBnbBurnStatusResponse = await mainClient.toggleBnbBurnStatus(bnbBurnStatusParams);
    console.log(`Toggle Bnb Status Status result: `, JSON.stringify({ request: bnbBurnStatusParams, response: toggleBnbBurnStatusResponse }, null, 2));
  }catch(e){
    console.error('Error: request failed: ', e);
  }
}

async function testBuySpotOrder(){
  try {
    /**
     * Get available balance
     */
    const balance = await mainClient.getBalances();

    const usdtBal = balance.find(assetBal => assetBal.coin === 'USDT');
    // console.log('USDT balance object: ', usdtBal);

    const usdtAvailable = usdtBal?.free;

    if (!usdtBal || !usdtAvailable) {
      return console.error('Error: funds to trade from USDT');
    }


  const btcTicker = await mainClient.getSymbolPriceTicker({ symbol: symbol }) as SymbolPrice;
  const lastPrice = btcTicker?.price;
  if (!lastPrice) {
    return console.error('Error: no price returned');
  }

  const buyAmountValue = 100;
  const buyAmountBtc = +(buyAmountValue / Number(lastPrice)).toFixed(assetDecimalPlaces);
  console.log(`Executing trade with BTC = ${buyAmountBtc} with USDT = ${buyAmountValue} value`);

  const orderId = uuidv4();
  const buyOrderRequest: NewMarginOrderParams = {
      symbol: 'BNBUSDT',
      quantity: 0.01,
      side: 'BUY',
      type: 'LIMIT',
      price: 500,
      // newClientOrderId: orderId,
      timeInForce: 'GTC',
      /**
       * ACK = confirmation of order acceptance (no placement/fill information) -> OrderResponseACK
       * RESULT = fill state -> OrderResponseResult
       * FULL = fill state + detail on fills and other detail -> OrderResponseFull
       */
      newOrderRespType: 'FULL'
    };

    console.log(`Submitting margin buy order: `, buyOrderRequest);
    const buyOrderResult = await mainClient.submitNewOrder(buyOrderRequest);
    console.log(`Order result: `, JSON.stringify({ request: buyOrderRequest, response: buyOrderResult }, null, 2));

  } catch (e) {
    console.error('Error: request failed: ', e);
  }
}

(async () => {
    // testBuyMarginOrder();
    // testCancelOrder();
    testCancelAllSymbolMarginOrders();
    // testGetMarginOrder();
    // testGetOpenMarginOrders();
    // testAllMarginOrders();
    // testGetMarginAccountTradeList();
    // testQueryMarginLoanRecord();
    // testQueryMarginRepayRecord();
    // testQueryMarginInterestHistory();
    // testQueryNegativeInterestHistory();
    // testQueryMarginMaxBorrow();
    // testQueryMarginWithdraw();
    // testMarginAccountBorrow();
    // testMarginAccountRepay();
    // testGetBnbBurnStatus();
    // testToggleBnbBurnStatus();
    // testBuySpotOrder();
    // process.exit(1);
})();
  