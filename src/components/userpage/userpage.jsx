/* eslint-disable class-methods-use-this */
/* eslint no-underscore-dangle: 0 */
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Trans } from 'react-i18next';
import { NavLink } from 'react-router-dom';
import axios from 'axios';
import qs from 'qs';
import Header from '../header/header.jsx';
import * as actions from '../../actions';

const mapStateToProps = (state) => {
  const props = {
    user: state.user,
    city: state.city,
    sortWindow: state.sortWindow,
    activeOfferId: state.activeOfferId,
  };
  return props;
};

const actionCreators = {
  onChangeCity: actions.changeCity,
  onOpenSort: actions.openSort,
  onActiveOffer: actions.activeOffer,
  onAddUser: actions.addUser,
};

class UserPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoaded: false,
      apartaments: [],
      bookmarks: [],
    };
  }

  componentDidMount() {
    const { user } = this.props;
    const data = {
      apart: user.apartaments.items,
      book: user.bookmarks.items,
    };
    axios({
      method: 'post',
      url: '/items/getitems',
      data: qs.stringify(data),
    }).then((response) => {
      this.setState({
        isLoaded: true,
        apartaments: [...response.data.apartaments],
        bookmarks: [...response.data.bookmarks],
      });
    });
  }

  componentDidUpdate(prevProps) {
    if (this.props.user !== prevProps.user) {
      const { user } = this.props;
      const data = {
        apart: user.apartaments.items,
        book: user.bookmarks.items,
      };
      axios({
        method: 'post',
        url: '/items/getitems',
        data: qs.stringify(data),
      }).then((response) => {
        this.setState({
          isLoaded: true,
          apartaments: [...response.data.apartaments],
          bookmarks: [...response.data.bookmarks],
        });
      });
    }
  }

  handleClickCity = (city) => () => {
    this.props.onChangeCity(city);
  };

  handleClickBookmark = (item) => () => {
    const { user } = this.props;
    if (!user.id) {
      return;
    }
    const data = {
      itemId: item._id,
      userId: user.id,
    };
    axios({
      method: 'post',
      url: '/auth/deletebookmark',
      data: qs.stringify(data),
    }).then((response) => {
      this.props.onAddUser(response.data.user);
    });
  };

  renderempty(text) {
    return <main className="page__main page__main--favorites page__main--favorites-empty">
    <div className="page__favorites-container container">
      <section className="favorites favorites--empty">
        <h1 className="visually-hidden">Favorites (empty)</h1>
        <div className="favorites__status-wrapper">
          <b className="favorites__status"><Trans>userpage.nothing</Trans></b>
          <p className="favorites__status-description"><Trans>userpage.{text}</Trans></p>
        </div>
      </section>
    </div>
  </main>;
  }

  renderHousing(item) {
    const { onActiveOffer } = this.props;
    const rating = { width: `${item.rating * 20}%` };
    return <article className="favorites__card place-card">
    <div className="favorites__image-wrapper place-card__image-wrapper">
      <a href="#">
        <img className="place-card__image" src={item.mainImg} width="150" height="110" alt="Place image" />
      </a>
    </div>
    <div className="favorites__card-info place-card__info">
      <div className="place-card__price-wrapper">
        <div className="place-card__price">
          <b className="place-card__price-value">&euro;{item.price}</b>
          <span className="place-card__price-text">&#47;&nbsp;<Trans>night</Trans></span>
        </div>
      </div>
      <div className="place-card__rating rating">
        <div className="place-card__stars rating__stars">
          <span style={rating}></span>
          <span className="visually-hidden">Rating</span>
        </div>
      </div>
      <h2 className="place-card__name">
        <NavLink to={`/offer/${item._id}`} onClick={ () => onActiveOffer(item._id) }>{item.title}</NavLink>
      </h2>
      <p className="place-card__type"><Trans>{item.type}</Trans></p>
    </div>
  </article>;
  }

  renderBookmark(item) {
    const { onActiveOffer } = this.props;
    const rating = { width: `${item.rating * 20}%` };
    return <article className="favorites__card place-card">
    <div className="favorites__image-wrapper place-card__image-wrapper">
      <a href="#">
        <img className="place-card__image" src={item.mainImg} width="150" height="110" alt="Place image" />
      </a>
    </div>
    <div className="favorites__card-info place-card__info">
      <div className="place-card__price-wrapper">
        <div className="place-card__price">
          <b className="place-card__price-value">&euro;{item.price}</b>
          <span className="place-card__price-text">&#47;&nbsp;<Trans>night</Trans></span>
        </div>
        <button className="place-card__bookmark-button place-card__bookmark-button--active button" type="button" onClick={this.handleClickBookmark(item)}>
          <svg className="place-card__bookmark-icon" width="18" height="19">
            <use xlinkHref="#icon-bookmark"></use>
          </svg>
          <span className="visually-hidden">In bookmarks</span>
        </button>
      </div>
      <div className="place-card__rating rating">
        <div className="place-card__stars rating__stars">
          <span style={rating}></span>
          <span className="visually-hidden">Rating</span>
        </div>
      </div>
      <h2 className="place-card__name">
        <NavLink to={`/offer/${item._id}`} onClick={ () => onActiveOffer(item._id) }>{item.title}</NavLink>
      </h2>
      <p className="place-card__type"><Trans>{item.type}</Trans></p>
    </div>
  </article>;
  }

  renderBookmarkscity(city) {
    return <li className="favorites__locations-items">
      <div className="favorites__locations locations locations--current">
        <div className="locations__item">
          <NavLink className="locations__item-link" to="/" onClick={ this.handleClickCity(city)}>
            <span><Trans>cities.{city}</Trans></span>
          </NavLink>
          </div>
        </div>
        <div className="favorites__places">
        {this.state.bookmarks.map((item) => {
          if (item.city === city) {
            return this.renderBookmark(item);
          }
          return null;
        })}
        </div>
    </li>;
  }

  renderApartamentsCity(city) {
    return <li className="favorites__locations-items">
      <div className="favorites__locations locations locations--current">
        <div className="locations__item">
          <NavLink className="locations__item-link" to="/" onClick={ this.handleClickCity(city)}>
            <span><Trans>cities.{city}</Trans></span>
          </NavLink>
          </div>
        </div>
        <div className="favorites__places">
        {this.state.apartaments.map((item) => {
          if (item.city === city) {
            return this.renderHousing(item);
          }
          return null;
        })}
        </div>
    </li>;
  }

  renderBookmarks() {
    const cities = ['Paris', 'Cologne', 'Brussels', 'Amsterdam', 'Hamburg', 'Dusseldorf'];
    return <main className="page__main page__main--favorites">
    <div className="page__favorites-container container">
      <section className="favorites">
        <h1 className="favorites__title"><Trans>savedlisting</Trans></h1>
        <ul className="favorites__list">
          {cities.map((city) => {
            const result = this.state.bookmarks.filter((el) => el.city === city);
            if (result.length > 0) {
              return this.renderBookmarkscity(city);
            }
            return null;
          })
          }
        </ul>
      </section>
    </div>
  </main>;
  }

  renderApartaments() {
    const cities = ['Paris', 'Cologne', 'Brussels', 'Amsterdam', 'Hamburg', 'Dusseldorf'];
    return <main className="page__main page__main--favorites">
    <div className="page__favorites-container container">
      <section className="favorites">
        <h1 className="favorites__title"><Trans>yourhousing</Trans></h1>
        <ul className="favorites__list">
          {cities.map((city) => {
            const result = this.state.apartaments.filter((el) => el.city === city);
            if (result.length > 0) {
              return this.renderApartamentsCity(city);
            }
            return null;
          })
          }
        </ul>
      </section>
    </div>
  </main>;
  }

  render() {
    const {
      user,
    } = this.props;
    return (
    <div className="page">
      <Header userEmail={user.email}/>
     {user.bookmarks.items.length > 0 ? this.renderBookmarks() : this.renderempty('nothingtext')}
     {user.apartaments.items.length > 0 ? this.renderApartaments() : this.renderempty('nothingapartamentstext')}
     <div className="center">
       <NavLink className="property__mark" to="/items/add">
          <span><Trans>userpage.addhousing</Trans></span>
        </NavLink>
      </div>
      <footer className="footer">
        <a className="footer__logo-link" href="main.html">
          <img className="footer__logo" src="../img/logo.svg" alt="6 cities logo" width="64" height="33" />
        </a>
      </footer>
    </div>
    );
  }
}

UserPage.propTypes = {
  user: PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string,
    email: PropTypes.string,
    avatar: PropTypes.string,
    pro: PropTypes.bool,
    bookmarks: PropTypes.arrayOf(PropTypes.string),
    apartaments: PropTypes.arrayOf(PropTypes.string),
  }),
  apartament: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    mainImg: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    rating: PropTypes.number.isRequired,
    premium: PropTypes.bool.isRequired,
  }),
  onActiveOffer: PropTypes.func.isRequired,
  activeOfferId: PropTypes.string,
  city: PropTypes.string.isRequired,
  onChangeCity: PropTypes.func.isRequired,
  onAddUser: PropTypes.func.isRequired,
};

export default connect(mapStateToProps, actionCreators)(UserPage);
