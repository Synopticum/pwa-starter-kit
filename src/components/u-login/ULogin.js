// Login page is a pure web component that doesn't require any library as a dependency
import { ENV } from '../../../environments/environments';

class ULogin extends HTMLElement {
  constructor() {
    super();
    let shadow = this.attachShadow({ mode: 'open' });

    shadow.innerHTML = `
            <style>                
                :host {
                    display: flex;
                    width: 100vw;
                    height: 100vh;
                    justify-content: center;
                    align-items: center;
                    background: linear-gradient(hsla(0,0%,91.8%,.98),hsla(0,0%,100%,.98));
                }
                
                .button {
                    display: inline-flex;
                    justify-content: center;
                    align-items: center;
                    flex: 0 0 150px;
                    height: 35px;
                    padding: 15px;
                    font-size: 18px;
                    border: 1px solid #ccc;
                    text-decoration: none;
                    color: #000000;
                    transition: background-color .2s;
                }
                
                .button:hover {
                    text-decoration: underline;
                    background-color: #dddddd;
                }
                
                .button:active {
                    box-shadow: inset 5px 5px 5px rgba(0,0,0,.2);
                }
                
                .button--first {
                    border-radius: 15px 0 0 15px;
                    border-right: 0;
                }
                
                .button--last {
                    border-radius: 0 15px 15px 0;
                    border-left: 1px dashed #ccc;
                }
                
                .button--vk {
                    background: url('static/images/vk_logo.svg') no-repeat 50% 50%;
                    background-size: 40px;
                }
                
                .button--anonymous {
                    background: url('static/images/anonymous_logo.svg') no-repeat 50% 50%;
                    background-size: 40px;
                }
            </style>
            
            <a href="https://oauth.vk.com/authorize?client_id=4447151&display=page&redirect_uri=${ENV[window.ENV].static}&response_type=code&v=5.95" 
               class="button button--vk button--first"></a>
                
            <a href="#" class="button button--anonymous button--last"></a>
        `;
  }
}

window.customElements.define('u-login', ULogin);
