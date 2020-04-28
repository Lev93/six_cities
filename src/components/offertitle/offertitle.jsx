/* eslint no-underscore-dangle: 0 */
import React from 'react';
import cn from 'classnames';
import PropTypes from 'prop-types';
import axios from 'axios';
import qs from 'qs';
import { useTranslation } from 'react-i18next';

const OfferTitle = (props) => {
  const { t } = useTranslation();
  const {
    apartament,
    userBookmarks,
    onAddUser,
    userId,
  } = props;
  const rating = { width: `${apartament.rating * 20}%` };
  const avatarClass = cn({
    'property__avatar-wrapper': true,
    'property__avatar-wrapper--pro': apartament.premium,
    'user__avatar-wrapper': true,
  });

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
    'property__bookmark-button': true,
    button: true,
    'property__bookmark-button--active': classCheck(),
  });

  const svgClass = cn({
    'property__bookmark-icon': true,
    fill: classCheck(),
  });

  return <React.Fragment>
  {apartament.premium ? <div className="property__mark"><span>Premium</span></div> : null}

<div className="property__name-wrapper">
  <h1 className="property__name">
  {apartament.title}
  </h1>
  <button className={bookmarkClass} type="button" onClick={handleClick}>
    <svg className={svgClass} width="31" height="33">
      <use xlinkHref="#icon-bookmark"></use>
    </svg>
    <span className="visually-hidden">To bookmarks</span>
  </button>
</div>
<div className="property__rating rating">
  <div className="property__stars rating__stars">
    <span style={rating}></span>
    <span className="visually-hidden">Rating</span>
  </div>
  <span className="property__rating-value rating__value">{apartament.rating}</span>
</div>
<ul className="property__features">
  <li className="property__feature property__feature--entire">
    {t(`${apartament.features.entire}`)}
  </li>
  <li className="property__feature property__feature--bedrooms">
  {t('bedrooms', { count: apartament.features.bedrooms })}
  </li>
  <li className="property__feature property__feature--adults">
  {t('persons', { count: apartament.features.persons })}
  </li>
</ul>
<div className="property__price">
  <b className="property__price-value">&euro;{apartament.price}</b>
  <span className="property__price-text">&nbsp;{t('night')}</span>
</div>
<div className="property__inside">
  <h2 className="property__inside-title">{t('whatinside')}</h2>
  <ul className="property__inside-list">
  {apartament.insideitem.map((item, i) => <li key={i} className="property__inside-item">
    {t(`insideitem.${item}`)}
  </li>)}
  </ul>
</div>
<div className="property__host">
    <h2 className="property__host-title">{t('meethost')}</h2>
    <div className="property__host-user user">
      <div className={avatarClass}>
        <img className="property__avatar user__avatar" src={ apartament.userAvatar } width="74" height="74" alt="Host avatar" />
      </div>
      <span className="property__user-name">
        { apartament.userName }
      </span>
      { apartament.premium ? <span className="property__user-status">Pro</span> : null}
      </div>
      <div className="property__description">
        <p className="property__text">
          {apartament.text}
        </p>
      </div>
    </div>
</React.Fragment>;
};

OfferTitle.propTypes = {
  apartament: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    mainImg: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    rating: PropTypes.number.isRequired,
    premium: PropTypes.bool.isRequired,
    userId: PropTypes.string.isRequired,
    features: PropTypes.shape({
      entire: PropTypes.string,
      bedrooms: PropTypes.number,
      persons: PropTypes.number,
    }),
    insideitem: PropTypes.arrayOf(PropTypes.string),
    userAvatar: PropTypes.string,
    userName: PropTypes.string.isRequired,
    text: PropTypes.string.isRequired,
  }),
  user: PropTypes.shape({
    name: PropTypes.string,
    email: PropTypes.string,
    avatar: PropTypes.string,
    pro: PropTypes.bool,
  }),
  onAddUser: PropTypes.func.isRequired,
  userBookmarks: PropTypes.shape({
    items: PropTypes.arrayOf(PropTypes.shape({
      itemId: PropTypes.string.isRequired,
    })),
  }),
  userId: PropTypes.string,
};

export default OfferTitle;
