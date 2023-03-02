
import lodash = require('lodash');
import os = require('os');


// const LANIp = lodash
//   .chain(os.networkInterfaces())
//   .values()
//   .flatten()
//   .find({ family: 'IPv4', internal: false })
//   .value()
//   .address;
//! public IP not work as expected  . use jsonIp async request public ip instead
// const publicIp = lodash
//   .chain(os.networkInterfaces())
//   .values()
//   .flatten()
//   .find({ family: 'IPv4', internal: false })
//   .value()
//   .address;
// console.debug('LANIp is ' + LANIp);
// console.debug('publicIp is ' + publicIp);

import { str, email, json, cleanEnv, url, host, port } from 'envalid';

export type Env = Readonly<{
  NODE_ENV: string
  // ACCESS_KEY_ID: string
  // ACCESS_KEY_SECRET: string
  // MONGO_URI: string
  // REDIS_HOST: string
  // REDIS_PORT: number
  // APP_API_ROOT: string
  // APP_PROTOCOL: string
  // APP_PORT: number
  // ABSOLUTE_UPLOAD_DIR: string
  // ALIPAY_VERIFY_ENDPOINT:string
  //
  // ALIPAY_APP_ID: string
  // APP_GATEWAY_URL:string
  // //尚未使用
  // APP_CLIENT_VERSION:string
}>
import dotEnv = require('dotenv');
import { readFileSync } from 'fs';
dotEnv.config({path: '.env.development' });
if(process.env.NODE_ENV === 'production'){
  const envConfig = dotEnv.parse(readFileSync('.env.production'))
  for (const k in envConfig) {
    process.env[k] = envConfig[k]
  }
}

const env: Env = cleanEnv(process.env, {
  NODE_ENV: str(
    { choices: ['production', 'development'] },
  ),
  // ACCESS_KEY_ID: str(),
  // ACCESS_KEY_SECRET: str(),
  // MONGO_URI: url(),
  // REDIS_HOST: host({ default: '127.0.0.1' }),
  // APP_API_ROOT: str(),
  // APP_PORT: port({ default: 3000 }),
  // APP_PROTOCOL: str({ default: 'http' }),
  // REDIS_PORT: port({ default: 6379 }),
  // ABSOLUTE_UPLOAD_DIR: str(),
  // ALIPAY_VERIFY_ENDPOINT:str({default:'/order/verifyOrder'}),
  // ALIPAY_APP_ID: str(),
  // APP_GATEWAY_URL: str(),
  //尚未使用
  // APP_CLIENT_VERSION:str()

}, { strict: false, dotEnvPath: null } as any);
export default env;
