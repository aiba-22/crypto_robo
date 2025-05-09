import axios from "axios";
export type Request = {
  id: number;
  apiKey: string;
  secretKey: string;
};

export type CryptocurrencyRateList = {
  symbol: string;
  last: number;
  bid: number;
  ask: number;
  high: number;
  low: number;
  volume: number;
  timestamp: Date;
};

export const findGmo = async () => {
  const response = await axios.get(`http://localhost:3001/api/gmo`);
  return response.data;
};

export const createGmo = async (request: Request) => {
  const response = await axios.post("http://localhost:3001/api/gmo", {
    ...request,
  });
  return response.data;
};

export const updateGmo = async (request: Request) => {
  const response = await axios.put("http://localhost:3001/api/gmo", {
    ...request,
  });
  return response.data;
};

export const listCryptocurrencyRate = async (): Promise<
  CryptocurrencyRateList[]
> => {
  const response = await axios.get(
    `http://localhost:3001/api/virtualCurrencyRateList`
  );
  return response.data;
};
