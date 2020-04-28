import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Trans } from 'react-i18next';
import axios from 'axios';
import qs from 'qs';
import Header from '../header/header.jsx';
import Loader from '../loader/loader.jsx';
import OfferTitle from '../offertitle/offertitle.jsx';
import Comments from '../comments/comments.jsx';
import * as actions from '../../actions';
import CityMap from '../map/map.jsx';
import Item from '../item/item.jsx';

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

class Offer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoaded: false,
      item: {},
      offers: [],
      neighbourhood: [],
    };
  }

  componentDidMount() {
    const { activeOfferId, city } = this.props;
    axios({
      method: 'post',
      url: '/items/item',
      data: qs.stringify({ id: activeOfferId, city }),
    }).then((response) => {
      this.setState({
        isLoaded: true,
        item: { ...response.data.item },
        offers: [...response.data.offers],
        neighbourhood: [...response.data.neighbourhood],
      });
    });
  }

  componentDidUpdate(prevProps) {
    if (this.props.activeOfferId !== prevProps.activeOfferId) {
      const { activeOfferId, city } = this.props;
      axios({
        method: 'post',
        url: '/items/item',
        data: qs.stringify({ id: activeOfferId, city }),
      }).then((response) => {
        this.setState({
          isLoaded: true,
          item: { ...response.data.item },
          offers: [...response.data.offers],
          neighbourhood: [...response.data.neighbourhood],
        });
      });
    }
  }

  renderOffer() {
    const { user, city, onAddUser } = this.props;
    return (<section className="property">
      <div className="property__gallery-container container">
        <div className="property__gallery">
          {this.state.item.images.map((img, i) => <div className="property__image-wrapper" key={img + i}>
            <img className="property__image" src={img} />
          </div>)}
        </div>
      </div>
      <div className="property__container container">
        <div className="property__wrapper">
          <OfferTitle apartament = {this.state.item} userBookmarks={user.bookmarks}
          onAddUser={onAddUser} userId = {user.id} />
          <Comments user= {user} apartamentRating= {this.state.item.rating} />
        </div>
      </div>
      <section className="property__map map">
        <CityMap city= {city} apartaments={this.state.offers} />
      </section>
    </section>);
  }

  renderNeighbourhood() {
    const { onActiveOffer } = this.props;
    return <div className="near-places__list places__list">
      {this.state.neighbourhood.map((element, index) => <Item apartament={ element } key={ index }
       onActiveOffer = {onActiveOffer}/>)}
    </div>;
  }

  render() {
    const {
      user,
    } = this.props;
    return (
    <div className="page">
      <Header userEmail={user.email}/>
      <main className="page__main page__main--property">
        {this.state.isLoaded ? this.renderOffer() : <Loader />}
        <div className="container">
          <section className="near-places places">
            <h2 className="near-places__title"><Trans>review.neighbourhood</Trans></h2>
            {this.state.isLoaded ? this.renderNeighbourhood() : <Loader />}
          </section>
        </div>
      </main>
    </div>);
  }
}

Offer.propTypes = {
  user: PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string,
    email: PropTypes.string,
    avatar: PropTypes.string,
    bookmarks: PropTypes.shape({
      items: PropTypes.arrayOf(PropTypes.shape({
        itemId: PropTypes.string.isRequired,
      })),
    }),
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
  onAddUser: PropTypes.func.isRequired,
};

export default connect(mapStateToProps, actionCreators)(Offer);
