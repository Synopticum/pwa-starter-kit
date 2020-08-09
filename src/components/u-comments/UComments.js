import {html, LitElement} from 'lit-element/lit-element';
import {DateTime} from "luxon";
import {repeat} from 'lit-html/directives/repeat';
import isEmpty from '../../helpers/isEmpty';
import {store} from '../../store';
import {connect} from 'pwa-helpers';
import {deleteComment, fetchComments, putComment} from './UComments.actions';
import {comments} from "./UComments.reducer";
import {isAdmin, isAnonymous} from "../u-app/UApp.helpers";
import '../shared/u-default-spinner/UDefaultSpinner';
import '../shared/u-textarea/UTextarea';
import './u-comment/UComment';
import props from './UComments.props';
import styles from './UComments.styles';

store.addReducers({ comments });

export class UComments extends connect(store)(LitElement) {
  /*
      List of required methods
      Needed for initialization, rendering, fetching and setting default values
  */
  static get properties() {
    return props;
  }

  static get styles() {
    return styles;
  }

  render() {
    return html`
      <div class="u-comments">
        <div class="back" @click="${this.hideSidebar}">←</div>
        <div class="title">Обсуждение</div>
        
        <div class="comments">
          ${this._isFetching ? html`<u-default-spinner class="loading"/>` : ''}
        
          ${!this._isFetching && isEmpty(this._comments) ? html`<div class="no-comments">Нет комментариев</div>` : ''}
          
          ${repeat(this._comments, comment => comment.id, comment => {
            return html`
              <u-comment 
                  .comment="${comment}" 
                  .isDeleting="${this._commentsToDelete.includes(comment.id)}"
                  .isDeletingAllowed="${!isAnonymous(this._user) && (isAdmin(this._user) || this.isCommentAuthor(this._user, comment))}"
                  @delete="${(e) => this.delete(e)}"></u-comment>
            `;
          })}
        </div>
        
        ${!isAnonymous(this._user) ? 
          html`<form class="form">
                <u-textarea
                    type="default"
                    id="comment-to-add" 
                    class="textarea"
                    placeholder="Добавить комментарий"
                    ?is-updating="${this._isCommentAdding}" 
                    @keyup="${this.validate}"
                    required></u-textarea>
                    
                <button 
                    class="button button--add-comment"
                    id="add-comment"
                    ?disabled="${!this._isValid || this._isFetching || this._isCommentAdding}"
                    @click="${this.add}">Добавить</button>
              </form>`: ''}
      </div>
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
    this._commentsToDelete = state.comments[pageType].itemsToDelete;
    this._isFetching = state.comments[pageType].isFetching;
    this._isCommentAdding = state.comments[pageType].isCommentAdding;
  }

  firstUpdated() {
    this._init();
  }

  _init() {
    this._setStore();
    this._setReferences();
    this._setListeners();
  }

  _setStore() {
    store.dispatch(fetchComments(this.originType, this.originId));
  }

  _setReferences() {
    this.$textarea = this.shadowRoot.querySelector('#comment-to-add');
  }

  _setListeners() {

  }

  _setDefaults() {
    this._isValid = false;
  }

  /*
      List of custom component's methods
      Any other methods
  */
  add(e) {
    e.preventDefault();

    let comment = new Comment({
      originType: this.originType,
      originId: this.originId,
      text: this.$textarea.value,
      author: `${this._user.firstName} ${this._user.lastName}`,
      authorId: this._user.id,
      authorVkId: this._user.vkId
    });

    store.dispatch(putComment(this.originType, this.originId, comment));
    this.$textarea.dispatchEvent(new CustomEvent('reset'));
  }

  delete(e) {
    let commentId = e.detail;
    store.dispatch(deleteComment(this.originType, this.originId, commentId));
  }

  validate() {
    this.$textarea.value ? this._isValid = true : this._isValid = false;
  }

  isCommentAuthor(user, comment) {
    return user.id === comment.authorId;
  }

  hideSidebar() {
    this.dispatchEvent(new CustomEvent('u-comments:hide-sidebar', { composed: true }));
  }
}

class Comment {
  constructor(options) {
    this.id = uuidv4();
    this.date = DateTime.local().toMillis();

    this.originType = options.originType;
    this.originId = options.originId;
    this.text = options.text;
    this.author = options.author;
    this.authorId = options.authorId;
    this.authorVkId = options.authorVkId;
  }
}

window.customElements.define('u-comments', UComments);