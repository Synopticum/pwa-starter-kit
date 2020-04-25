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
        opacity: .04;
      }
      
      :host([idle]) {
        background: transparent;
        pointer-events: none;
      }
      
      :host([idle]) .noise,
      :host([idle]) .loader {
        display: none;
      }
      
      .loader {
        position: absolute;
        left: 0;
        top: 0;
        right: 0;
        bottom: 0;
        background: url('/static/images/loading.png') no-repeat 50% 50%;
        
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
