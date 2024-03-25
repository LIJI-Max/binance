import { FuturesOrderType, PositionSide, WorkingType } from "./futures";
import { BooleanString, BooleanStringCapitalised, OrderResponseType, OrderSide, OrderStatus, OrderTimeInForce, OrderTradePreventionMode, numberInString } from "./shared";

export interface NewUMOrderParams<numberType = number> {
    symbol: string;
    side: OrderSide;
    positionSide?: PositionSide;
    type: FuturesOrderType;
    timeInForce?: OrderTimeInForce;
    quantity?: numberType;
    reduceOnly?: BooleanString;
    price?: numberType;
    newClientOrderId?: string;
    newOrderRespType?: OrderResponseType;
    selfTradePreventionMode?: OrderTradePreventionMode;
    goodTillDate?: number;
}

export interface NewUMOrder {
    clientOrderId: string;
    cumQty: numberInString;
    cumQuote: numberInString;
    executedQty: numberInString;
    orderId: number;
    avgPrice: numberInString;
    origQty: numberInString;
    price: numberInString;
    reduceOnly: boolean;
    side: OrderSide;
    positionSide: PositionSide;
    status: OrderStatus;
    stopPrice: numberInString;
    closePosition: boolean;
    symbol: string;
    timeInForce: OrderTimeInForce;
    selfTradePreventionMode: OrderTradePreventionMode;
}