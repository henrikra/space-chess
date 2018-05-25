import * as React from "react";
import { Unsubscribe } from "firebase";
import { auth } from "./firebase";

const UserContext = React.createContext();
const { Consumer } = UserContext;

interface State {
  userId?: string;
}

export interface UserContextProps {
  userId?: string;
}

class Provider extends React.Component<{}, State> {
  authListenerUnsubscribe: Unsubscribe;
  state: State = {};

  componentWillMount() {
    this.authListenerUnsubscribe = auth.onAuthStateChanged(user => {
      if (user) {
        this.setState({ userId: user.uid });
      } else {
        auth.signInAnonymously().catch(error => {
          alert(
            "We couldn't create account for you. For that reason you can only watch other people play"
          );
        });
      }
    });
  }

  componentWillUnmount() {
    this.authListenerUnsubscribe();
  }

  render() {
    return (
      <UserContext.Provider value={{ state: { userId: this.state.userId } }}>
        {this.props.children}
      </UserContext.Provider>
    );
  }
}

export { Provider, Consumer };
