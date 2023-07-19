import { Link } from "react-router-dom";
import logo from "../../images/header__logo.svg";
import { useState } from "react";

export default function Header({ loggedIn, email, onLogout }) {
  const [isSigninUp, setIsSigninUp] = useState(false);
  const handleAuthClick = () => {
    setIsSigninUp(!isSigninUp);
  };
  return (
    <header className="header">
      <img src={logo} alt="Логотип" className="header__logo" />
      <div className="header__data">
        {loggedIn && <div className="header__email">{email}</div>}
        {loggedIn ? (
          <Link className="header__link" onClick={onLogout} to="/sign-in">
            Выйти
          </Link>
        ) : (
          <>
            {isSigninUp ? (
              <Link
                className="header__link"
                onClick={handleAuthClick}
                to="/sign-in"
              >
                Выйти
              </Link>
            ) : (
              <Link
                className="header__link"
                onClick={handleAuthClick}
                to="/sign-up"
              >
                Регистрация
              </Link>
            )}
          </>
        )}
      </div>
    </header>
  );
}
