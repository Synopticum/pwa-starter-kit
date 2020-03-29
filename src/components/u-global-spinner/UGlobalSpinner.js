class UGlobalSpinner extends HTMLElement {
  constructor() {
    super();

    this.createTemplate();
    this.createStyle();
    this.noise();
  }

  createTemplate() {
    const template = document.getElementById('u-global-spinner');

    this.shadow = this.attachShadow({ mode: 'open' });
    this.shadow.appendChild(template.content);
  }

  createStyle() {
    const style = document.createElement('style');

    style.textContent = `
      :host {
        position: fixed;
        left: 0;
        top: 0;
        right: 0;
        bottom: 0;
        z-index: 999;
        background-color: #ffffff;
        display: flex;
        justify-content: center;
        align-items: center;
        transition: background-color .2s;
      }
      
      .noise {
        position: absolute;
        left: 0;
        top: 0;
        right: 0;
        bottom: 0;
        opacity: .05;
      }
      
      :host([idle]) {
        background: transparent;
        pointer-events: none;
      }
      
      :host([idle]) .noise,
      :host([idle]) .loader {
        display: none;
      }
      
      .loader,
      .loader::before,
      .loader::after {
        height: 4em;
      }
      
      .loader {
        width: 3px;
        background: #fff;
        animation: loadCenter 1s infinite ease-in-out;
      }
      
      .loader::before {
        width: 25px;
        background: red;
        animation: loadBefore 1s infinite ease-in-out;
      }
      
      .loader::after {
        width: 25px;
        background: green;
        animation: loadAfter 1s infinite ease-in-out;
      }
      
      .loader {
        color: #000000;
        text-indent: -9999em;
        margin: 88px auto;
        position: relative;
        font-size: 11px;
        transform: translateZ(0);
        animation-delay: -0.16s;
      }
      
      .loader::before,
      .loader::after {
        position: absolute;
        top: 0;
        content: '';
      }
      
      .loader::before {
        left: -25px;
        animation-delay: -0.32s;
      }
      
      .loader::after {
        left: 3px;
      }
      
      @keyframes loadBefore {
        0%,
        80%,
        100% {
          box-shadow: 0 0 0 red;
          height: 4em;
        }
        40% {
          box-shadow: 0 -2em 0 red;
          height: 5em;
        }
      }
      
      @keyframes loadCenter {
        0%,
        80%,
        100% {
          box-shadow: 0 0 0 white;
          height: 4em;
        }
        40% {
          box-shadow: 0 -2em 0 white;
          height: 5em;
        }
      }
      
      @keyframes loadAfter {
        0%,
        80%,
        100% {
          box-shadow: 0 0 0 green;
          height: 4em;
        }
        40% {
          box-shadow: 0 -2em 0 green;
          height: 5em;
        }
      }
    `;

    this.shadow.appendChild(style);
  }

  noise() {
    let canvas, ctx;

    let wWidth, wHeight;

    let noiseData = [];
    let frame = 0;

    let loopTimeout;


    // Create Noise
    const createNoise = () => {
      const idata = ctx.createImageData(wWidth, wHeight);
      const buffer32 = new Uint32Array(idata.data.buffer);
      const len = buffer32.length;

      for (let i = 0; i < len; i++) {
        if (Math.random() < 0.5) {
          buffer32[i] = 0xff000000;
        }
      }

      noiseData.push(idata);
    };


    // Play Noise
    const paintNoise = () => {
      if (frame === 9) {
        frame = 0;
      } else {
        frame++;
      }

      ctx.putImageData(noiseData[frame], 0, 0);
    };


    // Loop
    const loop = () => {
      paintNoise(frame);

      loopTimeout = setTimeout(() => {
        requestAnimationFrame(loop);
      }, (1000 / 25));

      this.loopTimeout = loopTimeout;
    };

    // Setup
    const setup = () => {
      wWidth = window.innerWidth;
      wHeight = window.innerHeight;

      canvas.width = wWidth;
      canvas.height = wHeight;

      for (let i = 0; i < 10; i++) {
        createNoise();
      }

      loop();
    };


    // Reset
    let resizeThrottle;
    const reset = () => {
      window.addEventListener('resize', () => {
        clearTimeout(resizeThrottle);

        resizeThrottle = setTimeout(() => {
          clearTimeout(loopTimeout);
          setup();
        }, 200);
      }, false);
    };


    // Init
    const init = (() => {
      canvas = this.shadow.querySelector('.noise');
      ctx = canvas.getContext('2d');

      setup();
    })();
  }

  stopNoise() {
    clearTimeout(this.loopTimeout);
  }

  static get observedAttributes() { return ['idle']; }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === 'idle' && newValue) {
      this.stopNoise();
    }
  }

  disconnectedCallback() {
    this.stopNoise();
  }
}

window.customElements.define('u-global-spinner', UGlobalSpinner);
