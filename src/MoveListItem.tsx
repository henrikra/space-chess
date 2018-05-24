import * as React from "react";
import { Move } from "./backendCommon/common";

interface Props {
  move: Move;
  index: number;
  onClick(index: number): void;
}

class MoveListItem extends React.Component<Props> {
  public onClick = () => {
    this.props.onClick(this.props.index);
  };

  public render() {
    const { move } = this.props;
    return (
      <li onClick={this.onClick}>
        {move.from.file}
        {move.from.rank}-{move.to.file}
        {move.to.rank}
      </li>
    );
  }
}

export default MoveListItem;
