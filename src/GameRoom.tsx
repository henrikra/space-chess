import * as firebase from "firebase";
import "firebase/firestore";
import * as React from "react";
import { RouteComponentProps } from "react-router";

import api, { Role } from "./api";
import { ChessPiece, Move, Square } from "./backendCommon/common";
import env from "./env";
import withAuthentication, {
  WithAuthenticationProps
} from "./hocs/withAuthentication";
import { initialPieces } from "./utils";
import Board from "./Board";

firebase.initializeApp(env.firebase);

const firestore = firebase.firestore();
firestore.settings({ timestampsInSnapshots: true });

interface IRoomResponse {
  isGameFull: boolean;
  moves: Move[];
}

export interface PieceOnBoard {
  value: ChessPiece;
  at: Square;
  isCaptured: boolean;
}

interface IState {
  isWhiteTurn: boolean;
  pieces?: PieceOnBoard[];
  isGameFull: boolean;
  role: Role;
}

interface IProps
  extends RouteComponentProps<{ roomId: string }>,
    WithAuthenticationProps {}

class GameRoom extends React.Component<IProps, IState> {
  public roomListenerUnsubscribe: firebase.Unsubscribe;
  public state: IState = {
    isGameFull: true,
    isWhiteTurn: true,
    role: "spectator"
  };

  public calculatePiecesFromMoves = (moves: Move[]) => {
    return moves.reduce((pieces, move) => {
      return pieces
        .map(
          piece =>
            piece.at.rank === move.to.rank && piece.at.file === move.to.file
              ? { ...piece, isCaptured: true }
              : piece
        )
        .map(
          piece =>
            piece.at.rank === move.from.rank && piece.at.file === move.from.file
              ? { ...piece, at: { file: move.to.file, rank: move.to.rank } }
              : piece
        );
    }, initialPieces);
  };

  public componentWillMount() {
    this.roomListenerUnsubscribe = firestore
      .collection("rooms")
      .doc(this.props.match.params.roomId)
      .onSnapshot(doc => {
        const game = doc.data() as IRoomResponse;
        this.setState({
          isGameFull: game.isGameFull,
          isWhiteTurn: game.moves.length % 2 === 0,
          pieces: this.calculatePiecesFromMoves(game.moves)
        });
      });
  }

  public async componentWillReceiveProps(nextProps: IProps) {
    if (nextProps.userId) {
      try {
        const response = await api.whoAmI({
          roomId: nextProps.match.params.roomId,
          userId: nextProps.userId
        });
        this.setState({ role: response.data.role });
      } catch (error) {
        alert(error.response.data.error);
      }
    }
  }

  public componentWillUnmount() {
    this.roomListenerUnsubscribe();
  }

  public joinGame = async () => {
    if (this.props.userId) {
      try {
        const response = await api.joinGame(
          this.props.match.params.roomId,
          this.props.userId
        );
        this.setState({ role: response.data.role });
      } catch (error) {
        alert(error.response.data.error);
      }
    }
  };

  public render() {
    return (
      <div>
        <h1>RoomId: {this.props.match.params.roomId}</h1>
        <h2>I am: {this.props.userId}</h2>
        {!this.state.isGameFull &&
          this.state.role === "spectator" && (
            <button onClick={this.joinGame}>Join the game</button>
          )}
        {this.state.pieces ? (
          <>
            <Board
              pieces={this.state.pieces}
              roomId={this.props.match.params.roomId}
              userId={this.props.userId}
            />
            {this.state.isGameFull && (
              <p>{this.state.isWhiteTurn ? "White's turn" : "Black's turn"}</p>
            )}
            {this.state.role === "white" && <p>You are white</p>}
            {this.state.role === "black" && <p>You are black</p>}
          </>
        ) : (
          <p>Loading board</p>
        )}
      </div>
    );
  }
}

export default withAuthentication(GameRoom);
