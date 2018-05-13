import * as firebase from "firebase";
import * as React from "react";

interface State {
  userId?: string;
}

export interface WithAuthenticationProps {
  userId?: string;
}

function withAuthentication<T>(
  WrappedComponent: React.ComponentType<T & WithAuthenticationProps>
) {
  return class extends React.Component<T, State> {
    public state: State = {};
    public authListenerUnsubscribe: firebase.Unsubscribe;

    public componentWillMount() {
      this.authListenerUnsubscribe = firebase
        .auth()
        .onAuthStateChanged(user => {
          if (user) {
            this.setState({ userId: user.uid });
          } else {
            firebase
              .auth()
              .signInAnonymously()
              .catch(error => {
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
      return <WrappedComponent userId={this.state.userId} {...this.props} />;
    }
  };
}

export default withAuthentication;
