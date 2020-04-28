/* eslint-disable class-methods-use-this */
import React from 'react';
import PropTypes from 'prop-types';
import { Trans, withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import axios from 'axios';
import qs from 'qs';
import * as actions from '../../actions';
import Loader from '../loader/loader.jsx';


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

class Comments extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      isLoaded: false,
      comments: [],
      newcomment: {
        value: '',
        rating: 0,
        valid: false,
        isFormValid: false,
      },
    };
  }

  onChangeTextArea = (event) => {
    event.preventDefault();
    const newcomment = { ...this.state.newcomment };

    newcomment.value = event.target.value;
    newcomment.valid = event.target.value.length >= 50;
    if (newcomment.valid && this.state.newcomment.rating > 0) {
      newcomment.isFormValid = true;
    }
    this.setState({
      newcomment,
    });
  }

  onRadioChange5 = () => {
    const newcomment = { ...this.state.newcomment };
    newcomment.rating = 5;
    if (newcomment.valid && this.state.newcomment.rating > 0) {
      newcomment.isFormValid = true;
    }
    this.setState({
      newcomment,
    });
  }

  onRadioChange4 = () => {
    const newcomment = { ...this.state.newcomment };
    newcomment.rating = 4;
    if (newcomment.valid && this.state.newcomment.rating > 0) {
      newcomment.isFormValid = true;
    }
    this.setState({
      newcomment,
    });
  }

  onRadioChange3 = () => {
    const newcomment = { ...this.state.newcomment };
    newcomment.rating = 3;
    if (newcomment.valid && this.state.newcomment.rating > 0) {
      newcomment.isFormValid = true;
    }
    this.setState({
      newcomment,
    });
  }

  onRadioChange2 = () => {
    const newcomment = { ...this.state.newcomment };
    newcomment.rating = 2;
    if (newcomment.valid && this.state.newcomment.rating > 0) {
      newcomment.isFormValid = true;
    }
    this.setState({
      newcomment,
    });
  }

  onRadioChange1 = () => {
    const newcomment = { ...this.state.newcomment };
    newcomment.rating = 1;
    if (newcomment.valid && this.state.newcomment.rating > 0) {
      newcomment.isFormValid = true;
    }
    this.setState({
      newcomment,
    });
  }

  commentHandler = (event) => {
    event.preventDefault();
    const { activeOfferId, user } = this.props;
    const data = {
      text: this.state.newcomment.value,
      rating: this.state.newcomment.rating,
      itemId: activeOfferId,
      userId: user.id,
      language: localStorage.getItem('i18nextLng'),
    };
    console.log(data);
    axios({
      method: 'post',
      url: '/comments/add',
      data: qs.stringify(data),
    }).then((response) => {
      this.setState({
        isLoaded: true,
        comments: response.data.comments,
        newcomment: {
          value: '',
          rating: 0,
          valid: false,
          isFormValid: false,
        },
      });
    });
  }

  componentDidMount() {
    const { activeOfferId } = this.props;
    const data = {
      itemId: activeOfferId,
    };
    axios({
      method: 'post',
      url: '/comments/get',
      data: qs.stringify(data),
    }).then((response) => {
      this.setState({
        isLoaded: true,
        comments: response.data.comments,
      });
    });
  }

  componentDidUpdate(prevProps) {
    if (this.props.activeOfferId !== prevProps.activeOfferId) {
      const { activeOfferId } = this.props;
      const data = {
        itemId: activeOfferId,
      };
      axios({
        method: 'post',
        url: '/comments/get',
        data: qs.stringify(data),
      }).then((response) => {
        this.setState({
          isLoaded: true,
          comments: response.data.comments,
        });
      });
    }
  }

  renderComment(item) {
    const rating = { width: `${item.rating * 20}%` };
    return <li className="reviews__item" key={item.id}>
    <div className="reviews__user user">
      <div className="reviews__avatar-wrapper user__avatar-wrapper">
        <img className="reviews__avatar user__avatar" src={item.userAvatar} width="54" height="54" alt="Reviews avatar" />
      </div>
      <span className="reviews__user-name">
        {item.userName}
      </span>
    </div>
    <div className="reviews__info">
      <div className="reviews__rating rating">
        <div className="reviews__stars rating__stars">
          <span style={rating}></span>
          <span className="visually-hidden">Rating</span>
        </div>
      </div>
      <p className="reviews__text">
        {item.text}
      </p>
      <time className="reviews__time" dateTime="2019-04-24"></time>
    </div>
  </li>;
  }

  renderCommentsBlock() {
    return <ul className="reviews__list">
    {this.state.comments.map((item) => this.renderComment(item))}
  </ul>;
  }

  renderCommentForm() {
    const { t } = this.props;
    return <form className="reviews__form form" method="post" onSubmit={this.commentHandler}>
    <label className="reviews__label form__label" htmlFor="review"><Trans>review.yourreview</Trans></label>
    <div className="reviews__rating-form form__rating">
      <input className="form__rating-input visually-hidden" name="rating" value="5"
      id="5-stars" type="radio" onChange={this.onRadioChange5}/>
      <label htmlFor="5-stars" className="reviews__rating-label form__rating-label" title="perfect">
        <svg className="form__star-image" width="37" height="33">
          <use xlinkHref="#icon-star"></use>
        </svg>
      </label>

      <input className="form__rating-input visually-hidden" name="rating" value="4"
      id="4-stars" type="radio" onChange={this.onRadioChange4}/>
      <label htmlFor="4-stars" className="reviews__rating-label form__rating-label" title="good">
        <svg className="form__star-image" width="37" height="33">
          <use xlinkHref="#icon-star"></use>
        </svg>
      </label>

      <input className="form__rating-input visually-hidden" name="rating" value="3"
      id="3-stars" type="radio" onChange={this.onRadioChange3}/>
      <label htmlFor="3-stars" className="reviews__rating-label form__rating-label" title="not bad">
        <svg className="form__star-image" width="37" height="33">
          <use xlinkHref="#icon-star"></use>
        </svg>
      </label>

      <input className="form__rating-input visually-hidden" name="rating" value="2"
      id="2-stars" type="radio" onChange={this.onRadioChange2}/>
      <label htmlFor="2-stars" className="reviews__rating-label form__rating-label" title="badly">
        <svg className="form__star-image" width="37" height="33">
          <use xlinkHref="#icon-star"></use>
        </svg>
      </label>

      <input className="form__rating-input visually-hidden" name="rating" value="1"
      id="1-star" type="radio" onChange={this.onRadioChange1}/>
      <label htmlFor="1-star" className="reviews__rating-label form__rating-label" title="terribly">
        <svg className="form__star-image" width="37" height="33">
          <use xlinkHref="#icon-star"></use>
        </svg>
      </label>
    </div>
    <textarea className="reviews__textarea form__textarea" onChange={(event) => this.onChangeTextArea(event)}
    value={this.state.newcomment.value}
    id="review" name="review" placeholder={t('review.textarea')}></textarea>
    <div className="reviews__button-wrapper">
      <p className="reviews__help">
      <Trans>review.submittext1</Trans>&nbsp;
      <span className="reviews__star"><Trans>review.submittext2</Trans></span>&nbsp;
      <Trans>review.submittext3</Trans>&nbsp;
      <b className="reviews__text-amount"><Trans>review.submittext4</Trans></b>.
      </p>
      <button className="reviews__submit form__submit button" type="submit" disabled={!this.state.newcomment.isFormValid}><Trans>review.submit</Trans></button>
    </div>
  </form>;
  }

  render() {
    const { user } = this.props;
    return (
    <section className="property__reviews reviews">
      <h2 className="reviews__title"><Trans>review.reviews</Trans> &middot; <span className="reviews__amount">{this.state.comments.length}</span></h2>
      {this.state.isLoaded ? this.renderCommentsBlock() : <Loader />}
      {user.id ? this.renderCommentForm() : null}
    </section>
    );
  }
}

Comments.propTypes = {
  city: PropTypes.string.isRequired,
  activeOfferId: PropTypes.string,
  onActiveOffer: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired,
  user: PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string,
    email: PropTypes.string,
    avatar: PropTypes.string,
  }),
};

export default connect(mapStateToProps, actionCreators)(withTranslation()(Comments));
