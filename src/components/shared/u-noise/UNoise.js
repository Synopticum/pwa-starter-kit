import {html, LitElement} from 'lit-element/lit-element';
import props from './UNoise.props';
import styles from './UNoise.styles';

export class UNoise extends LitElement {
    /*
        List of required methods
        Needed for initialization, rendering, fetching and setting default values
    */
    static get properties() {
        return props;
    }

    static get styles() {
        return styles;
    }

    render() {
        return html`      
      <style>
        :host {
        
        }
      </style>
      
      <div class="u-noise">
        <canvas class="noise"></canvas>
      </div>
    `;
    }

    firstUpdated() {
        this._init();
    }

    _init() {
        this._setReferences();
        this._setListeners();
        this.noise();
    }

    _setReferences() {
        this.$canvas = this.shadowRoot.querySelector('.noise');
    }

    _setListeners() {
        this.addEventListener('something-happened', this.somethingHappened);
    }

    disconnectedCallback() {
        this.stopNoise();
    }
    /*
        List of custom component's methods
        Any other methods
    */

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
            canvas = this.$canvas;
            ctx = this.$canvas.getContext('2d');
            setup();
        })();
    }

    stopNoise() {
        clearTimeout(this.loopTimeout);
    }
}

window.customElements.define('u-noise', UNoise);