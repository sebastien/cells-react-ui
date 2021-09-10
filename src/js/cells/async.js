class Deferred {
  constructor(delay, callback) {
    this.timeout = null;
    this.delay = 0;
    this.callback = undefined;
    this.push(callback, delay);
  }

  push(delay, callback) {
    this.cancel();
    if (delay !== undefined) {
      this.delay = delay;
    }
    if (callback !== undefined) {
      this.callback = callback;
    }
    if (this.delay === 0) {
      if (this.callback) this.callback();
    } else {
      this.timeout = window.setTimeout((_) => this.callback(), this.delay);
    }
    return this;
  }

  cancel() {
    if (this.timeout !== null) {
      window.clearTimeout(this.timeout);
      this.timeout = null;
    }
    return this;
  }
}

export const defer = (delay, callback) => new Deferred(delay, callback);
