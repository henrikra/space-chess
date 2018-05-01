import * as React from "react";
import { RouteComponentProps } from "react-router-dom";
import api from "./api";

interface IProps extends RouteComponentProps<any> {}

export default class extends React.Component<IProps> {
  public createNewGame = () => {
    api.createChessRoom()
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
