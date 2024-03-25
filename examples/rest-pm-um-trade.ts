import { PmUMClient } from "../src/index";
import { NewUMOrderParams } from 'src/types/pm-um';
import { v4 as uuidv4 } from 'uuid';

import * as dotenv from 'dotenv';
dotenv.config();

const key = process.env.APIKEY || 'APIKEY';
const secret = process.env.APISECRET || 'APISECRET';

const pmUmClient = new PmUMClient({
    api_key: key,
    api_secret: secret,
    beautifyResponses: true,
  });

const symbol = 'BTCUSDT';
(async () => {
    try{
        const buyAmountBtc = 0.002;
        const buyUMOrderRequest: NewUMOrderParams = {
            symbol: symbol,
            side: 'BUY',
            quantity: buyAmountBtc,
            type: 'LIMIT',
            price: 60000,
            // newClientOrderId: uuidv4(),
            timeInForce: 'GTX',
        }

        const buyUMOrderResult = await pmUmClient.submitNewUMOrder(buyUMOrderRequest);
        console.log(`Order result: `, JSON.stringify({ request: buyUMOrderRequest, response: buyUMOrderResult }, null, 2));


    } catch (e) {
        console.error('Error: request failed: ', e);
    }
})();