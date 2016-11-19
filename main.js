
import log                from 'loglevel';
import Disassembler       from './system/disasm';
import Renderer           from './dom/renderer';
import Input              from './dom/input';
import EmulationWorker    from 'worker-loader!./chip8-worker.js';

const DISPLAY_SCALE = 10;

let disasm = new Disassembler();
let btn = document.getElementById('btnstop');
let keyboard = new Input(inputSignal);
let renderer = new Renderer(document.getElementById('display'), DISPLAY_SCALE);

log.info(`CHIP-8 Virtual Machine`);

let emuWorker = new EmulationWorker();

emuWorker.addEventListener('message', (message) => {
  switch(message.data.action)
  {
    case 'render':
      //console.log(message.data.args.frameBuffer);
      renderer.Render(message.data.args.frameBuffer);
      break;
    case 'error':
        let trace_instructions = disasm.decode(message.data.args.trace.i);
        for (var t=0; t<message.data.args.trace.i.length; t++)
        {
          var o = `[${message.data.args.trace.a[t].toString(16)}] (0x${message.data.args.trace.i[t].toString(16)}) ${trace_instructions[t].m} \t\t\t\t\t ${trace_instructions[t].d}`;
          if (message.data.args.trace.a[t] == message.data.args.address)
            log.error(o);
          else
            log.debug(o);
        }
      break;
  }
});

function inputSignal(keyState)
{
  emuWorker.postMessage({action: 'input', args: {keyState}});
}

btn.onclick = () => {
  emuWorker.postMessage({action: 'halt'});
};
