
import Base               from './util/base';
import CPU                from './system/cpu/cpu';
import RAM                from './system/ram';
import Loader             from './util/loader';

export default class Chip8 extends Base
{
  constructor()
  {
    super();

    this.cpu = new CPU();
    this.ram = new RAM();

    this.ram.on('gpf', (function(data) {
      this.emit('error', data);
    }).bind(this));

    this.cpu.on('opcode', (function(data) {
      this.emit('error', data);
      this.cpu._debug_dump_registers();
    }).bind(this));

    this.reset();
    this._executing = false;
  }

  start()
  {
    this._executing = true;

    //TODO: requestAnimationFrame or setTimeout() here, "while()" locks-up browsers!

    while(this._executing)
    {
       this.cpu.execute(
         this.cpu.decode(
           this.cpu.fetch(this.ram)
         )
       );
    }
  }

  stop()
  {
    console.log("Halting execution...");
    this._executing = false;
  }

  load(url, callback)
  {
    let l = new Loader();

    console.log("Loading ROM: "+url);

    l.load(url, (data) => {
      console.log(`Loading title '${data.title}'`);

      let buffer = this._base64ToArrayBuffer(data.binary);
      this.ram.blit(buffer, 512);

      callback();

    });

  }

  _base64ToArrayBuffer(base64) {
    var binary_string =  window.atob(base64);
    var len = binary_string.length;

    var bytes = new Uint8Array( len );
    for (var i = 0; i < len; i++)
        bytes[i] = binary_string.charCodeAt(i);

    return bytes;
  }

  reset()
  {
    this.cpu.reset();
    this.ram.reset();


  }

}
