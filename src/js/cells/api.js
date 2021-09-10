const PREFIX = "http://localhost:8000";
const request = (method, path, data) =>
  fetch(`${PREFIX}/${path}`, {
    method: method,
    mode: "cors",
    cache: "no-cache",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
const post = (path, data) => request("POST", path, data);
const update = (path, data) => request("UPDATE", path, data);
const put = (path, data) => request("PUT", path, data);
const get = (path, data) => request("GET", path, data);

class API {
  parse(type, content) {
    return post("parse/" + type, content);
  }
  eval(type, content) {
    return post("eval/" + type, content);
  }
  updateCell(doc, cell, content) {
    update("doc/XXX/001/content", content);
  }
}

export default new API();
