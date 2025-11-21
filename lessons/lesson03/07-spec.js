const withBaseUrl = (baseUrl) => (path) => new URL(path, baseUrl).toString();

const mkUrl = withBaseUrl("https://api.example.com/");
mkUrl("/users/42"); // "https://api.example.com/users/42"

const fetchJson =
  (baseUrl, defaultInit = {}) =>
  async (path, init = {}) => {
    const res = await fetch(new URL(path, baseUrl), {
      ...defaultInit,
      ...init,
      headers: { ...(defaultInit.headers || {}), ...(init.headers || {}) },
    });
    if (!res.ok) throw new Error(res.statusText);
    return res.json();
  };

const api = fetchJson("https://api.example.com", {
  headers: { Authorization: "Bearer TOKEN" },
});

api("/me"); // уже специализированный клиент
