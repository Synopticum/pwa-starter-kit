import { html, LitElement } from '@polymer/lit-element';
import { SharedStyles } from '../../shared-styles';
import { connect } from 'pwa-helpers';
import { store } from '../../../store';
import { getComments, comments } from './redux';
store.addReducers({ comments });

export class UComments extends connect(store)(LitElement) {
  constructor() {
    super();
  }

  static get properties() {
    return {
      type: {
        type: String
      },
      id: {
        type: String
      },
      items: {
        type: Array
      },

      _comment: {
        type: String
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
        <div class="comment">
            <div class="comment__text">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ad alias consectetur deserunt dolorum id iusto numquam officia tempore temporibus tenetur!</div>
            <div class="comment__meta">
                <div class="comment__author">Sergey Novikov /</div>
                <div class="comment__date">30.09.2018 04:30</div>
            </div>
        </div>
      </div>
      
      <div class="add">
        <textarea id="comment-to-add" @input="${this.changeComment.bind(this)}">${this._comment}</textarea><br>
        <button @click="${this.submitComment.bind(this)}">add</button>
      </div>
    `
  }

  attributeChangedCallback(name, oldValue, newValue) {
    // request comments once all necessary info is ready
    if (name === 'id' && newValue !== 'undefined') {
      let attributes = this.attributes;
      store.dispatch(getComments(attributes.type.value, attributes.id.value));
    }
  }

  _stateChanged(state) {
    this._comments = state.comments.objectPage;
  }

  changeComment(e) {
  }

  submitComment(e) {

  }
}

window.customElements.define('u-comments', UComments);