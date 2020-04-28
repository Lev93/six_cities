/* eslint-disable arrow-body-style */
/* eslint-disable class-methods-use-this */
import React from 'react';
import { connect } from 'react-redux';
import {
  Route,
  Switch,
  Redirect,
  withRouter,
} from 'react-router-dom';
import PropTypes from 'prop-types';
import axios from 'axios';
import qs from 'qs';
import * as actions from '../../actions';
import Header from '../header/header.jsx';
import Main from '../main/main.jsx';
import Loader from '../loader/loader.jsx';
import Auth from '../auth/auth.jsx';
import Offer from '../offer/offer.jsx';
import AddOffer from '../addoffer/addoffer.jsx';
import UserPage from '../userpage/userpage.jsx';
import Registration from '../reg/reg.jsx';

const mapStateToProps = (state) => {
  const props = {
    user: state.user,
    city: state.city,
    sortWindow: state.sortWindow,
    activeOfferId: state.activeOfferId,
    apartaments: state.apartaments,
  };
  return props;
};

const actionCreators = {
  onChangeCity: actions.changeCity,
  onOpenSort: actions.openSort,
  onActiveOffer: actions.activeOffer,
  onAddUser: actions.addUser,
  addAparataments: actions.addAparataments,
  removeUser: actions.removeUser,
};

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoaded: false,
    };
  }

  componentDidMount() {
    const {
      user,
      onAddUser,
      addAparataments,
      city,
    } = this.props;
    if (!user.id) {
      const expirationDate = localStorage.getItem('expirationDate');
      if (new Date(expirationDate).getTime() < new Date().getTime()) {
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        localStorage.removeItem('expirationDate');
      } else {
        const userId = localStorage.getItem('userId');
        if (userId) {
          axios({
            method: 'post',
            url: '/auth/user',
            data: qs.stringify({ id: userId }),
          }).then((response) => {
            onAddUser(response.data.user);
          });
        }
      }
    }
    axios({
      method: 'post',
      url: '/items/',
      data: qs.stringify({ city }),
    }).then((response) => {
      addAparataments(response.data);
      this.setState({
        isLoaded: true,
      });
    });
  }

  componentDidUpdate(prevProps) {
    if (this.props.city !== prevProps.city) {
      const { city, addAparataments } = this.props;
      axios({
        method: 'post',
        url: '/items/',
        data: qs.stringify({ city }),
      }).then((response) => {
        addAparataments(response.data);
      });
    }
  }

  handleSort = (sortType) => () => {
    const { city, addAparataments, onOpenSort } = this.props;
    const data = { city, sortType };
    axios({
      method: 'post',
      url: '/items/sort',
      data: qs.stringify(data),
    }).then((response) => {
      addAparataments(response.data);
      onOpenSort();
    });
  }

  handleLogout = (e) => {
    const { removeUser } = this.props;
    e.preventDefault();
    removeUser();
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('expirationDate');
  }

  renderApp() {
    const {
      user,
      onChangeCity,
      city,
      apartaments,
      onOpenSort,
      sortWindow,
      onActiveOffer,
      onAddUser,
    } = this.props;
    const email = user.email || null;
    return (
      <Switch>
        <Route path="/" exact render={() => <div className="page page--gray page--main">
            <Header userEmail={email} handleLogout={this.handleLogout}/>
            <Main onChangeCity={ (changedCity) => onChangeCity(changedCity)}
              activeCity = { city }
              apartaments = { apartaments }
              sortWindow = { sortWindow }
              onChangeSortWindow={ () => onOpenSort()}
              onActiveOffer={onActiveOffer}
              onAddUser={onAddUser}
              userBookmarks={user.bookmarks}
              userId={user.id}
              handleSort={this.handleSort}
            />
          </div>
        }/>
        <Route path="/login" render={() => {
          return user.id ? <UserPage /> : <Auth />;
        }}/>
        <Route path="/registration" render={() => <Registration />}/>
        <Route path="/offer/:id" component={Offer} />
        <Route path="/items/add" render={() => {
          return user.id ? <AddOffer /> : <Redirect to={'/login'}/>;
        }}/>
        <Redirect to={'/'}/>
      </Switch>
    );
  }

  render() {
    return this.state.isLoaded ? this.renderApp() : <Loader />;
  }
}

App.propTypes = {
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
  city: PropTypes.string.isRequired,
  sortWindow: PropTypes.bool.isRequired,
  onChangeCity: PropTypes.func.isRequired,
  onOpenSort: PropTypes.func.isRequired,
  apartaments: PropTypes.arrayOf(PropTypes.shape({
    title: PropTypes.string.isRequired,
  })),
  onActiveOffer: PropTypes.func.isRequired,
  onAddUser: PropTypes.func.isRequired,
  addAparataments: PropTypes.func.isRequired,
  removeUser: PropTypes.func.isRequired,
};

export default withRouter(connect(mapStateToProps, actionCreators)(App));
