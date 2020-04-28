import React from 'react';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const Header = (props) => {
  const { userEmail, handleLogout } = props;
  const { t } = useTranslation();
  return <header className="header">
  <div className="container">
    <div className="header__wrapper">
      <div className="header__left">
        <NavLink className="header__logo-link header__logo-link--active" to="/" exact>
          <img className="header__logo" src="../img/logo.svg" alt="6 cities logo" width="81" height="41" />
        </NavLink>
      </div>
      <nav className="header__nav">
        <ul className="header__nav-list">
          <li className="header__nav-item user">
            <NavLink className="header__nav-link header__nav-link--profile" to="/login">
              <div className="header__avatar-wrapper user__avatar-wrapper">
              </div>
              {userEmail ? <span className="header__user-name user__name">{ userEmail }&nbsp;</span> : <span className="header__login">{t('Autorisation')}&nbsp;</span>}
            </NavLink>
            </li>
            <li className="header__nav-item user">
              {userEmail ? <button className="logout" onClick = {handleLogout}></button> : null}
            </li>
            <li className="header__nav-item user">
            <NavLink className="header__nav-link header__nav-link--profile" to="/registration">
              <span className="header__login">{t('auth.signup')}</span>
            </NavLink>
          </li>
        </ul>
      </nav>
    </div>
  </div>
</header>;
};

Header.propTypes = {
  userEmail: PropTypes.string,
  handleLogout: PropTypes.func.isRequired,
};

export default Header;
