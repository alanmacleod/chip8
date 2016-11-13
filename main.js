
import Chip8 from './chip8';
console.log("CHIP8 Virtual Machine init()");
let c = new Chip8();

c.on('error', (data) => {
  c.stop();
  console.log("\n",data.error,"\n");
})

c.load('rom-json/pong.json', () => {
    c.start();
});
