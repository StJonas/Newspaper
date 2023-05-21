import React from 'react';
import {useEffect} from 'react';
import {useState} from 'react';
import {Link} from 'react-router-dom';
import axios from 'axios';

const Articles = () => {
    const [articles, setArticles] = useState([]);
    const link = "http://localhost:8080/articles/";

    useEffect(() => {
        const fetchAllArticles = async () => {
            try {
                const res = await axios.get(link);
                console.log(res);
                setArticles(res.data);
            } catch (error) {
                console.log(error);
            }
        }
        fetchAllArticles();
    }, []);

    const handleDelete = async (article_id) => {
        try {
            await axios.delete(link + article_id);
            window.location.reload();
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div>
            <div className='articles'>
                {articles.map((article) => (
                    <div className='article' key={article['article_id']}>
                        <h2><Link className='link' to={`/details/${article['article_id']}`}>{article['title']}</Link></h2>
                        <p>{article['subtitle']}</p>
                        <span>{article['publish_time']}</span>
                        <p>{article['article_content']}</p>
                        <button className='update'>
                            <Link className='update-link' to={`/update/${article['article_id']}`}>Update</Link>
                        </button>
                        <button className='delete' onClick={() => handleDelete(article['article_id'])}>Delete</button>
                    </div>
                ))}
            </div>
            <br/>
            <button className='add-button'><Link className='link' to="/add">Add new article</Link></button>
        </div>
    );
};

export default Articles;