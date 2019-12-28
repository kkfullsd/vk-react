import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import {BrowserRouter } from 'react-router-dom'

// window.vkAsyncInit = function() {
//     VK.init({
//       apiId: 7201674,
//     });
//   };

//   setTimeout(function() {
//     var el = document.createElement("script");
//     el.type = "text/javascript";
//     el.src = "https://vk.com/js/api/openapi.js?162";
//     el.async = true;
//     document.getElementById("vk_api_transport").appendChild(el);

//   }, 0);

let script = document.createElement('script')
script.src = "https://vk.com/js/api/openapi.js?162"
document.head.append(script)

script.onload = function() {
    window.VK.init({
        apiId: 7201674,
    });

    ReactDOM.render(app, document.getElementById('root'));
}



const app = (
    <BrowserRouter>
        <App />
    </BrowserRouter>
)


// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
