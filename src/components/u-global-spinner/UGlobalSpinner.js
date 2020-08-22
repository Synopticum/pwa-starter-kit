class UGlobalSpinner extends HTMLElement {
  constructor() {
    super();

    this.createTemplate();
    this.createStyle();
    this.noise();
  }

  createTemplate() {
    const template = document.createElement('div');
    template.innerHTML = `
        <canvas class="noise"></canvas>
        <div class="loader">
            <img src="/static/images/components/u-global-spinner/loading.png" class="loading" alt="" />
        </div>
    `;

    this.shadow = this.attachShadow({ mode: 'open' });
    this.shadow.appendChild(template);

    this.shadow.querySelector('.loading').addEventListener('click', () => this.close());
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
        margin: 15px;
        box-shadow: 0 0 0 10px #111;
        outline: 15px solid #111;
        border-radius: 10px;
        display: flex;
        justify-content: center;
        align-items: center;
        transition: background-color .2s;
      }
      
      :host([context="first-time"]) {
        background: rgba(0,0,0,.4);
      }
      
      .noise {
        position: absolute;
        left: 0;
        top: 0;
        right: 0;
        bottom: 0;
        opacity: .04;
      }
      
      :host([context="first-time"]) .noise {
        opacity: .3;
      }
      
      :host([idle]) {
        margin: 0;
        border-radius: 0;
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
        display: flex;
        justify-content: center;
        align-items: center;
      }
      
      .loading {
        pointer-events: none;
      }
      
      @media screen and (max-width: 360px) {
        .loading {
          position: relative;
          left: -10px;
          width: 220px;
          height: 140px;
        }
      }
      
      @media screen and (min-width: 361px) and (max-width: 480px) {
        .loading {
          position: relative;
          left: -10px;
          width: 290px;
          height: 184px;
        }
      }
      
      @media screen and (max-height: 375px) {
        .loading {
          position: relative;
          left: -10px;
          width: 330px;
          height: 210px;
        }
      }
      
      :host([context="first-time"]) .loading {
        pointer-events: all;
        cursor: pointer;
        margin-left: 70px;
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

  close() {
    this.remove();
    this.dispatchEvent(new CustomEvent('close', { composed: true }));
  }
}

window.customElements.define('u-global-spinner', UGlobalSpinner);
