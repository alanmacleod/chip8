
import log                from 'loglevel';
import Disassembler       from './system/disasm';
import Renderer           from './dom/renderer';
import Input              from './dom/input';
import EmulationWorker    from 'worker-loader!./chip8-worker.js';

const DISPLAY_SCALE = 15;

let btnHalt   = document.getElementById('btnstopdump');
let btnPause  = document.getElementById('btnpause');
let btnStep   = document.getElementById('btnstep');
let btnResume = document.getElementById('btnresume');

let disasm    = new Disassembler();
let keyboard  = new Input(inputSignal);
let renderer  = new Renderer(document.getElementById('display'), DISPLAY_SCALE);

log.info(`CHIP-8 Virtual Machine`);

let emuWorker = new EmulationWorker();

emuWorker.addEventListener('message', (message) => {
  switch(message.data.action)
  {
    case 'render':
      renderer.Render(message.data.args.frameBuffer);
      break;
    case 'error':
        let {trace, address, error, registers} = message.data.args;
        let trace_instructions = disasm.decode(trace.i);

        log.error(error);

        for (var t=0; t<trace.i.length; t++)
        {
          var o = `[${trace.a[t].toString(16)}] (0x${trace.i[t].toString(16)}) ${trace_instructions[t].m} \t\t\t\t\t ${trace_instructions[t].d}`;
          if (trace.a[t] == address)
            log.error(o);
          else
            log.debug(o);
        }
        log.error(registers);
      break;
  }
});

function inputSignal(keyState)
{
  emuWorker.postMessage({action: 'input', args: {keyState}});
}

btnHalt.onclick = () => {
  emuWorker.postMessage({action: 'haltdump'});
};

btnPause.onclick = () => {
  emuWorker.postMessage({action: 'pause'});
};

btnStep.onclick = () => {
  emuWorker.postMessage({action: 'step'});
};

btnResume.onclick = () => {
  emuWorker.postMessage({action: 'resume'});
};
