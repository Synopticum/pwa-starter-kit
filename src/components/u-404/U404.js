import {html} from 'lit-element/lit-element';
import {PageViewElement} from '../page-view-element/PageViewElement.js';

class U404 extends PageViewElement {
  render() {
    return html`      
      <style>
        :host {
          position: fixed;
          left: 50%;
          top: 50%;
          width: 100%;
          height: 100%;
          transform: translate(-50%,-50%);
          z-index: 100;
          padding-top: 250px;
          pointer-events: all;
          display: flex;
          align-items: center;
          justify-content: center;
          background: url('static/images/spinner.gif') no-repeat 50% 50%, radial-gradient(ellipse at center, rgba(0,0,0,0.65) 0%,rgba(0,0,0,0) 100%);
          color: #ffffff;
          text-shadow: 1px 1px 0 #000;
          white-space: nowrap;
          font-size: 24px;
        }

        :host([hidden]) {
            display: none;
        }
      </style>
      
      <div class="u-404">
        <section class="not-found">
          <h1>Абонентны алырга мөмкин түгель</h1>
        </section>
      </div>
    `
  }
}

window.customElements.define('u-404', U404);
