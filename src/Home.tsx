import * as React from "react";
import { RouteComponentProps } from "react-router-dom";
import api from "./api";

interface State {
  isLoading: boolean;
}

export default class extends React.Component<RouteComponentProps<any>, State> {
  public state: State = {
    isLoading: false
  };

  public createNewGame = () => {
    this.setState({ isLoading: true });
    api
      .createChessRoom()
      .then(response => {
        this.props.history.push(`/room/${response.data.roomId}`);
      })
      .catch(error => {
        this.setState({ isLoading: false });
        alert(error.message);
      });
  };

  public render() {
    return (
      <div className="App">
        <h1 className="App-title">Welcome to play Chess</h1>
        <button onClick={this.createNewGame} disabled={this.state.isLoading}>
          {this.state.isLoading ? "Loading" : "Create new game"}
        </button>
      </div>
    );
  }
}
