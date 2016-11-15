
import log from 'loglevel';
import Chip8 from './chip8';
import Disassembler from './system/disasm';

let disasm = new Disassembler();

//console.log(disasm.decode(0x8011)[0]);

log.info(`CHIP-8 Virtual Machine`);

let canvas = document.getElementById('display');
let c = new Chip8(canvas);

///window.console = {log: function(){}}

c.on('error', (data) => {

    c.halt();
    log.error("\n",data.error,"\n");
    let trace_instructions = disasm.decode(data.trace.i);
    for (var t=0; t<data.trace.i.length; t++)
    {
      log.error(`[${data.trace.a[t].toString(16)}]: ${trace_instructions[t].m} \t\t\t\t\t ${trace_instructions[t].d}`);
    }

    //log.error(trace_instructions);

})

c.load('rom-json/pong.json', () => {    // insert the cartridge...

    c.poweron();                        // switch it on :)

});
