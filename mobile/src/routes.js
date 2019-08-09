import { createAppContainer, createSwitchNavigator } from 'react-navigation';

import Login from "./pages/Login";
import Main from "./pages/Main";

//createSwitchNavigator é um tipo de navegação entre 2 telas
export default createAppContainer(
    createSwitchNavigator({
        Login,
        Main
    })
);