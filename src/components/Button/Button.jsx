import "./Button.css";

import { Link } from "react-router-dom";

const Button = ({
  texte,
  to,
  icon,
  openNewTab,
  type = "button",
  onClick,
  disabled = false,
  ...props
}) => {
  const handleClick = (e) => {
    if (disabled) {
      e.preventDefault();
      return;
    }

    if (onClick) {
      onClick(e);
    }
  };

  if (to) {
    const linkProps = openNewTab
      ? { target: "_blank", rel: "noopener noreferrer" }
      : {};

    return (
      <Link
        to={to}
        className="button-cta"
        {...linkProps}
        {...props}
      >
        {icon && <i className={icon}></i>}
        {texte}
      </Link>
    );
  }

  return (
    <button
      type={type}
      className="button-cta"
      onClick={handleClick}
      disabled={disabled}
      {...props}
    >
      {icon && <i className={icon}></i>}
      {texte}
    </button>
  );
};

export default Button;