import * as classNames from "classnames";
import * as React from "react";

import "./BoardSquare.css";

interface Props {
  index: number;
  isActive: boolean;
  isDark: boolean;
  isPlaying: boolean;
  onPress(index: number): void;
}

class BoardSquare extends React.Component<Props> {
  onClick = () => {
    this.props.onPress(this.props.index);
  };

  render() {
    return (
      <div
        className={classNames("board-square", {
          "board-square--active": this.props.isActive,
          "board-square--dark": this.props.isDark,
          "board-square--playing": this.props.isPlaying
        })}
        onClick={this.onClick}
      />
    );
  }
}

export default BoardSquare;
