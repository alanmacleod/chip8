
const FREQUENCY = 1000/60; // 60Hz

export default class DelayTimer
{
  constructor()
  {
    this.counter = 0;
    this._timerId = null;
    //this._startTime = 0;
  }

  set(value)
  {
    //this._startTime = (new Date()).getTime();
    this.counter = value & 0xff;
    this._start();
  }

  get(value)
  {
    //console.log(`-> DELAY.get() [=${this.counter}]`)
    return this.counter;
  }

  _start()
  {
    if (this._timerId) return; //already running
    if (window.setInterval)
    {
      this._timerId = window.setInterval(() =>{
        //console.log("COUNTING DOWN: "+this.counter);
        this.counter--;
        if (this.counter == 0) {
          //console.log("Stopping...", this._stop, this._timerId);
          this._stop();
        }
      }, FREQUENCY);
    }
  }

  _stop()
  {
    // var e = (new Date()).getTime() - this._startTime;
    // console.log("Took "+e+" ms");
    if (window.clearInterval && this._timerId)
    {
      window.clearInterval(this._timerId);
      this._timerId = null;
    }
  }
}
