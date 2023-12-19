import "./Button.css"

import { Link } from 'react-router-dom';

const Button = ({ texte, to, icon, openNewTab }) => {
  const linkProps = openNewTab ? { target: '_blank', rel: 'noopener noreferrer' } : {};

  return (
    <Link to={to} className="button-cta" {...linkProps}>
      {icon && <i className={icon}></i>}
      {texte}
    </Link>
  );
};


export default Button;
