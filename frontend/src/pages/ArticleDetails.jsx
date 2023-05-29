import React from 'react';
import CommentSection from "../components/CommentSection";
import {H2, Text} from "../components/Typography";
import {useLocation} from "react-router-dom";

const ArticleDetails = () => {
    const location = useLocation();
    const articleId = location.pathname.split("/")[2];

    return (
        <div>
            <H2>ArticleDetails</H2>
            <Text>Article content</Text>
            <CommentSection articleId={articleId}/>
        </div>
    );
};

export default ArticleDetails;