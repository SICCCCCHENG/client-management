import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import {BrowserRouter} from "react-router-dom";

import storageUtils from "./utils/storageUtils";
import memoryUtils from "./utils/memoryUtils";

// 一进来就将localStorage的信息加载到内存中
memoryUtils.user = storageUtils.getUser()

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
    <BrowserRouter>
        <App/>
    </BrowserRouter>
)
;
