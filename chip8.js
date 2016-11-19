
import Base               from './util/base';
import CPU                from './system/cpu/cpu';
import RAM                from './system/ram';
import Loader             from './util/loader';
import GFX                from './system/gfx';
import log                from 'loglevel';
import Input              from './dom/input';

const BIOS_URL = "./bios.json";

export default class Chip8 extends Base
{
  constructor()
  {
    super();
    log.setLevel('debug');

    this.cycles = 50;

    this.ram = new RAM();
    this.gfx = new GFX(this.ram.data);
    this.cpu = new CPU(this.gfx, this.ram);

    this.loader = new Loader();
    this.cycleTimer = null;

    this._initEvents();
    this._reset();
    this._init_bios();
    this._executing = false;
  }

  cycle()
  {
    for (let t=0; t<this.cycles; t++)
    {
      if (!this._executing) return;
      this.cpu.execute(
        this.cpu.decode(
          this.cpu.fetch()
        )
      )
    }
  }

  poweron()
  {
    this._executing = true;
    this.cycleTimer = setInterval((this.cycle).bind(this), 1000/(60*2));
  }

  halt()
  {
    log.warn("Halting execution...");
    this._executing = false;
    clearInterval(this.cycleTimer);
  }

  load(url, callback)
  {
    log.debug(`Fetching: '${url}'`);

    this.loader.load(url, (data) => {
      log.info(`Opening title '${data.title}'`);

      let buffer = this._base64ToArrayBuffer(data.binary);
      this.ram.blit(buffer, 512);

      callback();

    });
  }

  _init_bios()
  {
    // Load the "BIOS" characters into the protected area

    this.loader.load(BIOS_URL, (bios_data) => {

      let bytes = bios_data.bin.split(',');
      let _data = new ArrayBuffer(bytes.length);
      let data = new Uint8Array(_data);
      let p = 0;

      for (let charline of bytes)
        data[p++] = (parseInt("0x"+charline, 16) & 0xff);

      this.ram.blit(data, this.ram.getCharAddrBIOS());
    });

  }

  _base64ToArrayBuffer(base64)
  {
    var binary_string =  self.atob(base64);
    var len = binary_string.length;

    var bytes = new Uint8Array( len );
    for (var i = 0; i < len; i++)
        bytes[i] = binary_string.charCodeAt(i);

    return bytes;
  }

  _reset()
  {
    this.cpu.reset();
    this.ram.reset();
  }

  _initEvents()
  {
    this.ram.on('gpf', (function(data) {
      this.emit('error', data);
    }).bind(this)); // Override 'this' to use Chip8() context instead of RAM()'s

    this.cpu.on('opcode', (function(data) {
      this.halt();
      self.postMessage({
        action: 'error',
        args:{
          trace: this.cpu.trace(),
          registers: this.cpu.dump_registers(),
          address: this.cpu.reg.ip
        }
      });
    }).bind(this));

    this.gfx.on('changed', (function() {
        self.postMessage({
          action: 'render',
          args: {
            frameBuffer: this.gfx.display
          }
        });
    }).bind(this));

    self.onmessage = (this.messageHandler).bind(this);

  }

  messageHandler(msg)
  {
    switch(msg.data.action)
    {
      case 'input':
        this.ram.blit(msg.data.args.keyState, this.ram.getKeyboardBufferAddress());
        break;
      case 'halt':
        this.halt();
        break;
    }
  }


}
