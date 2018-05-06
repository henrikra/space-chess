import axios from "axios";
import { Square } from "./backendCommon/common";

interface IAddRoomResponse {
  roomId: string;
}

interface WhoAmIResponse {
  role: Role;
}

interface JoinGameResponse {
  role: Role;
}

export type Role = "white" | "black" | "spectator";

const agent = axios.create({ baseURL: process.env.REACT_APP_API_BASE_URL });

const api = {
  createChessRoom: (userId: string) =>
    agent.post<IAddRoomResponse>("addRoom", { userId }),
  joinGame: (roomId: string, userId: string) =>
    agent.post<JoinGameResponse>("joinGame", { userId, roomId }),
  movePiece: (roomId: string, userId: string, from: Square, to: Square) =>
    agent.post("movePiece", { from, to, roomId, userId }),
  whoAmI: ({ roomId, userId }: { roomId: string; userId: string }) =>
    agent.get<WhoAmIResponse>("roomInfo", { params: { roomId, userId } })
};
export default api;
