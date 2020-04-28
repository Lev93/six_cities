import React from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';
import { useTranslation } from 'react-i18next';
import Item from '../item/item.jsx';
import CityMap from '../map/map.jsx';


const Main = (props) => {
  const { t } = useTranslation();
  const {
    onChangeCity,
    activeCity,
    apartaments,
    onChangeSortWindow,
    sortWindow,
    onActiveOffer,
    onAddUser,
    userBookmarks,
    userId,
    handleSort,
  } = props;

  const handleClickCity = (city) => (e) => {
    e.preventDefault();
    onChangeCity(city);
  };

  const cityClass = (city) => cn({
    'locations__item-link': true,
    tabs__item: true,
    'tabs__item--active': city === activeCity,
  });

  const sortWindowyClass = cn({
    places__options: true,
    'places__options--custom': true,
    'places__options--opened': sortWindow,
  });

  const renderEmpty = () => <div className="cities__places-container cities__places-container--empty container">
    <section className="cities__no-places">
      <div className="cities__status-wrapper tabs__content">
        <b className="cities__status">{t('places.empty')}</b>
        <p className="cities__status-description">{t('places.emptytext')} {t(`cities.${activeCity}`)}</p>
      </div>
    </section>
    <div className="cities__right-section"></div>
  </div>;

  const renderApartaments = () => <div className="cities__places-container container">
    <section className="cities__places places">
      <h2 className="visually-hidden">Places</h2>
      <b className="places__found">{t('places.results', { count: apartaments.length })} {t(`cities.${activeCity}`)}</b>
      <form className="places__sorting" action="#" method="get">
        <span className="places__sorting-caption">{t('sort.sortBy')}&nbsp;</span>
        <span className="places__sorting-type" tabIndex="0" onClick={ () => onChangeSortWindow() }>
          {t('sort.Popular')}
          <svg className="places__sorting-arrow" width="7" height="4">
            <use xlinkHref="#icon-arrow-select"></use>
          </svg>
        </span>
        <ul className={sortWindowyClass}>
          <li className="places__option places__option--active" tabIndex="0" onClick = {handleSort('Popular')}>{t('sort.Popular')}</li>
          <li className="places__option" tabIndex="0" onClick = {handleSort('PriceLow')}>{t('sort.PriceLow')}</li>
          <li className="places__option" tabIndex="0" onClick = {handleSort('PriceHigh')}>{t('sort.PriceHigh')}</li>
          <li className="places__option" tabIndex="0" onClick = {handleSort('TopRated')}>{t('sort.TopRated')}</li>
        </ul>
      </form>
      <div className="cities__places-list places__list tabs__content">
       {apartaments.map((element, index) => <Item apartament = { element } key = { index }
       onActiveOffer = {onActiveOffer} onAddUser = {onAddUser} userBookmarks = {userBookmarks}
       userId = {userId} />)}
      </div>
    </section>
    <div className="cities__right-section">
        <section className="cities__map map" id="mapid">
          <CityMap city= {activeCity} apartaments={apartaments} />
        </section>
      </div>
  </div>;

  return <main className="page__main page__main--index page__main--index-empty">
  <h1 className="visually-hidden">Cities</h1>
  <div className="tabs">
    <section className="locations container">
      <ul className="locations__list tabs__list">
        <li className="locations__item">
          <a className={cityClass('Paris')} href="#" onClick={ handleClickCity('Paris') }>
            <span>{t('cities.Paris')}</span>
          </a>
        </li>
        <li className="locations__item">
          <a className={cityClass('Cologne')} href="#" onClick={ handleClickCity('Cologne') }>
            <span>{t('cities.Cologne')}</span>
          </a>
        </li>
        <li className="locations__item">
          <a className={cityClass('Brussels')} href="#" onClick={ handleClickCity('Brussels') }>
            <span>{t('cities.Brussels')}</span>
          </a>
        </li>
        <li className="locations__item">
          <a className={cityClass('Amsterdam')} onClick={ handleClickCity('Amsterdam') }>
            <span>{t('cities.Amsterdam')}</span>
          </a>
        </li>
        <li className="locations__item">
          <a className={cityClass('Hamburg')} href="#" onClick={ handleClickCity('Hamburg') }>
            <span>{t('cities.Hamburg')}</span>
          </a>
        </li>
        <li className="locations__item">
          <a className={cityClass('Dusseldorf')} href="#" onClick={ handleClickCity('Dusseldorf') }>
            <span>{t('cities.Dusseldorf')}</span>
          </a>
        </li>
      </ul>
    </section>
  </div>
  <div className="cities">
     {apartaments.length > 0 ? renderApartaments() : renderEmpty()}
  </div>
</main>;
};

Main.propTypes = {
  userEmail: PropTypes.string,
  activeCity: PropTypes.string.isRequired,
  onChangeCity: PropTypes.func.isRequired,
  onChangeSortWindow: PropTypes.func.isRequired,
  sortWindow: PropTypes.bool.isRequired,
  apartaments: PropTypes.arrayOf(PropTypes.shape({
    title: PropTypes.string.isRequired,
  })),
  onActiveOffer: PropTypes.func.isRequired,
  onAddUser: PropTypes.func.isRequired,
  userBookmarks: PropTypes.arrayOf(PropTypes.shape({
    itemId: PropTypes.string.isRequired,
  })),
  userId: PropTypes.string,
  handleSort: PropTypes.func.isRequired,
};

export default Main;
