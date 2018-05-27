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
import { Link } from "react-router-dom";
import saturn from "./img/saturnus.svg";
import { createPieceImageUrl } from "./BoardPiece";

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
  winnerColor?: string;
  historyIndex?: number;
  isJoinGameLoading: boolean;
  isSurrenderLoading: boolean;
}

interface Props
  extends RouteComponentProps<{ roomId: string }>,
    UserContextProps {}

class GameRoom extends React.Component<Props, State> {
  roomListenerUnsubscribe: Unsubscribe;
  state: State = {
    isGameFull: true,
    isWhiteTurn: true,
    role: "spectator",
    isLoading: true,
    isJoinGameLoading: false,
    isSurrenderLoading: false
  };

  calculatePiecesFromMoves = (moves: Move[]) => {
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

  componentWillMount() {
    document.addEventListener("keydown", this.navigateInHistory);
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
            winnerColor: game.winnerColor
          });
          if (!!game.winnerColor) {
            this.setPieceHistory(game.moves.length - 1);
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

  componentWillReceiveProps(nextProps: Props) {
    this.checkMyRole(nextProps.userId);
  }

  componentWillUnmount() {
    this.roomListenerUnsubscribe();
    document.removeEventListener("keydown", this.navigateInHistory);
  }

  navigateInHistory = (event: KeyboardEvent) => {
    if (!this.state.winnerColor) {
      return;
    }
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

  checkMyRole = async (userId?: string) => {
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

  joinGame = async () => {
    if (this.props.userId) {
      this.setState({ isJoinGameLoading: true });
      try {
        const response = await api.joinGame(
          this.props.match.params.roomId,
          this.props.userId
        );
        this.setState({ role: response.data.role, isJoinGameLoading: false });
      } catch (error) {
        this.setState({ isJoinGameLoading: false });
        alert(error.response.data.error);
      }
    }
  };

  setPieceHistory = (index?: number) => {
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

  confirmSurrender = async () => {
    if (this.props.userId && confirm("Are you sure you want to surrender?")) {
      this.setState({ isSurrenderLoading: true });
      try {
        await api.surrender({
          roomId: this.props.match.params.roomId,
          userId: this.props.userId
        });
        this.setState({ isSurrenderLoading: false });
      } catch (error) {
        this.setState({ isSurrenderLoading: false });
      }
    }
  };

  render() {
    const {
      error,
      isGameFull,
      isLoading,
      pieces,
      role,
      isWhiteTurn,
      isJoinGameLoading,
      isSurrenderLoading
    } = this.state;
    const isYourTurn =
      (isWhiteTurn && role === "white") || (!isWhiteTurn && role === "black");
    const isPlaying = role === "white" || role === "black";
    const isGameOver = !!this.state.winnerColor;

    return (
      <div className="game-room">
        <nav>
          <Link to="/">Back to lobby</Link>
        </nav>
        {!isGameFull && (
          <p>Invite your friend to this game by sending the link</p>
        )}
        {!isGameFull &&
          role === "spectator" && (
            <button
              className="surrender-button"
              onClick={this.joinGame}
              disabled={isJoinGameLoading}
            >
              {isJoinGameLoading ? "Joining" : "Join the game"}
            </button>
          )}
        {isLoading && (
          <div className="spinner">
            <div className="spinner__container">
              <img className="spinner__image" src={saturn} />
              <p className="spinner__text">Loading game room</p>
            </div>
          </div>
        )}
        {error && <p className="error">{error}</p>}
        {pieces && (
          <>
            {isPlaying &&
              isGameFull &&
              !isGameOver && (
                <button
                  className="surrender-button"
                  onClick={this.confirmSurrender}
                  disabled={isSurrenderLoading}
                >
                  {isSurrenderLoading ? "Surrendering" : "Surrender"}
                </button>
              )}
            {isGameOver && (
              <>
                <div className="winner">
                  <img
                    className=""
                    src={createPieceImageUrl(
                      "king",
                      this.state.winnerColor === "white" ? "ffffff" : "000000"
                    )}
                  />
                </div>
                <p className="your-turn-text">
                  {this.state.winnerColor === "white" ? "White" : "Black"} won
                  the game!
                </p>
              </>
            )}
            <Board
              pieces={pieces}
              roomId={this.props.match.params.roomId}
              userId={this.props.userId}
              isYourTurn={isYourTurn}
              isPlaying={isPlaying}
            />
            {isGameFull &&
              !isGameOver && (
                <>
                  <h3>Who's turn</h3>
                  <div className="turn-switch">
                    <div
                      className={classNames("turn-switch__item", {
                        "turn-switch__image--active": isWhiteTurn
                      })}
                    >
                      <img
                        className="turn-switch__image"
                        src={createPieceImageUrl("king", "ffffff")}
                      />
                      <span>White</span>
                    </div>
                    <div
                      className={classNames("turn-switch__item", {
                        "turn-switch__image--active": !isWhiteTurn
                      })}
                    >
                      <img
                        className="turn-switch__image"
                        src={createPieceImageUrl("king", "000000")}
                      />
                      <span>Black</span>
                    </div>
                  </div>
                  {isYourTurn && (
                    <p className="your-turn-text">It is your turn!</p>
                  )}
                </>
              )}
            {/* {role === "white" && <p>You are white</p>}
            {role === "black" && <p>You are black</p>} */}
            {/* {isGameFull &&
              !isGameOver && (
                <p
                  className={classNames({
                    "whos-turn--active": isYourTurn
                  })}
                >
                  {isWhiteTurn ? "White's turn" : "Black's turn"}
                </p>
              )} */}
            {isGameOver &&
              this.state.moves && (
                <ol className="moves-history">
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
