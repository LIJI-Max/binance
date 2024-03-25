import { BinanceBaseUrlKey } from './types/shared';
import BaseRestClient from './util/BaseRestClient';

import { AxiosRequestConfig } from "axios";

import {
    generateNewOrderId,
    getOrderIdPrefix,
    getServerTimeEndpoint,
    logInvalidOrderId,
    RestClientOptions,
    serialiseParams,
  } from './util/requestUtils';
import { NewUMOrder, NewUMOrderParams } from './types/pm-um';

export class PmUMClient extends BaseRestClient{
    getServerTime(baseUrlKeyOverride?: BinanceBaseUrlKey | undefined): Promise<number> {
        throw new Error('Method not implemented.');
    }

    constructor(
        restClientOptions: RestClientOptions = {},
        requestOptions: AxiosRequestConfig = {},
      ) {
        super('pm', restClientOptions, requestOptions);
        return this;
      }

    submitNewUMOrder(params: NewUMOrderParams): Promise<NewUMOrder>{
        return this.postPrivate('papi/v1/um/order', params);
    }


}