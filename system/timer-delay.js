
const FREQUENCY = 1000/60; // 60Hz

export default class DelayTimer
{
  constructor()
  {
    this.counter = 0;
    this._timerId = null;
  }

  set(value)
  {
    this.counter = value & 0xff;
    this._start();
  }

  get(value)
  {
    return this.counter;
  }

  intervalFunc()
  {
    this.counter--;
    if (this.counter == 0) this._stop();
  }

  _start()
  {
    this._timerId = self.setInterval((this.intervalFunc).bind(this));
  }

  _stop()
  {
    if (this._timerId)
    {
      self.clearInterval(this._timerId);
      this._timerId = null;
    }
  }
}
