import axios from "axios";

export const findPriceAlert = async (): Promise<
  | {
      id: number;
      isUpperLimit: boolean;
      symbol: string;
      price: number;
    }
  | undefined
> => {
  const response = await axios.get("http://localhost:3001/api/priceAlert");
  if (!response.data) {
    return;
  }
  const {
    id,
    conditions: { isUpperLimit, symbol, price },
  } = response.data;

  return { id, isUpperLimit, symbol, price };
};

export const createPriceAlert = async (request: {
  isUpperLimit: boolean;
  symbol: string;
  price: number;
}): Promise<void> => {
  const { isUpperLimit, symbol, price } = request;
  await axios.post("http://localhost:3001/api/priceAlert", {
    conditions: { isUpperLimit, symbol, price },
  });
};

export const updatePriceAlert = async (request: {
  id: number;
  isUpperLimit: boolean;
  symbol: string;
  price: number;
}): Promise<void> => {
  const { id, isUpperLimit, symbol, price } = request;
  await axios.put("http://localhost:3001/api/priceAlert", {
    id,
    conditions: { isUpperLimit, symbol, price },
  });
};
