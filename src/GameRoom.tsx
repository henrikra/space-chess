import { Unsubscribe } from "firebase";
import * as classNames from "classnames";
import * as React from "react";
import { RouteComponentProps } from "react-router";
import { Link } from "react-router-dom";

import api, { Role } from "./api";
import { Move, RoomModel } from "./backendCommon/common";
import { calculatePiecesFromMoves } from "./pieceUtils";
import Board from "./Board";
import { firestore } from "./firebase";
import "./GameRoom.css";
import { Consumer, UserContextProps } from "./userContext";
import MoveListItem from "./MoveListItem";
import saturn from "./img/saturnus.svg";
import { GlobalState, PieceOnBoard } from "./types";
import Button from "./Button";
import { createPieceImageUrl } from "./boardUtils";

interface State {
  isWhiteTurn: boolean;
  pieces?: PieceOnBoard[];
  isGameFull: boolean;
  role: Role;
  isLoadingGame: boolean;
  error?: string;
  moves?: Move[];
  winnerColor?: string;
  historyIndex?: number;
  isJoinGameLoading: boolean;
  isSurrenderLoading: boolean;
}

type Props = RouteComponentProps<{ roomId: string }> & UserContextProps;

class GameRoom extends React.Component<Props, State> {
  roomListenerUnsubscribe: Unsubscribe;
  state: State = {
    isGameFull: true,
    isWhiteTurn: true,
    role: "spectator",
    isLoadingGame: true,
    isJoinGameLoading: false,
    isSurrenderLoading: false
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
            pieces: calculatePiecesFromMoves(game.moves),
            isLoadingGame: false,
            moves: game.moves,
            winnerColor: game.winnerColor
          });
          if (!!game.winnerColor) {
            this.setPieceHistory(game.moves.length - 1);
          }
        } else {
          this.setState({
            isLoadingGame: false,
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
    if (!this.state.winnerColor || !this.state.moves) {
      return;
    }
    if (event.code === "ArrowLeft") {
      if (typeof this.state.historyIndex === "undefined") {
        this.setPieceHistory(this.state.moves.length - 1);
      } else {
        const newHistoryIndex =
          this.state.historyIndex === 0
            ? undefined
            : this.state.historyIndex - 1;
        this.setPieceHistory(newHistoryIndex);
      }
    } else if (event.code === "ArrowRight") {
      if (typeof this.state.historyIndex === "undefined") {
        this.setPieceHistory(0);
      } else {
        const newHistoryIndex =
          this.state.historyIndex === this.state.moves.length - 1
            ? undefined
            : this.state.historyIndex + 1;
        this.setPieceHistory(newHistoryIndex);
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
        historyIndex: index,
        pieces: calculatePiecesFromMoves(newMoves)
      });
    } else {
      this.setState({
        historyIndex: undefined,
        pieces: calculatePiecesFromMoves([])
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
      isLoadingGame,
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
            <Button onClick={this.joinGame} disabled={isJoinGameLoading}>
              {isJoinGameLoading ? "Joining" : "Join the game"}
            </Button>
          )}
        {isLoadingGame && (
          <div className="spinner">
            <img className="spinner__image" src={saturn} />
            <p className="spinner__text">Loading game room</p>
          </div>
        )}
        {error && <p className="error">{error}</p>}
        {pieces && (
          <>
            {isPlaying &&
              isGameFull &&
              !isGameOver && (
                <Button
                  onClick={this.confirmSurrender}
                  disabled={isSurrenderLoading}
                >
                  {isSurrenderLoading ? "Surrendering" : "Surrender"}
                </Button>
              )}
            {isGameOver && (
              <>
                <div className="winner">
                  <img
                    src={createPieceImageUrl(
                      "king",
                      this.state.winnerColor === "white" ? "ffffff" : "000000"
                    )}
                  />
                </div>
                <p className="highlighted-text">
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
                        "turn-switch__item--active": isWhiteTurn
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
                        "turn-switch__item--active": !isWhiteTurn
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
                    <p className="highlighted-text">It is your turn!</p>
                  )}
                </>
              )}
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
