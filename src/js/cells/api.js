const PREFIX = "http://localhost:8000/";
const post = (path, data) =>
  fetch(`${PREFIX}/${path}`, {
    method: "POST",
    mode: "cors",
    cache: "no-cache",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

class API {
  parseCell(type, content) {
    console.log("Parsing", type, content);
    return post("document", { type, content });
  }
}

export default new API();
