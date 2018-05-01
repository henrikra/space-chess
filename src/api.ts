import axios from "axios";

interface IAddRoomResponse {
  roomId: string;
}

const agent = axios.create({ baseURL: process.env.REACT_APP_API_BASE_URL });

const api = {
  createChessRoom: (userId: string) =>
    agent.post<IAddRoomResponse>("addRoom", { userId }),
  movePiece: (roomId: string) =>
    agent.post("movePiece", { from: 100, to: 666, roomId })
};
export default api;
