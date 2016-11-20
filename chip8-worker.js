import Chip8 from './system/chip8';

let c = new Chip8();

c.load('rom-json/pong.json', () => {    // insert the cartridge...
    c.poweron();                        // switch it on :)
});
