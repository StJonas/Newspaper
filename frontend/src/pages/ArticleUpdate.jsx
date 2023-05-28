import axios from 'axios';
import React from 'react';
import {useState} from 'react';
import {useLocation, useNavigate} from 'react-router-dom';
import {useEffect} from 'react';
import {ARTICLES_LINK} from "../assets/constants";
import UpdateButton from "../components/UpdateButton";
import {H2} from "../components/Typography";
import AppLink from "../components/AppLink";

const ArticleUpdate = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const articleId = location.pathname.split("/")[2];
    const [newArticle, setNewArticle] = useState({
        title: "",
        desc: "",
        price: null,
        cover: "",
    });
    const [article, setArticle] = useState({});

    useEffect(() => {

        const fetchArticle = async () => {
            try {
                const res = await axios.get(ARTICLES_LINK + articleId);
                await setArticle(res.data[0]);
            } catch (error) {
                console.log(error);
            }
        }
        fetchArticle();
    }, [articleId]);

    const handleChange = (e) => {
        setNewArticle((prev) => ({...prev, [e.target.name]: e.target.value}));
    };

    const handleClick = async (e) => {
        e.preventDefault();
        try {
            await axios.put(ARTICLES_LINK + articleId, newArticle);
            navigate("/");
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <div className={"flex flex-col gap-3 pt-5"}>
            <H2>Update article</H2>
            <input type="text" placeholder={article['title']} onChange={handleChange} name="title"/>
            <input type="text" placeholder={article['subtitle']} onChange={handleChange} name="subtitle"/>
            <input type="text" placeholder={article['article_content']} onChange={handleChange} name="article_content"/>
            <div><UpdateButton onClick={handleClick}>Update</UpdateButton></div>
            <AppLink to="/">Go back</AppLink>
        </div>
    );

};

export default ArticleUpdate;