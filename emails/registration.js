/* eslint-disable arrow-body-style */
const keys = require('../keys');

module.exports = (email) => {
  return {
    to: email,
    from: keys.EMAIL_FROM,
    subject: 'Аккаунт создан',
    html: `
      <h1>Добро пожаловать в 6 городов</h1>
      <p>Вы успешно создали аккаунт c email - ${email}</p>
      <hr />
      <a href="${keys.BASE_URL}">6 cities</a>
    `,
  };
};
