/* eslint-disable class-methods-use-this */
import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Trans, withTranslation } from 'react-i18next';
import cn from 'classnames';
import axios from 'axios';
import { NavLink, withRouter } from 'react-router-dom';
import { OpenStreetMapProvider } from 'leaflet-geosearch';
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

const provider = new OpenStreetMapProvider();

class AddOffer extends React.Component {
  constructor(props) {
    super(props);
    this.fileInput = React.createRef();
    this.state = {
      titleValue: '',
      priceValue: '',
      insideitem: [],
      text: '',
      city: 'Paris',
      type: 'room',
      bedroomsValue: '',
      personsValue: '',
      adress: '',
      places: [],
      images: [],
      location: {
        latitude: '',
        longitude: '',
      },
    };
  }

  handleClickCity = (city) => () => {
    this.props.onChangeCity(city);
  };

  onChangeCity = (e) => {
    e.preventDefault();
    this.setState({ city: e.target.value });
  }

  onChangeType = (e) => {
    e.preventDefault();
    this.setState({ type: e.target.value });
  }

  onChangeBedrooms = (e) => {
    e.preventDefault();
    this.setState({ bedroomsValue: e.target.value });
  }

  onChangePersons = (e) => {
    e.preventDefault();
    this.setState({ personsValue: e.target.value });
  }

  onChangeTitle = (e) => {
    e.preventDefault();
    this.setState({ titleValue: e.target.value });
  }

  onChangePrice = (e) => {
    e.preventDefault();
    this.setState({ priceValue: e.target.value });
  }

  onChangeAdress= async (e) => {
    e.preventDefault();
    const adress = e.target.value;
    if (adress.length > 10) {
      const places = await provider.search({ query: adress });
      this.setState({ adress, places });
    } else {
      this.setState({ adress });
    }
  }

  handleInputChange(checbox) {
    const { insideitem } = this.state;
    if (insideitem.includes(checbox)) {
      const index = insideitem.findIndex((el) => el === checbox);
      insideitem.splice(index, 1);
      this.setState({
        insideitem,
      });
    } else {
      insideitem.push(checbox);
      this.setState({
        insideitem,
      });
    }
  }

  onChangeTextArea = (event) => {
    this.setState({
      text: event.target.value,
    });
  }

  handlePlace = (place) => (e) => {
    e.preventDefault();
    const location = {
      latitude: place.y,
      longitude: place.x,
    };
    this.setState({
      location, adress: place.label, places: [],
    });
  }

  renderAdress(place) {
    return <li><a onClick={this.handlePlace(place)} key = {place.x}>{place.label}</a></li>;
  }

