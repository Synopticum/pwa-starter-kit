import { html, LitElement } from 'lit-element/lit-element';
import { repeat } from 'lit-element/node_modules/lit-html/directives/repeat';
import isEmpty from 'lodash-es/isEmpty';
import { store } from '../../store';
import { connect } from 'pwa-helpers';
import {putComment, deleteComment, fetchComments} from './UComments.actions';
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

      _isFetching: {
        type: Boolean,
        attribute: false
      },
      _isCommentAdding: {
        type: Boolean,
        attribute: false
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
        
        .loading {
            display: block;
            margin: 10px 0;
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
        ${this._isFetching ? html`<u-default-spinner class="loading"/>` : ''}
      
        ${!this._isFetching && isEmpty(this._comments) ? html`<div class="no-comments">Нет комментариев</div>` : ''}
        
        ${repeat(this._comments, comment => comment.id, comment => html`
          <u-comment .user="${this._user}" .comment="${comment}" @delete="${(e) => this.delete(e)}"></u-comment>
        `)}
      </div>
      
      <form class="form">
        <u-textarea
            type="default"
            id="comment-to-add" 
            class="textarea"
            placeholder="Добавить комментарий"
            ?is-updating="${this._isCommentAdding}" 
            @keyup="${this.validate}"
            required></u-textarea>
            
        <button 
            class="button"
            id="add-comment"
            ?disabled="${!this._isValid || this._isFetching || this._isCommentAdding}"
            @click="${(e) => this.add(e)}">Добавить</button>
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
    this._isFetching = state.comments[pageType].isFetching;
    this._isCommentAdding = state.comments[pageType].isCommentAdding;
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

    this.$textarea.dispatchEvent(new CustomEvent('reset'));
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
    store.dispatch(fetchComments(this.originType, this.originId));
  }

  _setReferences() {
    this.$textarea = this.shadowRoot.querySelector('#comment-to-add');
  }
}

window.customElements.define('u-comments', UComments);