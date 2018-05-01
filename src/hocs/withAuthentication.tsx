import * as firebase from "firebase";
import * as React from 'react';

function withAuthentication<T>(WrappedComponent: React.ComponentType<T>) {
  return class extends React.Component<T> {
    public authListenerUnsubscribe: firebase.Unsubscribe

    public componentWillMount() {
      this.authListenerUnsubscribe = firebase.auth().onAuthStateChanged(user => {
        if (!user) {
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
      return <WrappedComponent {...this.props} />;
    }
  };
}

export default withAuthentication;