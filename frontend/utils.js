function getPusherClient() {
  Pusher.logToConsole = true;
  return new Pusher("", { cluster: "" }); // TODO: Add your pusher key and cluster
}

function renderMessage({ query, message, className }) {
  const container = document.querySelector(query);
  const eventElement = createElement({ type: "div", className, html: message });
  container.appendChild(eventElement);
  eventElement.scrollIntoView();
}

function createElement({ type, className, html }) {
  const element = document.createElement(type);
  element.className = className;
  element.innerHTML = html;
  return element;
}

function setCookie({ name, value, expiryInDays }) {
  const date = new Date();
  date.setTime(date.getTime() + expiryInDays * 24 * 60 * 60 * 1000);
  let expires = "expires=" + date.toUTCString();
  document.cookie = name + "=" + value + ";" + expires + ";path=/";
}

function getCookie(cookieName) {
  let name = cookieName + "=";
  let decodedCookie = decodeURIComponent(document.cookie);
  let ca = decodedCookie.split(";");
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == " ") {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

function parseCookies(request) {
  const parsedCookies = {};
  const cookieHeader = request.headers?.cookie;
  if (!cookieHeader) return parsedCookies;

  cookieHeader.split(`;`).forEach(function (cookie) {
    let [name, ...rest] = cookie.split(`=`);
    name = name?.trim();
    if (!name) return;
    const value = rest.join(`=`).trim();
    if (!value) return;
    parsedCookies[name] = decodeURIComponent(value);
  });

  return parsedCookies;
}

const dummyUsers = [
  {
    user_id: 1,
    user_info: {
      name: "John",
    },
  },
  {
    user_id: 2,
    user_info: {
      name: "Jane",
    },
  },
];

export {
  getPusherClient,
  renderMessage,
  createElement,
  setCookie,
  getCookie,
  parseCookies,
  dummyUsers,
};
