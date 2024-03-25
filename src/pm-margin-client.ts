import { 
    NewMarginOrderParams,
    MarginOrderResponseResult, 
    AccountBalanceParams,
    AccountBalanceResponseResult,
    AccountBorrowParams,
    AccountBorrowResponseResult,
    NewMarginOCOOrderParams,
    OCOOrderResponseResult,
    MarginOCOOrderResponseResult,
    CancelMarginOrderResponseResult,
    CancelMarginOrderParams,
    MixCancelMarginOrderResponseResult,
    BasicMarginSymbolParams,
    CancelOCOMarginOrderResponseResult,
    MarginOrder,
    MarginTradesParams,
    MarginAccountInfoResponse,
    GetMarginForceOrdersResponse,
    GetMarginForceOrdersParams,
    GetMarginInterestHistoryResponse,
    MarginInterestHistory
} from "./types/pm-margin";

import {
    generateNewOrderId,
    getOrderIdPrefix,
    getServerTimeEndpoint,
    logInvalidOrderId,
    RestClientOptions,
    serialiseParams,
  } from './util/requestUtils';

import BaseRestClient from './util/BaseRestClient';
import { AxiosRequestConfig } from "axios";
import { BasicAssetParam, BinanceBaseUrlKey, CancelOCOParams, GenericCodeMsgError, GetAllOrdersParams, GetOrderParams } from "./types/shared";
import { BasicFromPaginatedParams, BasicMarginAssetParams, GetOCOParams, MarginRecordResponse, QueryMarginRecordParams, QueryMaxBorrowResponse, RawAccountTrade } from "./types/spot";

export class PmMarginClient extends BaseRestClient{
  
    getServerTime(baseUrlKeyOverride?: BinanceBaseUrlKey | undefined): Promise<number> {
      throw new Error("Method not implemented.");
    }

    constructor(
        restClientOptions: RestClientOptions = {},
        requestOptions: AxiosRequestConfig = {},
      ) {
        super('pm', restClientOptions, requestOptions);
        return this;
      }
    
    getPing():Promise<any>{
      return this.get("papi/v1/ping");
    }

    submitNewMarginOrder(params: NewMarginOrderParams): Promise<MarginOrderResponseResult>{
      return this.postPrivate('papi/v1/margin/order', params);
    }

    marginAccountBorrow(params: AccountBorrowParams): Promise<AccountBorrowResponseResult>{
      return this.postPrivate('papi/v1/marginLoan', params);
    }

    marginAccountRepay(params: AccountBorrowParams): Promise<AccountBorrowResponseResult>{
      return this.postPrivate('papi/v1/repayLoan', params);
    }

    submitNewOCOMarginOrder(params: NewMarginOCOOrderParams): Promise<MarginOCOOrderResponseResult>{
      return this.postPrivate('papi/v1/margin/order/oco', params); 
    }

    cancelMarginOrder(params: CancelMarginOrderParams): Promise<CancelMarginOrderResponseResult>{
      return this.deletePrivate('papi/v1/margin/order', params);
    }

    cancelAllSymbolMarginOrders(params: BasicMarginSymbolParams): Promise<MixCancelMarginOrderResponseResult>{
      return this.deletePrivate('papi/v1/margin/allOpenOrders', params);
    }

    cancelMarginOCOOrder(params: CancelOCOParams): Promise<CancelOCOMarginOrderResponseResult>{
      return this.deletePrivate('papi/v1/margin/orderList', params);
    }

    getMarginOrder(params: GetOrderParams): Promise<MarginOrder>{
      return this.getPrivate('papi/v1/margin/order', params);
    }

    getOpenMarginOrders(params: Partial<BasicAssetParam>): Promise<MarginOrder[]>{
      return this.getPrivate('papi/v1/margin/openOrders', params);
    }

    getAllMarginOrders(params: GetAllOrdersParams): Promise<MarginOrder[]>{
      return this.getPrivate('papi/v1/margin/allOrders', params);
    }

    getMarginOCO(params?: GetOCOParams): Promise<Partial<MarginOCOOrderResponseResult>>{
      return this.getPrivate('papi/v1/margin/orderList', params);
    }

    getAllMarginOCO(params?: BasicFromPaginatedParams): Promise<Partial<MarginOCOOrderResponseResult>[]>{
      return this.getPrivate('papi/v1/margin/allOrderList', params)
    }

    getAllOpenMarginOCO(): Promise<Partial<MarginOCOOrderResponseResult>[]>{
      return this.getPrivate('papi/v1/margin/openOrderList');
    }

    getMarginAccountTradeList(params: MarginTradesParams): Promise<Partial<RawAccountTrade>[]>{
      return this.getPrivate('papi/v1/margin/myTrades', params);
    }

    getBalances(params?: AccountBalanceParams): Promise<AccountBalanceResponseResult | AccountBalanceResponseResult[]>{
      return this.getPrivate('papi/v1/balance', params);
    }

    getMarginAccountInfo(): Promise<MarginAccountInfoResponse>{
      return this.getPrivate('papi/v1/account');
    }

    queryMarginMaxBorrow(params: BasicMarginAssetParams): Promise<QueryMaxBorrowResponse>{
      return this.getPrivate('papi/v1/margin/maxBorrowable', params)
    }

    queryMarginMaxWithdraw(params: BasicMarginAssetParams): Promise<Partial<QueryMaxBorrowResponse>>{
      return this.getPrivate('papi/v1/margin/maxWithdraw', params);
    }

    getMarginForceOrders(params: GetMarginForceOrdersParams): Promise<GetMarginForceOrdersResponse>{
      return this.getPrivate('papi/v1/margin/forceOrders', params);
    }

    queryMarginLoanRecord(
      params: QueryMarginRecordParams,
    ): Promise<MarginRecordResponse> {
      return this.getPrivate('papi/v1/margin/marginLoan', params);
    }

    queryMarginRepayRecord(
      params: QueryMarginRecordParams,
    ): Promise<MarginRecordResponse> {
      return this.getPrivate('papi/v1/margin/repayLoan', params);
    }

    queryMarginInterestHistory(params: QueryMarginRecordParams): Promise<GetMarginInterestHistoryResponse>{
      return this.getPrivate('papi/v1/margin/marginInterestHistory', params);
    }

    queryNegativeInterestHistory(params: QueryMarginRecordParams): Promise<MarginInterestHistory[]>{
      return this.getPrivate('papi/v1/portfolio/interest-history', params);
    }

    setAutoCollection(): Promise<Partial<GenericCodeMsgError>>{
      return this.postPrivate('papi/v1/auto-collection');
    }

    setAssetCollection(params: BasicAssetParam): Promise<Partial<GenericCodeMsgError>>{
      return this.postPrivate('papi/v1/asset-collection', params);
    }

    getMarginUserDataListenKey(): Promise<{ listenKey: string }> {
      return this.post('papi/v1/listenKey');
    }
  
    keepAliveMarginUserDataListenKey(): Promise<{}> {
      return this.put('papi/v1/listenKey');
    }
  
    closeMarginUserDataListenKey(): Promise<{}> {
      return this.delete('papi/v1/listenKey');
    }

}