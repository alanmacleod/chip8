
import Base   from '../util/base';
import log    from 'loglevel';

const WIDTH = 64, HEIGHT = 32;
const SPRITE_WIDTH = 8;

export default class GFX extends Base
{
  constructor(ram)
  {
    super();
    this._display = new ArrayBuffer (WIDTH * HEIGHT);
    this.display = new Uint8Array(this._display);
    this.ram = ram;

  }

  size()
  {
    return {width: WIDTH, height: HEIGHT};
  }

  draw(i, sx, sy, height)
  {
    let o = (sy * WIDTH) + sx;    // address of display coords
    let d = (WIDTH - SPRITE_WIDTH); // offset delta increment
    let s = i;                    // address of sprite in RAM
    let collision = 0;

    //console.log(`Drawing sprite at ${sx}, ${sy}, offset = ${o}`);

    for (let y=0; y<height; y++)
    {
      let bit_row = this.ram[s++];
      let pixel, xor_pixel;
      for (let x=SPRITE_WIDTH-1; x>=0; x--)
      {
        pixel = ((bit_row >> x) & 0x1);    //TODO: *MUST* be a smarter way to write this!!
        xor_pixel = this.display[o] ^ pixel;
        this.display[o++] = xor_pixel;
        if ((xor_pixel!=pixel) && xor_pixel == 0) collision = 1;
      }
      o += d;
    }

    // below, debug, write out contents of display to console in a wid * hei grid
    // for (var y=0; y<HEIGHT; y++)
    // {
    //   var st = "";
    //   if (y < 10) st += "y 0"+y+":"; else st+= "y "+y+":";
    //   for (var x=0; x<WIDTH; x++)
    //   {
    //       st += this.display[(y * WIDTH)+x] ? "1" : "0"
    //   }
    //   console.log(st);
    // }

    this.fire('changed');
    //if (collision ==1 ) log.info("*** Collision! ***");
    return collision;
  }

  // _set_pixel(x, y, v)
  // {
  //   let offs = (y*WIDTH)+x;
  //   this.display[offs] = v;
  // }

  clear()
  {
    this.display.fill(0);
    this.fire('changed');
  }

}
