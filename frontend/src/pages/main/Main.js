import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import { Link } from "react-router-dom";
import "./Main.css";

import api from "../../services/api"

import itsamatch from "../../assets/itsamatch.png";
import logo from "../../assets/logo.svg";
import like from "../../assets/like.svg";
import dislike from "../../assets/dislike.svg";

export default function Main({ match }) {
    //sempre que quiser guardar informações que possam ser acessadas pelo componente
    //usar useState
    const [users, setUsers] = useState([]); //serão vários usuários
    const [matchDev, setMatchDev] = useState(null);

    //função que quero executar, e quando quero executar a função
    //posso passar variaveis, e toda vez q as variaveis forem alteradas, a função é chamada
    useEffect(() => {
        async function loadUsers() {
            const response = await api.get("/devs", {
                headers: {
                    user: match.params.id
                }
            });

            setUsers(response.data); //e já faz toda uma nova renderização
        }

        loadUsers();
    }, [match.params.id]);

    useEffect(() => {
        const socket = io('http://localhost:3333', {
            query: { user_id: match.params.id }
        });

        //quando receber a mensagem match
        socket.on('match', dev => {
            setMatchDev(dev);
        });
    }, [match.params.id]);

    async function handleLike(id) {
        console.log("like " + id);

        //body da requisição é null
        await api.post(`/devs/${id}/likes`, null, {
            headers: { user: match.params.id }
        });

        setUsers(users.filter(user => user._id !== id));
    }

    async function handleDislike(id) {
        console.log("dislike " + id);

        //body da requisição é null
        await api.post(`/devs/${id}/dislikes`, null, {
            headers: { user: match.params.id }
        });

        setUsers(users.filter(user => user._id !== id));
    }

    return (
        <div className="main-container">
            <Link to="/">
                <img src={logo} alt="Tindev"></img>
            </Link>
            {users.length > 0 ? (
                <ul>
                    {users.map(user => (
                        <li key={user._id}>
                            <img className="img" src={user.avatar} alt={user.name}></img>
                            <footer>
                                <strong>{user.name}</strong>
                                <p>{user.bio}</p>
                            </footer>
                            <div className="buttons">
                                <button type="button" onClick={() => handleDislike(user._id)}>
                                    <img src={dislike} alt="Dislike"></img>
                                </button>
                                <button type="button" onClick={() => handleLike(user._id)}>
                                    <img src={like} alt="Like"></img>
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            ) : (
                    <div className="empty">Acabaram suas opções :(</div>
                )}

            {matchDev && (
                <div className="match-container">
                    <img src={itsamatch} alt="It's a match"></img>
                    <img className="avatar" src={matchDev.avatar} alt={matchDev.name}></img>
                    <strong>{matchDev.name}</strong>
                    <p>{matchDev.bio}</p>
                    <button type="button" onClick={() => setMatchDev(null)}>Fechar</button>
                </div>
            )}
        </div>
    )
}