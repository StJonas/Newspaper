import React from 'react';
import CommentSection from "../components/CommentSection";
import {ARTICLES_LINK} from "../assets/constants";
import {H2, H3} from "../components/Typography";
import {useLocation} from "react-router-dom";
import {useEffect} from 'react';
import {useState} from 'react';
import axios from 'axios';
import ArticleContainer from "../components/ArticleContainer";

const ArticleDetails = () => {
    const location = useLocation();
    const articleId = location.pathname.split("/")[2];
    const [article, setSelectedArticle] = useState(null);

    useEffect(() => {
        const fetchArticle = async () => {
          try {
            const res = await axios.get(ARTICLES_LINK);
            const selected = res.data.find((article) => article.article_id.toString() === articleId);
            setSelectedArticle(selected);
          } catch (error) {
            console.log(error);
          }
        };
        fetchArticle();
      }, [articleId]);

    return (
    <div className="pt-4">
        {article ? (
        <ArticleContainer key={article.article_id}>
            <H2>{article.title}</H2>
            <H3>{article.subtitle}</H3>
            <span>{article.publish_time}</span>
            <p>{article.article_content}</p>
        </ArticleContainer>
        ) : (
        <p>Loading article...</p>
        )}
        <CommentSection articleId={articleId} />
    </div>
    );
};

export default ArticleDetails;