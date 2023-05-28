import axios from 'axios';
import React from 'react';
import {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {ARTICLES_LINK} from "../assets/constants";
import AppContainer from "../components/AppContainer";
import AppButton from "../components/AppButton";
import {H3} from "../components/Typography";

const ArticleAdd = () => {
    const [article, setArticle] = useState({
        title: "",
        desc: "",
        price: null,
        cover: "",
    });

    const navigate = useNavigate();

    const handleChange = (e) => {
        setArticle((prev) => ({...prev, [e.target.name]: e.target.value}));
    };

    const handleClick = async e => {
        e.preventDefault();
        try {
            await axios.post(ARTICLES_LINK, article);
            navigate("/");
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <AppContainer classes={"flex flex-col gap-10"}>
            <H3>Add new article</H3>
            <input type="text" placeholder="Title" onChange={handleChange} name="title"/>
            <input type="text" placeholder="Subtitle" onChange={handleChange} name="subtitle"/>
            <input type="text" placeholder="content" onChange={handleChange} name="article_content"/>
            <div className={"lx-2"}><AppButton onClick={handleClick}>Add</AppButton></div>
        </AppContainer>
    );
};

export default ArticleAdd;
 