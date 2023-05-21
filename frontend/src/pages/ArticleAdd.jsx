import axios from 'axios';
import React from 'react';
import {useState} from 'react';
import {useNavigate} from 'react-router-dom';

const ArticleAdd = () => {
    const postArticleUrl = "http://localhost:8080/articles";
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
            await axios.post(postArticleUrl, article);
            navigate("/");
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div className='form'>
            <h1>Add new article</h1>
            <input type="text" placeholder="Title" onChange={handleChange} name="title"/>
            <input type="text" placeholder="Subtitle" onChange={handleChange} name="subtitle"/>
            <input type="text" placeholder="content" onChange={handleChange} name="article_content"/>
            <button onClick={handleClick}>Add</button>
        </div>
    );
};

export default ArticleAdd;
 