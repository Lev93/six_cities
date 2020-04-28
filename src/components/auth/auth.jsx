/* eslint-disable class-methods-use-this */
import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import is from 'is_js';
import { Trans, withTranslation } from 'react-i18next';
import axios from 'axios';
import qs from 'qs';
import { NavLink, withRouter } from 'react-router-dom';
import * as actions from '../../actions';
import Header from '../header/header.jsx';

const mapStateToProps = (state) => {
  const props = {
    user: state.user,
    city: state.city,
  };
  return props;
};

const actionCreators = {
  onChangeCity: actions.changeCity,
  onAddUser: actions.addUser,
};

const isInvalid = ({ valid, touched }) => !valid && touched;

class Auth extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      formControls: {
        email: {
          value: '',
          type: 'email',
          errorMessage: this.props.t('auth.emailerror'),
          valid: false,
          touched: false,
          validation: {
            required: true,
            email: true,
          },
        },
        password: {
          value: '',
          type: 'password',
          errorMessage: this.props.t('auth.passworderror'),
          valid: false,
          touched: false,
          validation: {
            required: true,
            minLength: 6,
          },
        },
      },
      isFormValid: false,
      error: false,
      errortext: '',
    };
  }

  validateControl(value, validation) {
    if (!validation) {
      return true;
    }

    let isValid = true;

    if (validation.required) {
      isValid = value.trim() !== '' && isValid;
    }

    if (validation.email) {
      isValid = is.email(value) && isValid;
    }

    if (validation.minLength) {
      isValid = value.length >= validation.minLength && isValid;
    }

    return isValid;
  }

  onChangeEmail = (event) => {
    event.preventDefault();
    const formControls = { ...this.state.formControls };
    const control = { ...this.state.formControls.email };

    control.value = event.target.value;
    control.touched = true;
    control.valid = this.validateControl(control.value, control.validation);

    formControls.email = control;
    let isFormValid = true;
    Object.keys(formControls).forEach((name) => {
      isFormValid = formControls[name].valid && isFormValid;
    });

    this.setState({
      formControls, isFormValid, error: false,
    });
  }

  onChangePassword = (event) => {
    event.preventDefault();
    const formControls = { ...this.state.formControls };
    const control = { ...this.state.formControls.password };

    control.value = event.target.value;
    control.touched = true;
    control.valid = this.validateControl(control.value, control.validation);

    formControls.password = control;
    let isFormValid = true;
    Object.keys(formControls).forEach((name) => {
      isFormValid = formControls[name].valid && isFormValid;
    });

    this.setState({
      formControls, isFormValid, error: false,
    });
  }

  handleClickCity = (city) => () => {
    this.props.onChangeCity(city);
  };

  loginHandler = (event) => {
    event.preventDefault();
    const {
      onAddUser,
    } = this.props;
    const data = {
      email: this.state.formControls.email.value,
      password: this.state.formControls.password.value,
    };
    try {
      axios({
        method: 'post',
        url: '/auth/login',
        data: qs.stringify(data),
      }).then((response) => {
        console.log(response);
        if (response.data.user && !response.data.error) {
          onAddUser(response.data.user);
          const expirationDate = new Date(new Date().getTime()
          + response.data.localstorage.expiresIn * 1000);
          localStorage.setItem('token', response.data.localstorage.token);
          localStorage.setItem('userId', response.data.user.id);
          localStorage.setItem('expirationDate', expirationDate);
          this.props.history.push('/');
        } else {
          this.setState({
            error: true,
            errortext: response.data.error,
          });
        }
      });
    } catch (e) {
      console.log(e);
    }
  }

  render() {
    const {
      user,
      t,
    } = this.props;
    const email = user.email || null;
    return (
      <div className="page page--gray page--login">
        <Header userEmail={email}/>
        <main className="page__main page__main--login">
        <div className="page__login-container container">
          <section className="login">
            <h1 className="login__title"><Trans>auth.signin</Trans></h1>
            <form className="login__form form" method="post" onSubmit={this.loginHandler}>
              <div className="login__input-wrapper form__input-wrapper">
                <label className="visually-hidden">E-mail</label>
                <input className="login__input form__input" type="email" name="email" placeholder={t('auth.email')} required=""
                value={this.state.formControls.email.value}
                onChange={this.onChangeEmail} />
                {isInvalid(this.state.formControls.email) ? <span className="login__error">{this.state.formControls.email.errorMessage}</span> : null }
              </div>
              <div className="login__input-wrapper form__input-wrapper">
                <label className="visually-hidden">Password</label>
                <input className="login__input form__input" type="password" name="password" placeholder={t('auth.password')} required=""
                value={this.state.formControls.password.value}
                onChange={(event) => this.onChangePassword(event)}/>
               {isInvalid(this.state.formControls.password) ? <span className="login__error">{this.state.formControls.password.errorMessage}</span> : null }
              </div>
              {this.state.error ? <span className="login__error"><Trans>{this.state.errortext}</Trans></span> : null }
              <button className="login__submit form__submit button" type="submit" disabled={!this.state.isFormValid}><Trans>auth.signin</Trans></button>
            </form>
          </section>
          <section className="locations locations--login locations--current">
            <div className="locations__item">
              <NavLink className="locations__item-link" to="/" onClick={ this.handleClickCity('Amsterdam')}>
                <span><Trans>cities.Amsterdam</Trans></span>
              </NavLink>
            </div>
          </section>
        </div>
      </main>
      </div>
    );
  }
}

Auth.propTypes = {
  user: PropTypes.shape({
    name: PropTypes.string,
    email: PropTypes.string,
    avatar: PropTypes.string,
  }),
  onChangeCity: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired,
  onAddUser: PropTypes.func.isRequired,
  history: PropTypes.shape({
    push: PropTypes.func,
  }),
};

export default connect(mapStateToProps, actionCreators)(withRouter(withTranslation()(Auth)));
