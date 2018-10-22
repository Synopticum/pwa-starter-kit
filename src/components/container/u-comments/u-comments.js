import { html, LitElement } from '@polymer/lit-element';
import { SharedStyles } from '../../shared-styles';
import { repeat } from 'lit-html/directives/repeat';

import { store } from '../../../store';
import { connect } from 'pwa-helpers';
import { getComments, putComment, typeComment, deleteComment, comments } from './redux';
store.addReducers({ comments });

export class UComments extends connect(store)(LitElement) {

  static get properties() {
    return {
      originType: {
        type: String,
        attribute: 'origin-type'
      },
      originId: {
        type: String,
        attribute: 'origin-id'
      },

      _currentMessage: {
        type: String,
        attribute: false
      },
      _comments: {
        type: Array,
        attribute: false
      }
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
      </style>
      
      <div class="title">Комментарии</div>
      
      <div class="comments">
        ${repeat(this._comments, comment => comment.id, comment => html`
          <u-comment .user="${this._user}" .comment="${comment}" @delete="${this.deleteComment.bind(this)}"></u-comment>
        `)}
      </div>
      
      <div class="add">
        <textarea id="comment-to-add" @input="${UComments.typeComment.bind(this)}" .value="${this._currentMessage}"></textarea><br>
        <button @click="${this.addComment.bind(this)}">add</button>
      </div>
    `
  }

  stateChanged(state) {
    let pageType = `${this.originType}Page`;

    this._user = state.app.user;
    this._comments = state.comments[pageType].items;
    this._currentMessage = state.comments[pageType].currentMessage;
  }

  firstUpdated() {
    store.dispatch(getComments(this.originType, this.originId));
  }

  static typeComment(e) {
    store.dispatch(typeComment(this.originType, e.currentTarget.value));
  }

  addComment() {
    store.dispatch(putComment(this.originType, this.originId, {
      id: uuidv4(),
      originType: this.originType,
      originId: this.originId,
      text: this._currentMessage,
      date: Date.now(),
      author: `${this._user.firstName} ${this._user.lastName}`
    }));
  }

  deleteComment(e) {
    let commentId = e.detail;
    store.dispatch(deleteComment(this.originType, this.originId, commentId));
  }
}

window.customElements.define('u-comments', UComments);