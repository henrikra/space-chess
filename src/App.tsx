import * as React from "react";
import { HashRouter as Router, Route } from "react-router-dom";

import GameRoom from "./GameRoom";
import Home from "./Home";
import { Provider } from "./userContext";
import lol from './img/ala-graffa.svg';
import spaceMan from './img/astronaut.svg';
import spaceship from './img/runko.svg';
import spaceshipFire from './img/raketin-liekki.svg';

const App = () => (
  <Provider>
    <Router>
      <div className="home">
        <Route exact={true} path="/" component={Home} />
        <Route path="/room/:roomId" component={GameRoom} />
        <img className="bottom-space" src={lol} />
        <img className="space-man" src={spaceMan} />
        <div className="spaceship-container">
          <img className="spaceship" src={spaceship} />
          <img className="spaceship__fire" src={spaceshipFire} />
        </div>
      </div>
    </Router>
  </Provider>
);

export default App;
