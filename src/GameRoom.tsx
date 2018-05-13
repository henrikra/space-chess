import * as firebase from "firebase";
import "firebase/firestore";
import * as React from "react";
import { RouteComponentProps } from "react-router";

import api, { Role } from "./api";
import { calculateNewBoard, initialBoard, Move } from "./backendCommon/common";
import ChessPiece from "./ChessPiece";
import env from "./env";
import "./GameRoom.css";
import withAuthentication, {
  WithAuthenticationProps
} from "./hocs/withAuthentication";

const playSound = (() => {
  const sound = new Audio(
    "data:audio/wav;base64,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qJrx4KOQjahZxWbcZgztj2c49nKmkId44S71j0c8eV9yDK6uPRzx5X18eDvjvQ6yKo9ZSS6l//8elePK/Lf//IInrOF/FvDoADYAGBMGb7FtErm5MXMlmPAJQVgWta7Zx2go+8xJ0UiCb8LHHdftWyLJE0QIAIsI+UbXu67dZMjmgDGCGl1H+vpF4NSDckSIkk7Vd+sxEhBQMRU8j/12UIRhzSaUdQ+rQU5kGeFxm+hb1oh6pWWmv3uvmReDl0UnvtapVaIzo1jZbf/pD6ElLqSX+rUmOQNpJFa/r+sa4e/pBlAABoAAAAA3CUgShLdGIxsY7AUABPRrgCABdDuQ5GC7DqPQCgbbJUAoRSUj+NIEig0YfyWUho1VBBBA//uQZB4ABZx5zfMakeAAAAmwAAAAF5F3P0w9GtAAACfAAAAAwLhMDmAYWMgVEG1U0FIGCBgXBXAtfMH10000EEEEEECUBYln03TTTdNBDZopopYvrTTdNa325mImNg3TTPV9q3pmY0xoO6bv3r00y+IDGid/9aaaZTGMuj9mpu9Mpio1dXrr5HERTZSmqU36A3CumzN/9Robv/Xx4v9ijkSRSNLQhAWumap82WRSBUqXStV/YcS+XVLnSS+WLDroqArFkMEsAS+eWmrUzrO0oEmE40RlMZ5+ODIkAyKAGUwZ3mVKmcamcJnMW26MRPgUw6j+LkhyHGVGYjSUUKNpuJUQoOIAyDvEyG8S5yfK6dhZc0Tx1KI/gviKL6qvvFs1+bWtaz58uUNnryq6kt5RzOCkPWlVqVX2a/EEBUdU1KrXLf40GoiiFXK///qpoiDXrOgqDR38JB0bw7SoL+ZB9o1RCkQjQ2CBYZKd/+VJxZRRZlqSkKiws0WFxUyCwsKiMy7hUVFhIaCrNQsKkTIsLivwKKigsj8XYlwt/WKi2N4d//uQRCSAAjURNIHpMZBGYiaQPSYyAAABLAAAAAAAACWAAAAApUF/Mg+0aohSIRobBAsMlO//Kk4soosy1JSFRYWaLC4qZBYWFRGZdwqKiwkNBVmoWFSJkWFxX4FFRQWR+LsS4W/rFRb/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////VEFHAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAU291bmRib3kuZGUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMjAwNGh0dHA6Ly93d3cuc291bmRib3kuZGUAAAAAAAAAACU="
  );
  return () => {
    sound.play();
  };
})();

firebase.initializeApp(env.firebase);

const firestore = firebase.firestore();
firestore.settings({ timestampsInSnapshots: true });

interface IRoomResponse {
  isGameFull: boolean;
  moves: Move[];
}

interface IState {
  isWhiteTurn: boolean;
  board?: number[];
  activeIndex?: number;
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

  public componentWillMount() {
    this.roomListenerUnsubscribe = firestore
      .collection("rooms")
      .doc(this.props.match.params.roomId)
      .onSnapshot(doc => {
        const game = doc.data() as IRoomResponse;
        const newBoard = calculateNewBoard(initialBoard, game.moves);

        this.setState({
          board: newBoard.filter(piece => piece !== -1),
          isGameFull: game.isGameFull,
          isWhiteTurn: game.moves.length % 2 === 0
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

  public componentDidUpdate(prevProps: IProps, prevState: IState) {
    const hasBoardChanged =
      this.state.board &&
      !this.state.board.every(
        (piece, index) => !!prevState.board && prevState.board[index] === piece
      );
    if (prevState.board && hasBoardChanged) {
      playSound();
    }
  }

  public componentWillUnmount() {
    this.roomListenerUnsubscribe();
  }

  public calculateRank = (index: number) => {
    if (index < 8) {
      return 8;
    } else if (index < 16) {
      return 7;
    } else if (index < 24) {
      return 6;
    } else if (index < 32) {
      return 5;
    } else if (index < 40) {
      return 4;
    } else if (index < 48) {
      return 3;
    } else if (index < 56) {
      return 2;
    } else {
      return 1;
    }
  };

  public calculateFile = (index: number) => {
    if (index % 8 === 0) {
      return "a";
    } else if ((index - 1) % 8 === 0) {
      return "b";
    } else if ((index - 2) % 8 === 0) {
      return "c";
    } else if ((index - 3) % 8 === 0) {
      return "d";
    } else if ((index - 4) % 8 === 0) {
      return "e";
    } else if ((index - 5) % 8 === 0) {
      return "f";
    } else if ((index - 6) % 8 === 0) {
      return "g";
    } else {
      return "h";
    }
  };

  public selectSquare = (index: number) => {
    if (this.state.activeIndex === index) {
      this.setState({ activeIndex: undefined });
    } else if (
      typeof this.state.activeIndex === "number" &&
      this.props.userId
    ) {
      api
        .movePiece(
          this.props.match.params.roomId,
          this.props.userId,
          {
            file: this.calculateFile(this.state.activeIndex),
            rank: this.calculateRank(this.state.activeIndex)
          },
          {
            file: this.calculateFile(index),
            rank: this.calculateRank(index)
          }
        )
        .then((lol: any) => {
          this.setState({ activeIndex: undefined });
        })
        .catch(error => {
          this.setState({ activeIndex: undefined });
          alert(error.response.data.error);
        });
    } else {
      this.setState({ activeIndex: index });
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

  public isDark = (index: number) => {
    const isEvenRow = Math.floor(index / 8) % 2 === 0;
    const isEvenFile = index % 2 === 0;
    return isEvenRow ? !isEvenFile : isEvenFile;
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
        {this.state.board ? (
          <>
            <div className="board">
              {this.state.board.map((chessPiece, index) => (
                <ChessPiece
                  key={index}
                  chessPiece={chessPiece}
                  index={index}
                  onPress={this.selectSquare}
                  isActive={this.state.activeIndex === index}
                  isDark={this.isDark(index)}
                />
              ))}
            </div>
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
