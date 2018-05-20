import * as classNames from "classnames";
import * as React from "react";

interface Props {
  index: number;
  isActive: boolean;
  isDark: boolean;
  onPress(index: number): void;
}

class BoardSquare extends React.Component<Props> {
  public onClick = () => {
    this.props.onPress(this.props.index);
  };

  public render() {
    return (
      <div
        className={classNames("square", {
          "square--active": this.props.isActive,
          "square--dark": this.props.isDark
        })}
        onClick={this.onClick}
      />
    );
  }
}

export default BoardSquare;
