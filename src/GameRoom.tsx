import { Unsubscribe } from "firebase";
import * as React from "react";
import { RouteComponentProps } from "react-router";

import api, { Role } from "./api";
import { ChessPiece, Move, Square } from "./backendCommon/common";
import { initialPieces } from "./utils";
import Board from "./Board";
import { firestore } from "./firebase";
import "./GameRoom.css";
import { Consumer } from "./userContext";

interface RoomResponse {
  isGameFull: boolean;
  moves: Move[];
}

export interface PieceOnBoard {
  value: ChessPiece;
  at: Square;
  isCaptured: boolean;
}

interface State {
  isWhiteTurn: boolean;
  pieces?: PieceOnBoard[];
  isGameFull: boolean;
  role: Role;
  isLoading: boolean;
  error?: string;
}

interface Props extends RouteComponentProps<{ roomId: string }> {
  userId?: string;
}

class GameRoom extends React.Component<Props, State> {
  public roomListenerUnsubscribe: Unsubscribe;
  public state: State = {
    isGameFull: true,
    isWhiteTurn: true,
    role: "spectator",
    isLoading: true
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
        const game = doc.data() as RoomResponse | undefined;
        if (game) {
          this.setState({
            isGameFull: game.isGameFull,
            isWhiteTurn: game.moves.length % 2 === 0,
            pieces: this.calculatePiecesFromMoves(game.moves),
            isLoading: false
          });
        } else {
          this.setState({
            isLoading: false,
            error: "This game does not exist",
            pieces: undefined
          });
        }
      });
  }

  public async componentWillReceiveProps(nextProps: Props) {
    if (nextProps.userId) {
      try {
        const response = await api.whoAmI({
          roomId: nextProps.match.params.roomId,
          userId: nextProps.userId
        });
        this.setState({ role: response.data.role });
      } catch (error) {
        // ignore error
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
        {this.state.isLoading && <p>Loading game room</p>}
        {this.state.error && <p className="error">{this.state.error}</p>}
        {this.state.pieces && (
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
        )}
      </div>
    );
  }
}

export default (props: Props) => (
  <Consumer>
    {({ state }: GlobalState) => <GameRoom {...props} userId={state.userId} />}
  </Consumer>
);
