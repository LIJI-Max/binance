import { DefaultLogger, WsUserDataEvents, isWsFormattedFuturesUserDataEvent, isWsFormattedSpotUserDataEvent, isWsFormattedSpotUserDataExecutionReport, isWsFormattedUserDataEvent } from '../src';
import { WebsocketClient } from '../src/websocket-client';

import * as dotenv from 'dotenv';
dotenv.config();

(async () => {

  // key & secrets are loaded
  const key = process.env.APIKEY || 'APIKEY';
  const secret = process.env.APISECRET || 'APISECRET';

    // optionally block some silly logs from showing in the logger
  const ignoredSillyLogMsgs = [
    'Sending ping',
    'Received pong, clearing pong timer',
    'Received ping, sending pong frame',
  ];

  // Optional, hook and customise logging behavior
  const logger = {
    ...DefaultLogger,
    silly: (msg, context) => {
      if (ignoredSillyLogMsgs.includes(msg)) {
        return;
      }
      console.log(JSON.stringify({ msg, context }));
    },
  };

  const wsClient = new WebsocketClient(
    {
      api_key: key,
      api_secret: secret,
      beautify: true,
    //   pingInterval: 10000
    },
    logger
  );

  wsClient.on('message', (data) => {
    // console.log('raw message received ', JSON.stringify(data, null, 2));

  });

  function onUserDataEvent(data: WsUserDataEvents) {

    if (data.wsMarket.includes('pm')) {
        console.log('pm user data event: ', data);
        return;
     }
    // the market denotes which API category it came from
    // if (data.wsMarket.includes('spot')) {

    // or use a type guard, if one exists (PRs welcome)
    if (isWsFormattedSpotUserDataExecutionReport(data)) {
      console.log('spot user execution report event: ', data);
      return;
    }
    if (isWsFormattedSpotUserDataEvent(data)) {
      console.log('spot user data event: ', data);
      return;
    }
    if (data.wsMarket.includes('margin')) {
      console.log('margin user data event: ', data);
      return;
    }
    if (data.wsMarket.includes('isolatedMargin')) {
      console.log('isolatedMargin user data event: ', data);
      return;
    }
    if (data.wsMarket.includes('usdmTestnet')) {
      console.log('usdmTestnet user data event: ', data);
      return;
    }
    if (data.wsMarket.includes('coinmTestnet')) {
      console.log('coinmTestnet user data event: ', data);
      return;
    }
    if (isWsFormattedFuturesUserDataEvent(data)) {
      console.log('usdm user data event: ', data);
      return;
    }

    
  }

  wsClient.on('formattedMessage', (data) => {
    // The wsKey can be parsed to determine the type of message (what websocket it came from)
    // if (!Array.isArray(data) && data.wsKey.includes('userData')) {
    //   return onUserDataEvent(data);
    // }

    // or use a type guard if available
    if (isWsFormattedUserDataEvent(data)) {
      return onUserDataEvent(data);
    }
    console.log('formattedMsg: ', JSON.stringify(data, null, 2));
  });

  wsClient.on('open', (data) => {
    console.log('connection opened open:', data.wsKey, data.ws.target.url);
  });

  // response to command sent via WS stream (e.g LIST_SUBSCRIPTIONS)
  wsClient.on('reply', (data) => {
    console.log('log reply: ', JSON.stringify(data, null, 2));
  });

  wsClient.on('reconnecting', (data) => {
    console.log('ws automatically reconnecting.... ', data?.wsKey);
  });

  wsClient.on('reconnected', (data) => {
    if (
      typeof data?.wsKey === 'string' &&
      data.wsKey.toLowerCase().includes('userdata')
    ) {
      console.log('ws for user data stream has reconnected ', data?.wsKey);
      // This is a good place to check your own state is still in sync with the account state on the exchange, in case any events were missed while the library was reconnecting:
      // - fetch balances
      // - fetch positions
      // - fetch orders
    } else {
      console.log('ws has reconnected ', data?.wsKey);
    }
  });

  wsClient.on('error', (data) => {
    console.error('ws saw error: ', data);
  });

  wsClient.subscribePmUserDataStream();

})();

