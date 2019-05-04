import { html, LitElement } from 'lit-element/lit-element';

export class UComment extends LitElement {

  static get properties() {
    return {
      comment: {
        type: Object
      },
      isDeleting: {
        type: Boolean,
        attribute: false
      }
    }
  }

  render() {
    return html`      
      <style>
        :host {
            display: block;
            position: relative;
            padding: 10px 0;
            margin: 10px 0;
            border-bottom: 1px solid #ccc;
            line-height: 1.3;
        }
        
        .comment {
            opacity: 1;
            transition: opacity .3s;
        }
        
        .comment--is-deleting {
            opacity: .1;
            text-decoration: line-through;
        }
        
        .comment__text {
            font-size: 14px;
        }
        
        .comment-meta {
            display: flex;
            justify-content: flex-end;
            font-size: 12px;
            margin-top: 5px;
        }
        
        .comment-meta__date {
            margin-left: 5px;
        }
        
        .comment-controls {
            position: absolute;
            right: 0;
            top: 10px;
        }
        
        .comment-controls__delete {
            cursor: pointer;
            display: block;
            width: 12px;
            height: 12px;
            background: url("static/images/button-icons/x.svg") no-repeat 50% 50%;
        }
      </style>
      
      <div class="comment ${this.isDeleting ? 'comment--is-deleting' : ''}">
        <div class="comment__text">${this.comment.text}</div>
          
        <div class="comment-meta">
            <div class="comment-meta__author">${this.comment.author} / </div>
            <div class="comment-meta__date">${moment.unix(this.comment.date).format("DD.MM.YYYY")}</div>
        </div>
        
        <div class="comment-controls">
          <div class="comment-controls__delete" @click="${() => this.delete()}"></div>
        </div>
      </div>
    `
  }

  delete() {
    this.dispatchEvent(new CustomEvent('delete', { detail: this.comment.id, composed: true }));
  }
}

window.customElements.define('u-comment', UComment);