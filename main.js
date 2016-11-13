
import Chip8 from './chip8';

let c = new Chip8();

c.on('error', (data) => {
  c.stop();
  console.log("\n",data.error,"\n");
})

c.load('./rom.rom');
c.start();
