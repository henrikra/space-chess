import * as React from "react";
import { HashRouter as Router, Route } from "react-router-dom";

import GameRoom from "./GameRoom";
import Home from "./Home";
import { Provider } from "./userContext";

const App = () => (
  <Provider>
    <Router>
      <>
        <Route exact={true} path="/" component={Home} />
        <Route path="/room/:roomId" component={GameRoom} />
      </>
    </Router>
  </Provider>
);

export default App;
