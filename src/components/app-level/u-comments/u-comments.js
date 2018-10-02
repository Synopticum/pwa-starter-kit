import { html, LitElement } from '@polymer/lit-element';
import { SharedStyles } from '../../shared-styles';
import { repeat } from 'lit-html/directives/repeat';

import { store } from '../../../store';
import { connect } from 'pwa-helpers';
import { getComments, putComment, typeComment, comments } from './redux';
store.addReducers({ comments });

export class UComments extends connect(store)(LitElement) {

  static get properties() {
    return {
      type: {
        type: String
      },
      id: {
        type: String
      },

      _currentMessage: {
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
        <textarea id="comment-to-add" @input="${UComments.typeComment.bind(this)}" .value="${this._currentMessage}"></textarea><br>
        <button @click="${this.addComment.bind(this)}">add</button>
      </div>
    `
  }

  _stateChanged(state) {
    let pageType = `${this.type}Page`;

    this._user = state.app.user;
    this._comments = state.comments[pageType].items;
    this._currentMessage = state.comments[pageType].currentMessage;
  }

  firstUpdated() {
    store.dispatch(getComments(this.type, this.id));
  }

  static typeComment(e) {
    store.dispatch(typeComment(this.type, e.currentTarget.value));
  }

  addComment() {
    store.dispatch(putComment(this.type, this.id, {
      id: uuidv4(),
      originType: this.type,
      originId: this.id,
      text: this._currentMessage,
      date: Date.now(),
      author: `${this._user.firstName} ${this._user.lastName}`
    }));
  }
}

window.customElements.define('u-comments', UComments);