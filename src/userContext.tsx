import * as React from "react";
import { Unsubscribe } from "firebase";
import { auth } from "./firebase";
import Store from "./store";

const UserContext = React.createContext();
const { Consumer } = UserContext;

interface State {
  userId?: string;
}

class Provider extends React.Component<any, State> {
  public store = Store;

  public authListenerUnsubscribe: Unsubscribe;
  public state: State = {
    userId: this.store.getUser()
  };

  public componentWillMount() {
    this.authListenerUnsubscribe = auth.onAuthStateChanged(user => {
      if (user) {
        this.store.setUser(user.uid);
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

  public componentWillUnmount() {
    this.authListenerUnsubscribe();
  }

  public render() {
    return (
      <UserContext.Provider value={{ state: { userId: this.state.userId } }}>
        {this.props.children}
      </UserContext.Provider>
    );
  }
}

export { Provider, Consumer };
