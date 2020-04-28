/* eslint-disable class-methods-use-this */
/* eslint no-underscore-dangle: 0 */
import React from 'react';
import * as leaflet from 'leaflet';
import { connect } from 'react-redux';
import { NavLink } from 'react-router-dom';
import {
  Map,
  TileLayer,
  Marker,
  Popup,
} from 'react-leaflet';
import PropTypes from 'prop-types';
import { Trans } from 'react-i18next';
import * as actions from '../../actions';


const mapStateToProps = (state) => {
  const props = {
    user: state.user,
    city: state.city,
    activeOfferId: state.activeOfferId,
  };
  return props;
};

const actionCreators = {
  onActiveOffer: actions.activeOffer,
};

const pin = leaflet.icon({
  iconUrl: '/img/pin.svg',
  iconSize: [27, 39],
});

const activePin = leaflet.icon({
  iconUrl: '/img/pin-active.svg',
  iconSize: [30, 42],
});

class CityMap extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      lat: this.setCoordinates(this.props.city)[0],
      lng: this.setCoordinates(this.props.city)[1],
      zoom: 13,
      activeId: null,
    };
  }


  setCoordinates(city) {
    let location = [0, 0];
    if (city === 'Paris') {
      location = [48.853, 2.338];
    } else if (city === 'Cologne') {
      location = [50.933, 6.950];
    } else if (city === 'Brussels') {
      location = [50.850, 4.348];
    } else if (city === 'Amsterdam') {
      location = [52.374, 4.889];
    } else if (city === 'Hamburg') {
      location = [53.535, 10.005];
    } else if (city === 'Dusseldorf') {
      location = [51.221, 6.776];
    }
    return location;
  }

  handleClick = (id, latitude, longitude) => () => {
    const { onActiveOffer } = this.props;
    onActiveOffer(id);
    this.map.flyTo([latitude, longitude], 15);
  }

  componentDidMount() {
    this.map = this.mapInstance.leafletElement;
  }

  componentDidUpdate() {
    const { city, activeOfferId, apartaments } = this.props;
    const coordinates = this.setCoordinates(city);
    this.setState({ lat: coordinates[0], lng: coordinates[1] });
    const place = apartaments.filter((element) => element.id === activeOfferId)[0];
    if (activeOfferId !== null && place !== undefined) {
      this.map.flyTo([place.location.latitude, place.location.longitude], 15);
    }
  }

  render() {
    const { apartaments, activeOfferId } = this.props;
    const position = [this.state.lat, this.state.lng];
    return (
      <Map center={position} zoom={this.state.zoom} ref={(e) => { this.mapInstance = e; }}>
        <TileLayer
          url='https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png'
        />
        {apartaments.map((place) => <Marker
        onClick = { this.handleClick(place._id, place.location.latitude, place.location.longitude) }
        position={[place.location.latitude, place.location.longitude]}
        key={place._id}
        icon={ place._id === activeOfferId ? activePin : pin}>
            <Popup >
            <img src={place.mainImg} alt={place.title} />
            <br/>
            <NavLink to={`/offer/${activeOfferId}`}>
            <b>{place.title}</b>
            </NavLink>
            <br/>
            <b>&euro;{place.price}/ <Trans>night</Trans></b>
            </Popup>
          </Marker>)}
      </Map>
    );
  }
}

CityMap.propTypes = {
  apartaments: PropTypes.arrayOf(PropTypes.shape({
    title: PropTypes.string.isRequired,
  })),
  city: PropTypes.string.isRequired,
  activeOfferId: PropTypes.string,
  onActiveOffer: PropTypes.func.isRequired,
};

export default connect(mapStateToProps, actionCreators)(CityMap);
