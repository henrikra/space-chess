import { Unsubscribe } from "firebase";
import * as classNames from "classnames";
import * as React from "react";
import { RouteComponentProps } from "react-router";

import api, { Role } from "./api";
import { ChessPiece, Move, Square } from "./backendCommon/common";
import { initialPieces } from "./utils";
import Board from "./Board";
import { firestore } from "./firebase";
import "./GameRoom.css";
import { Consumer, UserContextProps } from "./userContext";
import MoveListItem from "./MoveListItem";

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
  moves?: Move[];
}

interface Props
  extends RouteComponentProps<{ roomId: string }>,
    UserContextProps {}

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
    this.checkMyRole(this.props.userId);

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
            isLoading: false,
            moves: game.moves
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
    this.checkMyRole(nextProps.userId);
  }

  public componentWillUnmount() {
    this.roomListenerUnsubscribe();
  }

  public checkMyRole = async (userId?: string) => {
    if (userId) {
      try {
        const response = await api.whoAmI({
          roomId: this.props.match.params.roomId,
          userId
        });
        this.setState({ role: response.data.role });
      } catch (error) {
        // ignore error
      }
    }
  };

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

  public setPieceHistory = (index: number) => {
    if (this.state.moves) {
      const newMoves = this.state.moves.slice(0, index + 1);
      this.setState({ pieces: this.calculatePiecesFromMoves(newMoves) });
    }
  };

  public render() {
    const {
      error,
      isGameFull,
      isLoading,
      pieces,
      role,
      isWhiteTurn
    } = this.state;

    return (
      <div>
        <h1>RoomId: {this.props.match.params.roomId}</h1>
        {!isGameFull &&
          role === "spectator" && (
            <button onClick={this.joinGame}>Join the game</button>
          )}
        {isLoading && <p>Loading game room</p>}
        {error && <p className="error">{error}</p>}
        {pieces && (
          <>
            {isGameFull && (
              <p
                className={classNames({
                  "whos-turn--active":
                    (isWhiteTurn && role === "white") ||
                    (!isWhiteTurn && role === "black")
                })}
              >
                {isWhiteTurn ? "White's turn" : "Black's turn"}
              </p>
            )}
            {role === "white" && <p>You are white</p>}
            {role === "black" && <p>You are black</p>}
            <Board
              pieces={pieces}
              roomId={this.props.match.params.roomId}
              userId={this.props.userId}
            />
            {this.state.moves && (
              <ol>
                {this.state.moves.map((move, index) => (
                  <MoveListItem
                    key={index}
                    index={index}
                    move={move}
                    onClick={this.setPieceHistory}
                  />
                ))}
              </ol>
            )}
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
