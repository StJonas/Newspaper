import axios from 'axios';
import React from 'react';
import {useState} from 'react';
import {useLocation, useNavigate} from 'react-router-dom';
import {useEffect} from 'react';
import {ARTICLES_LINK} from "../assets/constants";
import UpdateButton from "../components/UpdateButton";
import {H2} from "../components/Typography";
import {Textarea, TextInput} from "flowbite-react";
import CommentDialog from "../components/CommentDialog.js";

const ArticleUpdate = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const articleId = location.pathname.split("/")[2];
    const [newArticle, setNewArticle] = useState({
        title: "",
        subtitle: "",
        article_content: "",
    });
    const [article, setArticle] = useState(null);
    const [dialogIsOpen, setDialogIsOpen] = useState(false);
    const [dialogMessage, setDialogMessage] = useState("Something went wrong!");

    useEffect(() => {
        const fetchArticle = async () => {
            try {
                const res = await axios.get(ARTICLES_LINK);
                const selected = res.data.find((article) => article.article_id.toString() === articleId);
                setArticle(selected);
            } catch (error) {
                console.log("Fetch error:" ,error);
            }
        }
        fetchArticle();
    }, [articleId]);

    const handleChange = (e) => {
        setNewArticle((prev) => ({...prev, [e.target.name]: e.target.value}));
    };

    const handleClick = async () => {
        const updatedArticle = {};
        let changesDetected = false;
        
        if (newArticle.title && newArticle.title !== article.title) {
            updatedArticle.title = newArticle.title;
            changesDetected = true;
        } else {
            updatedArticle.title = article.title;
        }
        if (newArticle.subtitle && newArticle.subtitle !== article.subtitle) {
            updatedArticle.subtitle = newArticle.subtitle;
            changesDetected = true;
        } else {
            updatedArticle.subtitle = article.subtitle;
        }
        if (newArticle.article_content && newArticle.article_content !== article.article_content) {
            updatedArticle.article_content = newArticle.article_content;
            changesDetected = true;
        } else {
            updatedArticle.article_content = article.article_content;
        }
        
        if (!changesDetected) {
            setDialogMessage("No changes were made.");
            setDialogIsOpen(true);
            return;
        }
        
        try {
            await axios.put(ARTICLES_LINK + articleId, updatedArticle);
            setDialogMessage("Successfully updated!");
            setDialogIsOpen(true);
        } catch (error) {
            setDialogMessage("Handle click error: " + JSON.stringify(error.response.data));
            setDialogIsOpen(true);
        }
    };
      
    const closeDialog = ()=>{
        setDialogIsOpen(false);
        navigate("/");
    };

    return (
        <div className={"flex flex-col gap-3 pt-5"}>
            <H2>Update article</H2>
            {article ? (
            <>
                <CommentDialog onClose={closeDialog} isOpen={dialogIsOpen} message={dialogMessage}/>
                <TextInput
                    id="article_title"
                    type="text"
                    placeholder={article.title}
                    onChange={handleChange}
                    value={newArticle.title || article.title}
                    name="title"
                />
                <TextInput
                    id="article_subtitle"
                    type="text"
                    placeholder={article.subtitle}
                    value={newArticle.subtitle || article.subtitle}
                    onChange={handleChange}
                    name="subtitle"
                />
                <Textarea
                    id="article_content"
                    placeholder={article.article_content}
                    required
                    rows={13}
                    value={newArticle.article_content || article.article_content}
                    onChange={handleChange}
                    name="article_content"
                    type="text"
                />
            </>
            ) : (
            <p>Fetching article...</p>
            )}
            <div><UpdateButton onClick={handleClick}>Update</UpdateButton></div>
        </div>
    );
};

export default ArticleUpdate;