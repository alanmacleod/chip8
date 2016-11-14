
import Base               from './util/base';
import CPU                from './system/cpu/cpu';
import RAM                from './system/ram';
import Loader             from './util/loader';
import GFX                from './system/gfx';
import Renderer           from './dom/renderer';

const BIOS_URL = "./bios.json";

export default class Chip8 extends Base
{
  constructor(displayElement)
  {
    super();

    this.ram = new RAM();
    this.gfx = new GFX(this.ram.data);
    this.cpu = new CPU(this.gfx, this.ram);
    this.renderer = new Renderer(displayElement, this.gfx.display, this.gfx.size(), 20);

    this.loader = new Loader();

    this.ram.on('gpf', (function(data) {
      this.emit('error', data);
    }).bind(this)); // Override 'this' to use Chip8() context instead of RAM()'s

    this.cpu.on('opcode', (function(data) {
      this.emit('error', data);
      this.cpu._debug_dump_registers();
    }).bind(this));

    this.gfx.on('changed', (function() {
        this.renderer.Dirty();
    }).bind(this));

    this.reset();
    this._init_bios();
    this._executing = false;
  }

  frame()
  {
    if (!this._executing) return;

    for (let t=0; t<10; t++)
    {
      //if (!this._executing) return;
       this.cpu.execute(
         this.cpu.decode(
           this.cpu.fetch()
         )
       );
    }

    this.renderer.Render();

    window.requestAnimationFrame((this.frame).bind(this));
  }
  poweron()
  {
    this._executing = true;

    window.requestAnimationFrame((this.frame).bind(this));


  }

  halt()
  {
    console.log("Halting execution...");
    this._executing = false;
  }

  load(url, callback)
  {
    console.log(`Fetching: '${url}'`);

    this.loader.load(url, (data) => {
      console.log(`Loading title '${data.title}'`);

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
