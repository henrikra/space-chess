import * as React from "react";
import * as classNames from "classnames";

import './Button.css';

interface Props {
  disabled?: boolean;
  size?: "normal" | "large";
  onClick(): void;
}

const Button: React.StatelessComponent<Props> = ({
  children,
  disabled,
  onClick,
  size
}) => (
  <button
    className={classNames("button", { "button--large": size === "large" })}
    onClick={onClick}
    disabled={disabled}
  >
    {children}
  </button>
);

Button.defaultProps = {
  size: "normal",
  disabled: false,
};

export default Button;
