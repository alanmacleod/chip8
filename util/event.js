

export default class EventEmitter
{
  constructor()
  {
    this.listeners = new Map();
    this.on = this.addListener;
    this.fire = this.emit;

  }

  addListener(label, fn)
  {
    this.listeners.has(label) || this.listeners.set(label, []);
    this.listeners.get(label).push(fn);
  }

  _isFunction(obj)
  {
    return typeof obj == 'function' || false;
  }

  removeListener(label, fn)
  {
    let listeners = this.listeners.get(label),
        index;

    if (listeners && listeners.length)
    {
        index = listeners.reduce((i, listener, index) => {
          return (_isFunction(listener) && listener === callback) ?
            i = index :
            i;
        }, -1);

        if (index > -1)
        {
            listeners.splice(index, 1);
            this.listeners.set(label, listeners);
            return true;
        }
    }
    return false;
  }

  emit(label, ...args)
  {
    let listeners = this.listeners.get(label);
    if (listeners && listeners.length)
    {
      listeners.forEach((listener) => {
        listener(...args)
      });
      return true;
    }
    return false;
  }
}
