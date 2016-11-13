
import Base               from './util/base';
import CPU                from './system/cpu/cpu';
import RAM                from './system/ram';

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
    }).bind(this));

    this.reset();
    this._executing = false;
  }

  start()
  {
    this._executing = true;

    this.ram.writeWord(512, 0x8124); // 8xy0 -> MOV Vx, Vy

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

  load(rom)
  {
    // load cartridge rom into ram

  }

  reset()
  {
    this.cpu.reset();
    this.ram.reset();


  }

}
