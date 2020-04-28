/* eslint no-underscore-dangle: 0 */
import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import cn from 'classnames';
import qs from 'qs';
import { NavLink } from 'react-router-dom';

const Item = (props) => {
  const {
    apartament,
    onActiveOffer,
    onAddUser,
    userBookmarks,
    userId,
  } = props;
  const { t } = useTranslation();
  const rating = { width: `${apartament.rating * 20}%` };

  const handleClick = () => {
    if (!userId) {
      return;
    }
    const data = {
      itemId: apartament._id,
      userId,
    };
    axios({
      method: 'post',
      url: '/auth/bookmarks',
      data: qs.stringify(data),
    }).then((response) => {
      onAddUser(response.data.user);
    });
  };

  const classCheck = () => {
    if (!userBookmarks) {
      return false;
    }
    const result = userBookmarks.items.filter(({ itemId }) => itemId === apartament._id);
    return result.length > 0;
  };

  const bookmarkClass = cn({
    'place-card__bookmark-button': true,
    button: true,
    'place-card__bookmark-button--active': classCheck(),
  });

  return <article className="cities__place-card place-card">
  {apartament.premium ? <div className="place-card__mark"><span>Premium</span></div> : null}

  <div className="cities__image-wrapper place-card__image-wrapper">
    <a onClick={ () => onActiveOffer(apartament._id) }>
      <img className="place-card__image" src={apartament.mainImg} width="260" height="200" alt="Place image" />
    </a>
  </div>
  <div className="place-card__info">
    <div className="place-card__price-wrapper">
      <div className="place-card__price">
        <b className="place-card__price-value">&euro;{apartament.price}</b>
        <span className="place-card__price-text">&#47;&nbsp;{t('night')}</span>
      </div>
      <button className={bookmarkClass} type="button" onClick={handleClick}>
        <svg className="place-card__bookmark-icon" width="18" height="19">
          <use xlinkHref="#icon-bookmark"></use>
        </svg>
        <span className="visually-hidden">To bookmarks</span>
      </button>
    </div>
    <div className="place-card__rating rating">
      <div className="place-card__stars rating__stars">
        <span style={rating}></span>
        <span className="visually-hidden">Rating</span>
      </div>
    </div>
    <h2 className="place-card__name">
      <NavLink to={`/offer/${apartament._id}`} onClick={ () => onActiveOffer(apartament._id) }>
        {apartament.title}
      </NavLink>
    </h2>
    <p className="place-card__type">{t(`${apartament.type}`)}</p>
  </div>
</article>;
};

Item.propTypes = {
  apartament: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    mainImg: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    rating: PropTypes.number.isRequired,
    premium: PropTypes.bool.isRequired,
    userId: PropTypes.string.isRequired,
  }),
  onActiveOffer: PropTypes.func.isRequired,
  onAddUser: PropTypes.func.isRequired,
  userBookmarks: PropTypes.shape({
    items: PropTypes.arrayOf(PropTypes.shape({
      itemId: PropTypes.string.isRequired,
    })),
  }),
  userId: PropTypes.string,
};

export default Item;
