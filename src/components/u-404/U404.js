import { html } from 'lit-element/lit-element';
import { PageViewElement } from '../page-view-element/PageViewElement.js';

class U404 extends PageViewElement {
  render() {
    return html`      
      <style>
        :host {
          position: fixed;
          left: 50%;
          bottom: 130px;
          transform: translate(-50%,0);
          z-index: 100;
          width: 700px;
          height: 400px;
          background-color: #ffffff;
          border-radius: 5px;
          pointer-events: all;
          display: flex;
          align-items: center;
          justify-content: center;
        }
      </style>
      
      <section>
        <h2>Потрачено!</h2>
      </section>
    `
  }
}

window.customElements.define('u-404', U404);
