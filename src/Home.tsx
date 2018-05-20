import * as React from "react";
import { RouteComponentProps } from "react-router-dom";

import api from "./api";
import { Consumer, UserContextProps } from "./userContext";

interface State {
  isLoading: boolean;
}

interface Props extends RouteComponentProps<{}>, UserContextProps {}

class Home extends React.Component<Props, State> {
  public state: State = {
    isLoading: false
  };

  public createNewGame = () => {
    if (this.props.userId) {
      this.setState({ isLoading: true });
      api
        .createChessRoom(this.props.userId)
        .then(response => {
          this.props.history.push(`/room/${response.data.roomId}`);
        })
        .catch(error => {
          this.setState({ isLoading: false });
          alert(error.message);
        });
    }
  };

  public render() {
    return (
      <div className="App">
        <h1 className="App-title">Welcome to play Chess</h1>
        {this.props.userId ? (
          <button onClick={this.createNewGame} disabled={this.state.isLoading}>
            {this.state.isLoading ? "Loading" : "Create new game"}
          </button>
        ) : (
          <p>Please wait...</p>
        )}
      </div>
    );
  }
}

export default (props: Props) => (
  <Consumer>
    {({ state }: GlobalState) => <Home {...props} userId={state.userId} />}
  </Consumer>
);
