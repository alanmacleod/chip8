
import Chip8 from './chip8';

console.log("CHIP-8 Virtual Machine v0.1");


let c = new Chip8();

c.on('error', (data) => {

    c.halt();
    console.log("\n",data.error,"\n");

})

c.load('rom-json/pong.json', () => {    // insert the cartridge :)

    c.poweron();                        // switch it on!

});
