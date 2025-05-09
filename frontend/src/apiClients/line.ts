import axios from "axios";

export const findLine = async (): Promise<
  | {
      id: number;
      channelAccessToken: string;
      userId: string;
    }
  | undefined
> => {
  const response = await axios.get(`http://localhost:3001/api/line`);
  return response.data;
};

export const createLine = async (request: {
  channelAccessToken: string;
  userId: string;
}): Promise<void> => {
  await axios.post("http://localhost:3001/api/line", request);
};

export const updateLine = async (request: {
  id: number;
  channelAccessToken: string;
  userId: string;
}): Promise<void> => {
  await axios.put("http://localhost:3001/api/line", request);
};

export const sendLineNotification = async (message: string) => {
  const result = await axios.post<string>(
    "http://localhost:3001/api/notification/line",
    { message }
  );
  return result.data;
};
