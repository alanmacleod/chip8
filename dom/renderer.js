
import log                from 'loglevel';

const DISPLAY_WIDTH = 64, DISPLAY_HEIGHT = 32;

export default class Renderer
{
  constructor(element, scale=1)
  {
    this.element = element;
    //this.video = video;  // pixel buffer of the Chip8 system in bytes

    this.scale = Math.floor(Math.abs(scale)) || 1;

    //this.videodim = dimensions;
    this.dim = {width: DISPLAY_WIDTH * this.scale, height: DISPLAY_HEIGHT * this.scale };

    this.renderContext = this.element.getContext("2d");

    //log.debug(`Video size ${this.video.length} bytes, width: ${this.dim.width}, height: ${this.dim.height}`);
    this.element.width = this.dim.width;
    this.element.height = this.dim.height;

    this.pixel_on = this.renderContext.createImageData(this.scale,this.scale);
    let d  = this.pixel_on.data;
    for (let o=0; o<scale*scale*4; o++)
        d[o]   = 255;

    this.pixel_off = this.renderContext.createImageData(this.scale,this.scale);
    d  = this.pixel_off.data;
    for (let o=0; o<scale*scale*4; o+=4)
    {
        d[o+0]   = 0;
        d[o+1]   = 0;
        d[o+2]   = 0;
        d[o+3]   = 255;
    }

    //this.dirty = false;
  }

  Dirty()
  {
    //this.dirty = true;
  }

  Render(frameBuffer)
  {
    //if (!this.dirty) return;

    var o = 0;
    for (let y=0; y<DISPLAY_HEIGHT; y++)
    {
      for (let x=0; x<DISPLAY_WIDTH; x++)
      {
        let v = frameBuffer[o++];
        let p = v ? this.pixel_on : this.pixel_off
        this.renderContext.putImageData(p, this.scale*x, this.scale*y);
      }
    }
    //this.dirty = false;
  }


}
