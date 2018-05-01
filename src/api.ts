import axios from "axios";

interface IAddRoomResponse {
  roomId: string;
}

const api = {
  createChessRoom: () =>
    axios.get<IAddRoomResponse>(
      "https://us-central1-fire-chess-9825d.cloudfunctions.net/addRoom"
    ),
  movePiece: (roomId: string) =>
    axios.post(
      "https://us-central1-fire-chess-9825d.cloudfunctions.net/movePiece",
      { from: 100, to: 666, roomId }
    )
};
export default api;
