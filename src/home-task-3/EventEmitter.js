class EventEmitter {
  listeners = {}; // key-value pair

  addListener(eventName, fn) {
    this.on(eventName, fn);
  }

  on(eventName, fn) {
    if (this.listeners[eventName]) {
      this.listeners[eventName].push({ listener: fn, once: false });
    } else {
      this.listeners[eventName] = [{ listener: fn, once: false }];
    }
  }

  removeListener(eventName, fn) {
    this.off(eventName, fn);
  }

  off(eventName, fn) {
    if (!this.listeners[eventName]) {
      return;
    }

    this.listeners[eventName] = this.listeners[eventName].filter(({ listener }) => listener !== fn);

    if (!this.listeners[eventName].length) {
      delete this.listeners[eventName];
    }
  }

  once(eventName, fn) {
    if (this.listeners[eventName]) {
      this.listeners[eventName].push({ listener: fn, once: true });
    } else {
      this.listeners[eventName] = [{ listener: fn, once: true }];
    }
  }

  emit(eventName, ...args) {
    const listenerList = this.listeners[eventName];

    if (!listenerList?.length) {
      return;
    }

    this.listeners[eventName] = listenerList.filter(({ listener, once }) => {
      listener(...args);
      return !once;
    });
  }

  listenerCount(eventName) {
    return this.listeners[eventName]?.length ?? 0;
  }

  rawListeners(eventName) {
    return this.listeners[eventName]?.map(({ listener }) => listener) ?? [];
  }
}

module.exports = { EventEmitter };
