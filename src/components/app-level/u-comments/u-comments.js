import { html, LitElement } from '@polymer/lit-element';
import { SharedStyles } from '../../shared-styles';
import { repeat } from 'lit-html/directives/repeat';

import { store } from '../../../store';
import { connect } from 'pwa-helpers';
import { getComments, putComment, comments } from './redux';
store.addReducers({ comments });

export class UComments extends connect(store)(LitElement) {
  constructor() {
    super();
    this.addEventListener('change-comment', e => { this._text = e.detail });
  }

  static get properties() {
    return {
      type: {
        type: String
      },
      id: {
        type: String
      },

      _text: {
        type: String,
        attribute: false
      },
      _comments: {
        type: Array,
        attribute: false
      },
    }
  }

  render() {
    return html`
      ${SharedStyles}
      
      <style>
        :host {
        }
        
        .title {
            font-size: 24px;
        }
        
        .comment {
            padding: 10px 0;
            margin: 10px;
            border-bottom: 1px solid #ccc;
            line-height: 1.3;
        }
        
        .comment__meta {
            display: flex;
            justify-content: flex-end;
            font-size: 12px;
            margin-top: 5px;
        }
        
        .comment__date {
            margin-left: 5px;
        }
      </style>
      
      <div class="title">Комментарии ${this.id}</div>
      
      <div class="comments">
        ${repeat(this._comments, comment => comment.id, comment => html`
          <div class="comment">
              <div class="comment__text">${comment.text}</div>
              <div class="comment__meta">
                  <div class="comment__author">${comment.author} /</div>
                  <div class="comment__date">${comment.date}</div>
              </div>
          </div>
        `)}
      </div>
      
      <div class="add">
        <textarea id="comment-to-add" @input="${this.changeComment.bind(this)}">${this._text}</textarea><br>
        <button @click="${this.submitComment.bind(this)}">add</button>
      </div>
    `
  }

  _stateChanged(state) {
    this._user = state.app.user;
    this._comments = state.comments.objectPage.items;
  }

  firstUpdated() {
    store.dispatch(getComments(this.type, this.id));
  }

  changeComment(e) {
    this.dispatchEvent(new CustomEvent('change-comment', { detail: e.currentTarget.value }));
  }

  submitComment() {
    store.dispatch(putComment(this.type, this.id, {
      id: uuidv4(),
      originType: this.type,
      originId: this.id,
      text: this._text,
      date: Date.now(),
      author: `${this._user.firstName} ${this._user.lastName}`
    }));
  }
}

window.customElements.define('u-comments', UComments);