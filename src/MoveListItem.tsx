import * as React from "react";
import * as classNames from "classnames";
import { Move } from "./backendCommon/common";
import "./MoveListItem.css";

interface Props {
  move: Move;
  index: number;
  isActive: boolean;
  onClick(index: number): void;
}

class MoveListItem extends React.Component<Props> {
  onClick = () => {
    this.props.onClick(this.props.index);
  };

  render() {
    const { move } = this.props;
    return (
      <li
        className={classNames("move-list__item", {
          "move-list__item--active": this.props.isActive
        })}
        onClick={this.onClick}
      >
        {this.props.index + 1}.
        {move.from.file}
        {move.from.rank}
        {move.hasCaptureHappened ? "x" : "-"}
        {move.to.file}
        {move.to.rank}
      </li>
    );
  }
}

export default MoveListItem;
