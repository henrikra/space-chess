import { Unsubscribe } from "firebase";
import * as classNames from "classnames";
import * as React from "react";
import { RouteComponentProps } from "react-router";

import api, { Role } from "./api";
import { ChessPiece, Move, Square, RoomModel } from "./backendCommon/common";
import { initialPieces } from "./utils";
import Board from "./Board";
import { firestore } from "./firebase";
import "./GameRoom.css";
import { Consumer, UserContextProps } from "./userContext";
import MoveListItem from "./MoveListItem";

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
  surrenderColor?: string;
  historyIndex?: number;
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
        const game = doc.data() as RoomModel | undefined;
        if (game) {
          this.setState({
            isGameFull: game.isGameFull,
            isWhiteTurn: game.moves.length % 2 === 0,
            pieces: this.calculatePiecesFromMoves(game.moves),
            isLoading: false,
            moves: game.moves,
            surrenderColor: game.surrenderColor
          });
          if (!!game.surrenderColor) {
            this.setPieceHistory(game.moves.length - 1);
            document.addEventListener("keydown", this.navigateInHistory);
          }
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
    document.removeEventListener("keydown", this.navigateInHistory);
  }

  public navigateInHistory = (event: KeyboardEvent) => {
    if (event.code === "ArrowLeft") {
      if (typeof this.state.historyIndex === "undefined") {
        if (this.state.moves) {
          this.setPieceHistory(this.state.moves.length - 1);
        }
      } else {
        const newValue =
          this.state.historyIndex === 0
            ? undefined
            : this.state.historyIndex - 1;
        this.setPieceHistory(newValue);
      }
    } else if (event.code === "ArrowRight") {
      if (typeof this.state.historyIndex === "undefined") {
        this.setPieceHistory(0);
      } else {
        const newValue =
          this.state.moves &&
          this.state.historyIndex === this.state.moves.length - 1
            ? undefined
            : this.state.historyIndex + 1;
        this.setPieceHistory(newValue);
      }
    }
  };

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

  public setPieceHistory = (index?: number) => {
    if (typeof index === "number" && this.state.moves) {
      const newMoves = this.state.moves.slice(0, index + 1);
      this.setState({
        pieces: this.calculatePiecesFromMoves(newMoves),
        historyIndex: index
      });
    } else {
      this.setState({
        historyIndex: undefined,
        pieces: this.calculatePiecesFromMoves([])
      });
    }
  };

  public confirmSurrender = () => {
    if (this.props.userId && confirm("Are you sure you want to surrender?")) {
      api.surrender({
        roomId: this.props.match.params.roomId,
        userId: this.props.userId
      });
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
    const isYourTurn =
      (isWhiteTurn && role === "white") || (!isWhiteTurn && role === "black");
    const isPlaying = role === "white" || role === "black";
    const isGameOver = !!this.state.surrenderColor;

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
            {isGameFull &&
              !isGameOver && (
                <p
                  className={classNames({
                    "whos-turn--active": isYourTurn
                  })}
                >
                  {isWhiteTurn ? "White's turn" : "Black's turn"}
                </p>
              )}
            {role === "white" && <p>You are white</p>}
            {role === "black" && <p>You are black</p>}
            {isPlaying &&
              isGameFull &&
              !isGameOver && (
                <button onClick={this.confirmSurrender}>Surrender</button>
              )}
            {isGameOver && (
              <p>
                Game over!{" "}
                {this.state.surrenderColor === "white" ? "White" : "Black"} won
                the game
              </p>
            )}
            <Board
              pieces={pieces}
              roomId={this.props.match.params.roomId}
              userId={this.props.userId}
              isYourTurn={isYourTurn}
              isPlaying={isPlaying}
            />
            {this.state.surrenderColor &&
              this.state.moves && (
                <ol>
                  {this.state.moves.map((move, index) => (
                    <MoveListItem
                      key={index}
                      index={index}
                      move={move}
                      onClick={this.setPieceHistory}
                      isActive={index === this.state.historyIndex}
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
