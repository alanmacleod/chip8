import log from 'loglevel';

export default class Input
{

  constructor(element)
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

    this.keyMap = [
      'x', '1', '2', '3',
      'q', 'w', 'e', 'a',
      's', 'd', 'z', 'c',
      '4', 'r', 'f', 'v'
    ];

    this._init(element);
  }

  _init(element)
  {
    //HACK: convert array into integer ascii codes for quicker lookup
    for (let k=0;k<this.keyMap.length;k++)
      this.keyMap[k] = this.keyMap[k].charCodeAt(0);

    window.addEventListener('keydown', (e) => {
      log.warn(e.keyCode);
      for (let k=0; k<this.keyMap.length; k++)
      {
        if (this.keyMap[k] == e.keyCode)
          log.warn('Keypress '+k);
      }
    }, true);

  }

}
