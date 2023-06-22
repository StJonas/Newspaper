import React from 'react';
import {useEffect} from 'react';
import {useState} from 'react';
import {Link} from 'react-router-dom';
import axios from 'axios';
import {ARTICLES_LINK} from "../assets/constants";
import {useNavigate} from 'react-router-dom';
import UpdateButton from "../components/UpdateButton";
import DeleteButton from "../components/DeleteButton";
import {H2, H3} from "../components/Typography";
import ArticleContainer from "../components/ArticleContainer";
import { useSelector } from 'react-redux';
import CommentDialog from "../components/CommentDialog.js";

const Articles = () => {
    const navigate = useNavigate();
    const [articles, setArticles] = useState([]);
    const loggedInUser = useSelector((state) => state.loggedInUser);
    const [dialogIsOpen, setDialogIsOpen] = useState(false);
    const [dialogMessage, setDialogMessage] = useState("Something went wrong!");
    
    useEffect(() => {
        const fetchAllArticles = async () => {
            try {
                const res = await axios.get(ARTICLES_LINK);
                setArticles(res.data);
            } catch (error) {
                console.log(error);
            }
        }
        fetchAllArticles();
    }, []);

    const handleClickDelete = async (article_id) => {
        try {
            await axios.delete(ARTICLES_LINK + article_id);
            setDialogMessage("Successfully deleted!");
            setDialogIsOpen(true);
            setArticles(prevArticles => prevArticles.filter(article => article.article_id !== article_id));
        } catch (error) {
            setDialogMessage("Error while deleting!");
            setDialogIsOpen(true);
            console.log(error);
        }
    };

    const navigateTo = (goal) => {
        navigate(goal);
    };

    const closeDialog = ()=>{
        setDialogIsOpen(false);
    };

    return (
        <div className={"pt-4"}>
            <CommentDialog onClose={closeDialog} isOpen={dialogIsOpen} message={dialogMessage}/>
            <div> {articles.map((article) => (
                <ArticleContainer key={article['article_id']}>
                    <H2><Link to={`/details/${article['article_id']}`}>
                        {article['title']}
                    </Link></H2>
                    <H3>{article['subtitle']}</H3>
                    <span>{article['publish_time']}</span>
                    <p>{article['article_content']}</p>
                    {loggedInUser.isJournalist ? (
                        <div>
                            <UpdateButton
                            onClick={() => navigateTo(`/update/${article['article_id']}`)}>Update</UpdateButton>
                        
                            <DeleteButton onClick={() => handleClickDelete(article['article_id'])}>Delete</DeleteButton>
                        </div>
                    ) : (
                        <div></div>
                    )}
                </ArticleContainer>
            ))}</div>
            <br/>
        </div>
    );
};

export default Articles;