import * as React from "react";
import { HashRouter as Router, Route } from "react-router-dom";

import GameRoom from "./GameRoom";
import Home from "./Home";
import { Provider } from "./userContext";
import marsSurface from "./img/mars-surface.svg";
import astronaut from "./img/astronautti.svg";
import spaceship from "./img/raketti.svg";
import spaceshipFire from "./img/raketin-liekki.svg";
import "./App.css";

const App = () => (
  <Provider>
    <Router>
      <div className="app">
        <Route exact={true} path="/" component={Home} />
        <Route path="/room/:roomId" component={GameRoom} />
        <img className="mars-surface" src={marsSurface} />
        <img className="astronaut" src={astronaut} />
        <div className="spaceship">
          <img className="spaceship__body" src={spaceship} />
          <img className="spaceship__fire" src={spaceshipFire} />
        </div>
      </div>
    </Router>
  </Provider>
);

export default App;
