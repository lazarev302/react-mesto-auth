class Auth {
  constructor({ baseUrl }) {
    this._baseUrl = baseUrl;
  }

  _checkResponce(res) {
    return res.ok
      ? res.json()
      : Promise.reject(`Ошибка: Reject Promise ${res.status}`);
  }

  registration(email, password) {
    return fetch(`${this._baseUrl}/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: email, password: password }),
    }).then((res) => this._checkResponce(res))
  }

  authorization(email, password) {
    return fetch(`${this._baseUrl}/signin`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    })
      .then((res) => this._checkResponce(res))
      .then((data) => {
        if (data.token) {
          localStorage.setItem("jwt", data.token);
          return data;
        }
      });
  }

  getToken(token) {
    return fetch(`${this._baseUrl}/users/me`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      }
    }).then((res) => this._checkResponce(res));
  }
}

export const auth = new Auth({
  baseUrl: "https://auth.nomoreparties.co",
});
