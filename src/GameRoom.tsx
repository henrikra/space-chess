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
          console.log("hello");
          console.log(lol.data);
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
