import axios from "axios";
import { Square } from "./backendCommon/common";

interface IAddRoomResponse {
  roomId: string;
}

const agent = axios.create({ baseURL: process.env.REACT_APP_API_BASE_URL });

const api = {
  createChessRoom: (userId: string) =>
    agent.post<IAddRoomResponse>("addRoom", { userId }),
  joinGame: (roomId: string, userId: string) =>
    agent.post("joinGame", { userId, roomId }),
  movePiece: (roomId: string, userId: string, from: Square, to: Square) =>
    agent.post("movePiece", { from, to, roomId, userId })
};
export default api;
