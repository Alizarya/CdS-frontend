import "./Button.css"

import { Link } from 'react-router-dom';

const Button = ({ texte, to }) => {
  return (
    <Link to={to} className="button-cta">
      {texte}
    </Link>
  );
};

export default Button;
