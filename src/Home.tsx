import * as React from "react";
import { RouteComponentProps } from "react-router-dom";

import api from "./api";
import { Consumer, UserContextProps } from "./userContext";
import "./Home.css";
import Button from "./Button";

interface State {
  isLoading: boolean;
}

type Props = RouteComponentProps<{}> & UserContextProps;

class Home extends React.Component<Props, State> {
  state: State = {
    isLoading: false
  };

  createNewGame = () => {
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

  render() {
    return (
      <div className="home">
        <h1 className="title">Welcome to play Chess</h1>
        {this.props.userId ? (
          <Button onClick={this.createNewGame} disabled={this.state.isLoading} size="large">
            {this.state.isLoading ? "Loading" : "Create new game"}
          </Button>
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
