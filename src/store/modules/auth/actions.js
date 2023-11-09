let timer;

export default {
  async signup(context, payload) {
    return context.dispatch("auth", {
      ...payload,
      mode: "signup",
    });
  },

  async login(context, payload) {
    return context.dispatch("auth", {
      ...payload,
      mode: "login",
    });
  },

  async auth(context, payload) {
    const mode = payload.mode;

    let url = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyDzY46Ew53OqjWSf_HYd0x2xU5jlsYcm80`;

    if (mode === "signup") {
      url = `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyDzY46Ew53OqjWSf_HYd0x2xU5jlsYcm80`;
    }

    const response = await fetch(url, {
      method: "POST",
      body: JSON.stringify({
        email: payload.email,
        password: payload.password,
        returnSecureToken: true,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        response.message || "Failed to authenticate. Check your login data"
      );
    }

    const expiresIn = +data.expiresIn * 1000;
    // const expiresIn = 5000;
    const expirationDate = new Date().getTime() + expiresIn;

    localStorage.setItem("token", data.idToken);
    localStorage.setItem("userId", data.localId);
    localStorage.setItem("tokenExpiration", expirationDate);

    timer = setTimeout(function () {
      context.dispatch("autoLogout");
    }, expiresIn);

    context.commit("setUser", {
      token: data.idToken,
      userId: data.localId,
      // tokenExpiration: expirationDate,
    });
  },

  tryLogin(context) {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("token");
    const tokenExpiration = localStorage.getItem("tokenExpiration");

    const expiresIn = +tokenExpiration - new Date().getTime();

    // expiresIn < 0
    //   ? null
    // : (timer = setTimeout(function () {
    //     context.dispatch("logout");
    //   }, expiresIn));

    if (expiresIn < 0) return;

    timer = setTimeout(function () {
      context.dispatch("autoLogout");
    }, expiresIn);

    token && userId
      ? context.commit("setUser", {
          token,
          userId,
          // tokenExpiration: null,
        })
      : null;
  },

  logout(context) {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("tokenExpiration");

    clearTimeout(timer);

    context.commit("setUser", {
      token: null,
      userId: null,
      // tokenExpiration: null,
    });
  },

  autoLogout(context) {
    context.dispatch("logout");
    context.commit("setAutoLogout");
  },
};