  addHandler = (event) => {
    event.preventDefault();
    const { user } = this.props;
    const data = new FormData();
    data.append('city', this.state.city);
    data.append('title', this.state.titleValue);
    data.append('premium', user.pro);
    data.append('price', this.state.priceValue);
    for (let x = 0; x < this.fileInput.current.files.length; x += 1) {
      data.append('images', this.fileInput.current.files[x]);
    }
    data.append('type', this.state.type);
    data.append('userAvatar', user.avatar);
    data.append('userId', user.id);
    data.append('userName', user.name);
    data.append('text', this.state.text);
    data.append('featuresentire', this.state.type === 'room' ? 'room' : 'entireplace');
    data.append('featuresbedrooms', this.state.bedroomsValue);
    data.append('featurespersons', this.state.personsValue);
    for (let x = 0; x < this.state.insideitem.length; x += 1) {
      data.append('insideitem', this.state.insideitem[x]);
    }
    data.append('locationlatitude', this.state.location.latitude);
    data.append('locationlongitude', this.state.location.longitude);
    data.append('language', localStorage.getItem('i18nextLng'));
    try {
      axios({
        method: 'post',
        url: '/items/add',
        headers: { 'Content-Type': undefined },
        data,
      }).then(() => {
        this.props.history.push('/');
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
    const checkbox = (item) => cn({
      'locations__item-link': true,
      tabs__item: true,
      'tabs__item--active': this.state.insideitem.includes(item),
      text: true,
    });
    return (
      <div className="page page--gray page--additem">
        <Header userEmail={email}/>
        <main className="page__main page__main--login">
        <div className="page__login-container container">
          <section className="login housing">
            <h1 className="login__title"><Trans>addPage.create</Trans></h1>
            <form className="login__form form" method="post" onSubmit={this.addHandler} encType="multipart/form-data">
              <div className="login__input-wrapper form__input-wrapper">
                <input className="login__input form__input form__input-2" type="text" name="title" placeholder={t('addPage.title')}
                value={this.state.titleValue}
                onChange={this.onChangeTitle} />
                <input className="login__input form__input form__input-2" type="number" name="price" placeholder={t('addPage.price')}
                value={this.state.priceValue}
                onChange={this.onChangePrice} />
                <label htmlFor="selectcity"><Trans>addPage.choosecity</Trans></label>
                <select className="login__input form__input form__input-2" value={this.state.city} onChange={this.onChangeCity}>
                  <option value="Paris">{t('cities.Paris')}</option>
                  <option value="Cologne">{t('cities.Cologne')}</option>
                  <option value="Hamburg">{t('cities.Hamburg')}</option>
                  <option value="Brussels">{t('cities.Brussels')}</option>
                  <option value="Amsterdam">{t('cities.Amsterdam')}</option>
                  <option value="Dusseldorf">{t('cities.Dusseldorf')}</option>
                </select>
                <label htmlFor="selectcity"><Trans>addPage.choosetype</Trans></label>
                <select className="login__input form__input form__input-2" id="selectcity" value={this.state.type} onChange={this.onChangeType}>
                  <option value="room">{t('room')}</option>
                  <option value="apartament">{t('apartament')}</option>
                  <option value="house">{t('house')}</option>
                </select>
                <input className="login__input form__input form__input-2" type="number" name="price" placeholder={t('addPage.bedrooms')} required=""
                value={this.state.bedroomsValue}
                onChange={this.onChangeBedrooms} />
                <input className="login__input form__input form__input-2" type="number" name="price" placeholder={t('addPage.persons')} required=""
                value={this.state.personsValue}
                onChange={this.onChangePersons} />
                <p><Trans>whatinside</Trans></p>
                <ul className="property__inside-list">
                  <li className="property__inside-item">
                    <label htmlFor="Wi-Fi" className={checkbox('Wi-Fi')}>{t('insideitem.Wi-Fi')}</label>
                    <input id ="Wi-Fi" className="visually-hidden" type="checkbox" onChange={() => this.handleInputChange('Wi-Fi')} checked={ this.state.insideitem.includes('Wi-Fi')}/>
                  </li>
                  <li>
                    <label htmlFor="Heating" className={checkbox('Heating')}>{t('insideitem.Heating')}</label>
                    <input id ="Heating" className="visually-hidden" type="checkbox" onChange={() => this.handleInputChange('Heating')} checked={ this.state.insideitem.includes('Heating')}/>
                  </li>
                  <li>
                    <label htmlFor="Kitchen" className={checkbox('Kitchen')}>{t('insideitem.Kitchen')}</label>
                    <input id ="Kitchen" className="visually-hidden" type="checkbox" onChange={() => this.handleInputChange('Kitchen')} checked={ this.state.insideitem.includes('Kitchen')}/>
                  </li>
                  <li>
                    <label htmlFor="Fridge" className={checkbox('Fridge')}>{t('insideitem.Fridge')}</label>
                    <input id ="Fridge" className="visually-hidden" type="checkbox" onChange={() => this.handleInputChange('Fridge')} checked={ this.state.insideitem.includes('Fridge')}/>
                  </li>
                  <li>
                    <label htmlFor="Washing machine" className={checkbox('Washing machine')}>{t('insideitem.Washing machine')}</label>
                    <input id ="Washing machine" className="visually-hidden" type="checkbox" onChange={() => this.handleInputChange('Washing machine')} checked={ this.state.insideitem.includes('Washing machine')}/>
                  </li>
                  <li>
                    <label htmlFor="Coffee machine" className={checkbox('Coffee machine')}>{t('insideitem.Coffee machine')}</label>
                    <input id ="Coffee machine" className="visually-hidden" type="checkbox" onChange={() => this.handleInputChange('Coffee machine')} checked={ this.state.insideitem.includes('Coffee machine')}/>
                  </li>
                  <li>
                    <label htmlFor="Dishwasher" className={checkbox('Dishwasher')}>{t('insideitem.Dishwasher')}</label>
                    <input id ="Dishwasher" className="visually-hidden" type="checkbox" onChange={() => this.handleInputChange('Dishwasher')} checked={ this.state.insideitem.includes('Dishwasher')}/>
                  </li>
                  <li>
                    <label htmlFor="Towels" className={checkbox('Towels')}>{t('insideitem.Towels')}</label>
                    <input id ="Towels" className="visually-hidden" type="checkbox" onChange={() => this.handleInputChange('Towels')} checked={ this.state.insideitem.includes('Towels')}/>
                  </li>
                  <li>
                    <label htmlFor="Baby seat" className={checkbox('Baby seat')}>{t('insideitem.Baby seat')}</label>
                    <input id ="Baby seat" className="visually-hidden" type="checkbox" onChange={() => this.handleInputChange('Baby seat')} checked={ this.state.insideitem.includes('Baby seat')}/>
                  </li>
                  <li>
                    <label htmlFor="Cabel TV" className={checkbox('Cabel TV')}>{t('insideitem.Cabel TV')}</label>
                    <input id ="Cabel TV" className="visually-hidden" type="checkbox" onChange={() => this.handleInputChange('Cabel TV')} checked={ this.state.insideitem.includes('Cabel TV')}/>
                  </li>
                  <li>
                    <label htmlFor="Breakfast" className={checkbox('Breakfast')}>{t('insideitem.Breakfast')}</label>
                    <input id ="Breakfast" className="visually-hidden" type="checkbox" onChange={() => this.handleInputChange('Breakfast')} checked={ this.state.insideitem.includes('Breakfast')}/>
                  </li>
                  <li>
                    <label htmlFor="Laptop friendly workspace" className={checkbox('Laptop friendly workspace')}>{t('insideitem.Laptop friendly workspace')}</label>
                    <input id ="Laptop friendly workspace" className="visually-hidden" type="checkbox" onChange={() => this.handleInputChange('Laptop friendly workspace')} checked={ this.state.insideitem.includes('Laptop friendly workspace')}/>
                  </li>
                  <li>
                    <label htmlFor="Air conditioning" className={checkbox('Air conditioning')}>{t('insideitem.Air conditioning')}</label>
                    <input id ="Air conditioning" className="visually-hidden" type="checkbox" onChange={() => this.handleInputChange('Air conditioning')} checked={ this.state.insideitem.includes('Air conditioning')}/>
                  </li>
                </ul>
                <textarea className="reviews__textarea form__textarea textarea" onChange={(event) => this.onChangeTextArea(event)}
                  value={this.state.text}
                  id="review" name="review" placeholder={t('addPage.textarea')}>
                </textarea>
                <input className="login__input form__input form__input-2" type="text" name="adress" placeholder={t('addPage.adress')} required=""
                value={this.state.adress}
                onChange={this.onChangeAdress} />
                <ul>
                { this.state.places.map((place) => this.renderAdress(place)) }
                </ul>
                <label htmlFor="mainImg"><Trans>addPage.choosemainImg</Trans></label>
                <input id = "mainImg" type="file" name="images" ref={this.fileInput} multiple />
              </div>
              <button className="login__submit form__submit button" type="submit"><Trans>addPage.createbutton</Trans></button>
            </form>
          </section>
          <section className="locations locations--login locations--current">
            <div className="locations__item">
              <NavLink className="locations__item-link" to="/" onClick={ this.handleClickCity('Cologne')}>
                <span><Trans>cities.Cologne</Trans></span>
              </NavLink>
            </div>
          </section>
        </div>
      </main>
      </div>
    );
  }
}

AddOffer.propTypes = {
  user: PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string,
    email: PropTypes.string,
    avatar: PropTypes.string,
    pro: PropTypes.bool,
  }),
  onChangeCity: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired,
  onAddUser: PropTypes.func.isRequired,
  history: PropTypes.shape({
    push: PropTypes.func,
  }),
};

export default connect(mapStateToProps, actionCreators)(withRouter(withTranslation()(AddOffer)));
