import { 
  AccountStatus,
  GetAllOrdersParams,
  MarginInterestType,
  OCOOrderStatus,
  OCOStatus,
    OrderResponseType, 
    OrderSide, 
    OrderStatus, 
    OrderTimeInForce, 
    OrderTradePreventionMode, 
    OrderType, 
    SideEffects, 
    numberInString 
} from "./shared";
import { OrderFill, OrderResponseResult } from "./spot";

export interface NewMarginOrderParams {
    symbol: string;
    side: OrderSide;
    type: OrderType;
    quantity?: number;
    quoteOrderQty?: number;
    price?: number;
    stopPrice?: number;
    newClientOrderId?: string;
    newOrderRespType?: OrderResponseType;
    icebergQty?: number;
    sideEffectType?: SideEffects;
    timeInForce?: OrderTimeInForce;
    selfTradePreventionMode?: OrderTradePreventionMode;
  }

  export interface MarginOrderResponseResult {
    symbol: string;
    orderId: number;
    clientOrderId: string;
    transactTime: number;
    price: numberInString;
    selfTradePreventionMode: OrderTradePreventionMode;
    origQty: numberInString;
    executedQty: numberInString;
    cummulativeQuoteQty: numberInString;
    status: OrderStatus;
    timeInForce: OrderTimeInForce;
    type: OrderType;
    side: OrderSide;
    marginBuyBorrowAmount: number;
    marginBuyBorrowAsset: string;
    fills: OrderFill[];
  }

  export interface AccountBalanceParams {
    asset?: string;
  }

  export interface AccountBalanceResponseResult{
    asset: string;
    totalWalletBalance: numberInString;
    crossMarginAsset: numberInString;
    crossMarginBorrowed: numberInString;
    crossMarginFree: numberInString;
    crossMarginInterest: numberInString;
    crossMarginLocked: numberInString;
    umWalletBalance: numberInString;
    umUnrealizedPNL: numberInString;
    cmWalletBalance: numberInString;
    cmUnrealizedPNL: numberInString;
    updateTime: number;
  }

  export interface AccountBorrowParams {
    asset: string;
    amount: number;
  }

  export interface AccountBorrowResponseResult{
    tranId: number;
  }

  export interface NewMarginOCOOrderParams{
    symbol: string;
    side: OrderSide;
    quantity: number;
    price: number;
    stopPrice: number;
    // list client order Ids
    listClientOrderId?: string;
    limitClientOrderId?: string;
    limitIcebergQty?: number;
    stopClientOrderId?: string;
    stopIcebergQty?: number;
    stopLimitTimeInForce?: OrderTimeInForce;
    newOrderRespType?: OrderResponseType;
    sideEffectType?: SideEffects;
    selfTradePreventionMode?: OrderTradePreventionMode;
  }

  export interface OCOOrderResponseResult{
    symbol: string;
    orderId: number;
    clientOrderId: string;
  }

  export interface OCOOrderListResponseResult extends OrderResponseResult{
    stopPrice: numberInString;
    selfTradePreventionMode: OrderTradePreventionMode;
  }

  export interface MarginOCOOrderResponseResult{
    orderListId: number;
    contingencyType: string;
    listStatusType: OCOStatus;
    listOrderStatus: OCOOrderStatus;
    listClientOrderId: string;
    transactionTime: number;
    symbol: string;
    marginBuyBorrowAmount: numberInString;
    marginBuyBorrowAsset: string;
    orders: OCOOrderResponseResult[];
    orderReports: OCOOrderListResponseResult[];
  }

  export interface CancelMarginOrderParams{
    symbol: string;
    orderId?: number;
    origClientOrderId?: string;
    /** For isolated margin trading only */
    newClientOrderId?: string;
  }

  export interface CancelMarginOrderResponseResult{
    symbol: string;
    orderId: number;
    origClientOrderId: string;
    clientOrderId: string;
    price: numberInString;
    origQty: numberInString;
    executedQty: numberInString;
    cummulativeQuoteQty: numberInString;
    status: OrderStatus;
    timeInForce: OrderTimeInForce;
    type: OrderType;
    side: OrderSide;
    selfTradePreventionMode?: OrderTradePreventionMode;
  }

  export interface BasicMarginSymbolParams{
    symbol: string;
  }

  export interface CancelOCOMarginOrderResponseResult{
    orderListId: number;
    contingencyType: string;
    listStatusType: OCOStatus;
    listOrderStatus: OCOOrderStatus;
    listClientOrderId: string;
    transactionTime: number;
    symbol: string;
    marginBuyBorrowAmount?: numberInString;
    marginBuyBorrowAsset?: string;
    orders: OCOOrderResponseResult[];
    orderReports: OCOOrderListResponseResult[];
  }

  export type MixCancelMarginOrderResponseResult = CancelMarginOrderResponseResult | CancelOCOMarginOrderResponseResult;

  export interface MarginOrder {
    clientOrderId: string;
    cummulativeQuoteQty: numberInString;
    executedQty: numberInString;
    icebergQty: numberInString;
    isWorking: boolean;
    orderId: number;
    origQty: numberInString;
    price: numberInString;
    side: OrderSide;
    status: OrderStatus;
    stopPrice: numberInString;
    symbol: string;
    time: number;
    timeInForce: OrderTimeInForce;
    type: OrderType;
    updateTime: number;
    accountId: number;
    selfTradePreventionMode: OrderTradePreventionMode;
    preventedMatchId?: numberInString;
    preventedQuantity: numberInString;
  }

  export interface MarginTradesParams extends GetAllOrdersParams{
    fromId?: number;
  }

  export interface MarginAccountInfoResponse{
    uniMMR: numberInString;
    accountEquity: numberInString;
    actualEquity: numberInString;
    accountInitialMargin: numberInString;
    accountStatus: AccountStatus;
    virtualMaxWithdrawAmount: numberInString;
    totalAvailableBalance: numberInString;
    totalMarginOpenLoss: numberInString;
    updateTime: number;
  }

  export interface GetMarginForceOrdersParams{
    startTime?: number;
    endTime?: number;
    current?: number;
    size?: number;
  }

  export interface MarginForceOrder{
    avgPrice: numberInString;
    executedQty: numberInString;
    orderId: number;
    price: numberInString;
    qty: numberInString;
    side: OrderSide;
    symbol: string;
    timeInForce: OrderTimeInForce;
    updatedTime: number;
  }

  export interface GetMarginForceOrdersResponse{
    total: number;
    rows: Array<MarginForceOrder>;
  }

  export interface MarginInterestHistory{
    txId: number;
    interestAccuredTime: number;
    asset: string;
    rawAsset: string;
    principal: numberInString;
    interest: numberInString;
    interestRate: numberInString;
    type: MarginInterestType;
  }

  export interface GetMarginInterestHistoryResponse{
    rows: Array<MarginInterestHistory>;
    total: number;
  }