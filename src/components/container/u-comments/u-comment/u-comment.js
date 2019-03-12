import { html, LitElement } from 'lit-element';
import { SharedStyles } from '../../../shared-styles';

export class UComment extends LitElement {

  static get properties() {
    return {
      comment: {
        type: Object
      }
    }
  }

  render() {
    return html`
      ${SharedStyles}
      
      <style>
        :host {
            position: relative;
            padding: 10px 0;
            margin: 10px;
            border-bottom: 1px solid #ccc;
            line-height: 1.3;
        }
        
        .text {
            font-size: 14px;
        }
        
        .meta {
            display: flex;
            justify-content: flex-end;
            font-size: 12px;
            margin-top: 5px;
        }
        
        .date {
            margin-left: 5px;
        }
        
        .controls {
            position: absolute;
            right: 0;
            top: 10px;
        }
        
        .controls__delete {
            cursor: pointer;
            display: block;
            width: 12px;
            height: 12px;
            background: url("static/images/x.svg") no-repeat 50% 50%;
        }
      </style>
      
      <div class="text">${this.comment.text}</div>
        
      <div class="meta">
          <div class="author">${this.comment.author} /</div>
          <div class="date">${this.comment.date}</div>
      </div>
      
      <div class="controls">
        <div class="controls__delete" @click="${this.delete.bind(this)}"></div>
      </div>
    `
  }

  delete() {
    this.dispatchEvent(new CustomEvent('delete', { detail: this.comment.id, composed: true }));
  }
}

window.customElements.define('u-comment', UComment);