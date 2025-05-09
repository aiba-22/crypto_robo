import axios from "axios";
import crypto from "crypto";
import { GmoRepository } from "../db/repositories/gmoRepository";
import { ID } from "./constants";
import db from "../db/db";
export default class GmoService {
  async find() {
    const gmoRepository = new GmoRepository();
    const gmo = await gmoRepository.findById(ID);
    return {
      id: gmo?.id,
      apiKey: gmo?.api_key,
      secretKey: gmo?.secret_key,
    };
  }

  async create({ apiKey, secretKey }: { apiKey: string; secretKey: string }) {
    const transaction = await db.transaction();
    const gmoRepository = new GmoRepository(transaction);
    try {
      await gmoRepository.create({
        apiKey,
        secretKey,
      });
      await transaction.commit();
      return "success";
    } catch (error) {
      await transaction.rollback();
      return "failure";
    }
  }

  async update({
    id,
    apiKey,
    secretKey,
  }: {
    id: number;
    apiKey: string;
    secretKey: string;
  }) {
    const transaction = await db.transaction();
    const gmoRepository = new GmoRepository(transaction);
    try {
      await gmoRepository.update({ id, apiKey, secretKey });
      await transaction.commit();
      return "success";
    } catch (error) {
      await transaction.rollback();
      return "failure";
    }
  }

  async fetchTradingPrice(symbol: string) {
    const endPoint = "https://api.coin.z.com/public";
    const path = `/v1/ticker?symbol=${symbol}`;
    const result = await axios.get(endPoint + path);
    return result.data.data[0].last;
  }

  async fetchTradingRateList(): Promise<
    {
      ask: string;
      bid: string;
      high: string;
      last: string;
      low: string;
      symbol: string;
      timestamp: string;
      volume: string;
    }[]
  > {
    const endPoint = "https://api.coin.z.com/public";
    const path = `/v1/ticker?symbol=`;
    const result = await axios.get(endPoint + path);
    return result.data.data;
  }

  async fetchAssets({
    apiKey,
    secretKey,
  }: {
    apiKey: string;
    secretKey: string;
  }) {
    const timestamp = Date.now().toString();
    const method = "GET";
    const endPoint = "https://api.coin.z.com/private";
    const path = "/v1/account/assets";

    const text = timestamp + method + path;
    const sign = crypto
      .createHmac("sha256", secretKey)
      .update(text)
      .digest("hex");

    const options = {
      headers: {
        "API-KEY": apiKey,
        "API-TIMESTAMP": timestamp,
        "API-SIGN": sign,
      },
    };

    const response = await axios.get(endPoint + path, options);
    return response.data;
  }

  async order({
    symbol,
    side,
    price,
    size,
  }: {
    symbol: string;
    side: string;
    price: number;
    size: number;
  }) {
    const gmoRepository = new GmoRepository();
    const { id, api_key, secret_key } = await gmoRepository.findById(ID);
    if (!id) return;

    const timestamp = Date.now().toString();
    const method = "POST";
    const endPoint = "https://api.coin.z.com/private";
    const path = "/v1/order";
    const reqBody = JSON.stringify({
      symbol,
      side,
      executionType: "LIMIT",
      timeInForce: "FAS",
      price,
      size,
    });
    const text = timestamp + method + path + reqBody;
    const sign = crypto
      .createHmac("sha256", secret_key)
      .update(text)
      .digest("hex");
    const options = {
      headers: {
        "API-KEY": api_key,
        "API-TIMESTAMP": timestamp,
        "API-SIGN": sign,
      },
    };
    try {
      const result = await axios.post(endPoint + path, reqBody, options);
      return result.data;
    } catch (error) {
      return "failure";
    }
  }
}
