import log from 'loglevel';

export default class Input
{
  // Note, the keystates are written direclty into the Chip8's BIOS/RAM
  // for direct access by the CPU

  constructor(callback)
  {
    // 1 2 3 C
    // 4 5 6 D
    // 7 8 9 E
    // A 0 B F
    // this.keyMap = [
    //   1:'1', 2:'2', 3:'3', c:'4',
    //   4:'q', 5:'w', 6:'e', d:'r',
    //   7:'a', 8:'s', 9:'d', e:'f',
    //   10:'z', :0'x', B:'c', f:'v'
    // ];

    this.keyData = new Uint8Array(16);
    this._callback = callback;

    this.keyMap = [
      'x', '1', '2', '3',
      'q', 'w', 'e', 'a',
      's', 'd', 'z', 'c',
      '4', 'r', 'f', 'v'
    ];

    this._init();
  }

  _setKeyDown(key)
  {
      this.keyData[key] = 1;
      if (this._callback) this._callback(this.keyData);
  }

  _setKeyUp(key)
  {
      this.keyData[key] = 0;
      if (this._callback) this._callback(this.keyData);
  }

  _init()
  {
    //HACK: convert array into integer ascii codes for quicker lookup
    for (let k=0;k<this.keyMap.length;k++)
      this.keyMap[k] = this.keyMap[k].charCodeAt(0);

    window.addEventListener('keydown', (e) => {
      var code = String.fromCharCode(e.keyCode).toLowerCase().charCodeAt(0)
      for (let k=0; k<this.keyMap.length; k++)
      {
        if (this.keyMap[k] == code)
          this._setKeyDown(k);
      }
      //this.printTable();
    }, true);

    window.addEventListener('keyup', (e) => {
      //log.warn();
      var code = String.fromCharCode(e.keyCode).toLowerCase().charCodeAt(0)
      for (let k=0; k<this.keyMap.length; k++)
      {
        if (this.keyMap[k] == code)
          this._setKeyUp(k);
      }
    }, true);

  }



}
