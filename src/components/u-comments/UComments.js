import { html, LitElement } from 'lit-element/lit-element';
import { repeat } from 'lit-element/node_modules/lit-html/directives/repeat';

import { store } from '../../store';
import { connect } from 'pwa-helpers';
import { getComments, putComment, typeComment, deleteComment } from './UComments.actions';
import { comments } from "../../reducers/Comments.reducer";

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
          <u-comment .user="${this._user}" .comment="${comment}" @delete="${this.delete.bind(this)}"></u-comment>
        `)}
      </div>
      
      <form class="form">
        <u-textarea
            type="default"
            id="comment-to-add" 
            class="textarea"
            placeholder="Добавить комментарий"
            @keyup="${this.validate}"
            required></u-textarea>
            
        <button 
            class="button"
            id="add-comment"
            ?disabled="${!this._isValid}"
            @click="${this.add.bind(this)}">Добавить</button>
      </form>
    `
  }

  constructor() {
    super();
    this._setDefaults();
  }

  stateChanged(state) {
    let pageType = `${this.originType}Page`;

    this._user = state.app.user;
    this._comments = state.comments[pageType].items;
  }

  firstUpdated() {
    this._init();
    this._setReferences();
  }

  add(e) {
    e.preventDefault();

    store.dispatch(putComment(this.originType, this.originId, {
      id: uuidv4(),
      originType: this.originType,
      originId: this.originId,
      text: this.$textarea.value,
      date: moment().unix(),
      author: `${this._user.firstName} ${this._user.lastName}`
    }));
  }

  delete(e) {
    let commentId = e.detail;
    store.dispatch(deleteComment(this.originType, this.originId, commentId));
  }

  validate() {
    this.$textarea.value ? this._isValid = true : this._isValid = false;
  }

  _setDefaults() {
    this._isValid = false;
  }

  _init() {
    store.dispatch(getComments(this.originType, this.originId));
  }

  _setReferences() {
    this.$textarea = this.shadowRoot.querySelector('#comment-to-add');
  }
}

window.customElements.define('u-comments', UComments);