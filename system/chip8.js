
import Base               from '../util/base';
import Loader             from '../util/loader';
import Input              from '../dom/input';
import CPU                from './cpu/cpu';
import RAM                from './ram';
import GFX                from './gfx';
import log                from 'loglevel';

import Disassembler       from './disasm';

const BIOS_URL  = "./bios.json";

export default class Chip8 extends Base
{
  constructor()
  {
    super();
    log.setLevel('debug');

    this.disasm = new Disassembler();

    this.cycles = 1;

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
    //console.log("cycle"); return;
    for (let t=0; t<this.cycles; t++)
    {
      if (!this._executing) return;
      let opcode = this.cpu.fetch();
      //let d = this.disasm.decode(opcode);
    //  log.debug(`[${this.cpu.reg.ip.toString(16)}] ${d.m}\t\t${d.d}`);
      this.cpu.execute(
        this.cpu.decode(
          opcode
        )
      )
    }
  }

  poweron()
  {
    this._executing = true;
    this.cycleTimer = setInterval((this.cycle).bind(this), 10);
  }

  halt()
  {
    log.warn("Halting execution...");
    this._executing = false;
    clearInterval(this.cycleTimer);
  }

  pausedump()
  {
    this._executing = false;
    this._dump();
  }

  step()
  {
    this._executing = false;

    let opcode = this.cpu.fetch();
    let d = this.disasm.decode(opcode);
    log.debug(`[${this.cpu.reg.ip.toString(16)}] ${d.m}\t\t${d.d}`);
    this.cpu.execute(
      this.cpu.decode(
        opcode
      )
    )

    this._dump();
  }

  resume()
  {
    this._executing = true;
  }

  haltdump()
  {
    this.halt();
    this._dump();
  }

  _dump()
  {
    let s = '';

    for (let t=0,{v}=this.cpu.reg; t<v.length; t++)
    {
      s += `v${t.toString(16)}=${v[t]}`;
      s += t<v.length-1 ? ', ' : '';
    }

    log.warn(s);
    log.warn(`i=${this.cpu.reg.i}, vf=${this.cpu.reg.vf}, ip=0x${this.cpu.reg.ip.toString(16)}`);
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

    this.cpu.on('debug', (function(data) {
      this._executing = false;
    }).bind(this));

    this.cpu.on('opcode', (function(data) {
      this.halt();
      self.postMessage({
        action: 'error',
        args:{
          error: data.error,
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
      case 'pause':
        this.pausedump();
        break;
      case 'resume':
        this.resume();
        break;
      case 'haltdump':
        this.haltdump();
        break;
      case 'step':
        this.step();
        break;
    }
  }


}
