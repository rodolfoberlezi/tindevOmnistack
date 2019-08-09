import React from 'react';
import { BrowserRouter, Route } from "react-router-dom";

import login from "../src/pages/login/Login";
import main from "../src/pages/main/Main";

export default function Routes() {
    return <BrowserRouter>
        <Route path="/" exact component={login} />
        <Route path="/dev/:id" component={main} />
    </BrowserRouter>
}