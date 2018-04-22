import * as React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";

import "./App.css";
import GameRoom from "./GameRoom";
import Home from "./Home";

const App = () => (
  <Router>
    <div>
      <Route exact={true} path="/" component={Home} />
      <Route path="/room/:roomId" component={GameRoom} />
    </div>
  </Router>
);

export default App;
