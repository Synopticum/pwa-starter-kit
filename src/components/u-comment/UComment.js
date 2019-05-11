import { html, LitElement } from 'lit-element/lit-element';
import { DateTime } from "luxon";

export class UComment extends LitElement {
  /*
      List of required methods
      Needed for initialization, rendering, fetching and setting default values
  */
  static get properties() {
    return {
      comment: {
        type: Object
      },

      isDeleting: {
        type: Boolean,
        attribute: false
      },

      isDeletingAllowed: {
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
            <div class="comment-meta__date">${UComment._getDate(this.comment.date)}</div>
        </div>
        
        <div class="comment-controls">
          ${this.isDeletingAllowed ? html`<div class="comment-controls__delete" @click="${() => this.delete()}"></div>` : ''}
        </div>
      </div>
    `
  }

  firstUpdated() {
    this._init();
  }

  _init() {
    this._setReferences();
    this._setListeners();
  }

  _setReferences() {

  }

  _setListeners() {

  }

  /*
      List of custom component's methods
      Any other methods
  */
  delete() {
    this.dispatchEvent(new CustomEvent('delete', { detail: this.comment.id, composed: true }));
  }

  static _getDate(unixtime) {
    return DateTime
            .fromMillis(parseInt(unixtime))
            .setLocale('ru')
            .toLocaleString(DateTime.DATETIME_MED);
  }
}

window.customElements.define('u-comment', UComment);