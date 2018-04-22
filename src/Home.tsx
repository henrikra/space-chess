import axios from "axios";
import * as React from "react";
import { RouteComponentProps } from "react-router-dom";

interface IProps extends RouteComponentProps<any> {}

interface IAddRoomResponse {
  roomId: string;
}

export default class extends React.Component<IProps> {
  public createNewGame = () => {
    axios
      .get<IAddRoomResponse>(
        "https://us-central1-fire-chess-9825d.cloudfunctions.net/addRoom"
      )
      .then(response => {
        this.props.history.push(`/room/${response.data.roomId}`);
      })
      .catch((error) => {
        alert(error.message)}
      );
  };

  public render() {
    return (
      <div className="App">
        <h1 className="App-title">Welcome to play Chess</h1>
        <button onClick={this.createNewGame}>Create new game</button>
      </div>
    );
  }
}
