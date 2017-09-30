# chip8
Chip8 emulator and debugger

![running emulator](https://raw.githubusercontent.com/alanmacleod/chip8/master/build/screenshot1.png)

Emulating the Chip8 is probably the "Hello, World!" of emulation software development and, I reckon fair to say; a rite of passage. This is my first stab at an emu and unfortunately, I haven't quite aced the challenge but I did my best to construct an 'academic' implementation of an emulator. This is defintiley not built for performance! But it has pleasant looking code like this:

[./system/chip8.js](https://github.com/alanmacleod/chip8/blob/master/system/chip8.js#L39)
```js
  cycle()
  {    
    for (let t=0; t<this.cycles; t++)
    {
      if (!this._executing) 
        return;
      
      this.cpu.execute(
        this.cpu.decode(
          this.cpu.fetch()
        )
      )
      
    }
  }
```

Features:

* Debug: step, dump, stack-trace, disassembler
* Separate UI and emulation threads (WebWorker)
* System 'BIOS' 
* Load ROM over http
* Clean abstraction of system componenets (see `./system/` directory)
* Opcode jump table
* Messaging system for decoupled architecture


It was really fun to write this! As mentioned it was more of an academic exercise in implementing the basic structure of a hardware emulator. It was more about the means than the ends. I think the next step up is a Gameboy emulator... but I've had my fill of emu dev :|
