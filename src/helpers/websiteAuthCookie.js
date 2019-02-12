import cookie from 'js-cookie';
import config from 'src/config';

const websiteAuthCookie = config.authentication.site.cookie;
const tenant = config.tenant;

function save(data) {
  const merged = Object.assign(get() || {}, data); //This is because refresh does not give a new refresh token.
  cookie.set(websiteAuthCookie.name, { ...merged, tenant }, websiteAuthCookie.options);
}

function get() {
  return cookie.getJSON(websiteAuthCookie.name);
}

function remove() {
  cookie.remove(websiteAuthCookie.name, websiteAuthCookie.options);
}

export default { save, remove, get };
