
import Base from '../util/base';

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

  draw(i, sx, sy, height)
  {
    let o = (sy * WIDTH) + sx;    // address of display coords
    let d = WIDTH - SPRITE_WIDTH; // offset delta increment
    let s = i;                    // address of sprite in RAM
    let collision = 0;

    for (let y=0; y<height; y++)
    {
      let bit_row = this.ram[s++];

      let pixel, xor_pixel;
      for (let x=SPRITE_WIDTH; x>=0; x--)
      {
        pixel = ((bit_row >> x) & 0x1);    //TODO: *MUST* be a smarter way to write this!!
        xor_pixel = this.ram[o] ^ pixel;
        this.ram[o++] = xor_pixel;
        if (xor_pixel!=pixel) collision = 1;
      }
      o += d;
    }

    this.fire('update');

    return collision;
  }

  clear()
  {
    this.display.fill(0);
    this.fire('update');
  }

}
