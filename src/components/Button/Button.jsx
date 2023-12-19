import "./Button.css"

import { Link } from 'react-router-dom';

const Button = ({ texte, to, icon, openNewTab, type }) => {
  if (to) {
    const linkProps = openNewTab ? { target: '_blank', rel: 'noopener noreferrer' } : {};
    return (
      <Link to={to} className="button-cta" {...linkProps}>
        {icon && <i className={icon}></i>}
        {texte}
      </Link>
    );
  } else {
    return (
      <button type={type} className="button-cta">
        {icon && <i className={icon}></i>}
        {texte}
      </button>
    );
  }
};


export default Button;
