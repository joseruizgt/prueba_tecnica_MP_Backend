const jwt = require('jsonwebtoken');

const generarJWT = (uid) => {
  return new Promise((resolve, reject) => {
    const payload = { uid };

    const accessToken = jwt.sign(payload, process.env.SECRET_KEY, {
      expiresIn: '2h'
    });

    const refreshToken = jwt.sign(payload, process.env.REFRESH_SECRET_KEY, {
      expiresIn: '3h'
    });

    resolve({ accessToken, refreshToken });

    // jwt.sign(payload, process.env.SECRET_KEY, {
    //   expiresIn: '2h'
    // }, (err, token) => {
    //   if (err) {
    //     console.log(err);
    //     // eslint-disable-next-line prefer-promise-reject-errors
    //     reject('No se pudo generar el token');
    //   } else {
    //     resolve(token);
    //   }
    // });
  });
};

module.exports = {
  generarJWT
};
