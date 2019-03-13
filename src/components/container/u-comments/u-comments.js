import { html, LitElement } from 'lit-element';
import { repeat } from 'lit-element/node_modules/lit-html/directives/repeat';

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

      _isValid: {
        type: Boolean,
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
      <style>
        :host {
        }
        
        .title {
            font-size: 24px;
        }
        
        .no-comments {
            margin: 10px 0;
            padding: 10px;
            border: 1px dashed #eee;
            font-size: 14px;
        }
        
        .form {
            display: flex;
            flex-direction: column;
        }
        
        .textarea {
            margin-bottom: 10px;
        }
        
        .button {
            align-self: flex-end;
        }
      </style>
      
      <div class="title">Комментарии</div>
      
      <div class="comments">
        ${this._comments.length ? '' : html`<div class="no-comments">Нет комментариев</div>`}
        
        ${repeat(this._comments, comment => comment.id, comment => html`
          <u-comment .user="${this._user}" .comment="${comment}" @delete="${this.deleteComment.bind(this)}"></u-comment>
        `)}
      </div>
      
      <form class="form">
        <u-textarea
            type="default"
            id="comment-to-add" 
            class="textarea"
            placeholder="Добавить комментарий"
            @keyup="${this._validate}"
            required></u-textarea>
            
        <button 
            class="button"
            id="add-comment"
            ?disabled="${!this._isValid}"
            @click="${this.addComment.bind(this)}">Добавить</button>
      </form>
    `
  }

  constructor() {
    super();
    this._isValid = false;
  }

  stateChanged(state) {
    let pageType = `${this.originType}Page`;

    this._user = state.app.user;
    this._comments = state.comments[pageType].items;
  }

  firstUpdated() {
    this.$textarea = this.shadowRoot.querySelector('#comment-to-add');

    store.dispatch(getComments(this.originType, this.originId));
  }

  addComment(e) {
    e.preventDefault();

    store.dispatch(putComment(this.originType, this.originId, {
      id: uuidv4(),
      originType: this.originType,
      originId: this.originId,
      text: this.$textarea.value,
      date: Date.now(),
      author: `${this._user.firstName} ${this._user.lastName}`
    }));
  }

  deleteComment(e) {
    let commentId = e.detail;
    store.dispatch(deleteComment(this.originType, this.originId, commentId));
  }

  _validate() {
    this.$textarea.value ? this._isValid = true : this._isValid = false;
  }
}

window.customElements.define('u-comments', UComments);