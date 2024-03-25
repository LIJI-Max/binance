import { PmMarginClient } from "../src/pm-margin-client";

import * as dotenv from 'dotenv';
dotenv.config();

const key = process.env.APIKEY || 'APIKEY';
const secret = process.env.APISECRET || 'APISECRET';

const client = new PmMarginClient({
    api_key: key,
    api_secret: secret,
});

(async () => {
    try {
      const balances = await client.getBalances();
      console.log('getAccount Balance: ', balances);
    } catch (e) {
      console.error('request failed: ', e);
    }
  })();
  