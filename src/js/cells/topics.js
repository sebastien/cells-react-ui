export class Topic {
  constructor(name) {
    this.name = name;
    this.value = undefined;
    this.updatedAt = undefined;
    this.children = {};
    this.subscribers = [];
    this.parent = undefined;
  }
  clear() {
    const children = this.children;
    this.children = {};
    for (let k in children) {
      const child = children[k];
      if (child.parent === this) child.parent = null;
    }
    this.subsribers = [];
  }
  get root() {
    return this.parent ? this.parent.root : this;
  }
  add(child) {
    if (child instanceof Topic) {
      this.set(child.name, child);
      return child;
    } else {
      const name = `${child}`;
      const res = new Topic(name);
      this.set(name, res);
      return res;
    }
  }
  set(key, child) {
    child.name = key;
    child.parent = this;
    this.children[child.name] = child;
    child.parent = this;
    return this;
  }
  resolve(path) {
    return (path instanceof Array ? path : path.split("/")).reduce(
      (r, v, _) => (r ? r.children[v] : undefined),
      this,
    );
  }
  ensure(path) {
    return (path instanceof Array ? path : path.split("/")).reduce(
      (r, v, _) => (r.children[v] ? r.children[v] : this.add(v)),
      this,
    );
  }
  pub(value) {
    this.value = value;
    this.updatedAt = new Date();
    return this.relay(value, this);
  }
  relay(value, source) {
    let i = 0;
    const n = this.subscribers.length;
    while (i < n) {
      const f = this.subscribers[i];
      if (f(value, source) === false) {
        return false;
      }
      i++;
    }
    return this.parent ? this.parent.relay(value, source) : undefined;
  }

  sub(handler) {
    if (this.subscribers.indexOf(handler) === -1) {
      this.subscribers.push(handler);
    }
    return this;
  }
  unsub(handler) {
    if (!this.hanlders) {
      return this;
    }
    const i = this.subscribers.indexOf(handler);
    if (i !== -1) {
      this.subscribers.splice(i, 1);
    }
    return this;
  }
  walk(handler) {
    if (handler(this) !== false) {
      for (const k of this.children) {
        const c = this.children[k];
        if (this.walk(c) === false) {
          return false;
        }
      }
      return true;
    } else {
      return false;
    }
  }
}
export const root = new Topic();
export const topic = (name) => root.ensure(name);
