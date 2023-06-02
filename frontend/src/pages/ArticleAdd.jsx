import axios from 'axios';
import React from 'react';
import {useEffect, useState} from "react";
import {useSelector} from "react-redux";
import {useNavigate} from 'react-router-dom';
import {ARTICLES_LINK} from "../assets/constants";
import AppContainer from "../components/AppContainer";
import AppButton from "../components/AppButton";
import {H3, Text} from "../components/Typography";
import {Textarea, TextInput} from "flowbite-react";
import CommentDialog from "../components/CommentDialog.js";

const ArticleAdd = () => {
    const loggedInUser = useSelector(state => state.loggedInUser);
    const [article, setArticle] = useState({
        title: "",
        subtitle: "",
        article_content: "",
    });
    const [journalistId, setJournalist] = useState(null);
    const [dialogIsOpen, setDialogIsOpen] = useState(false);
    const [dialogMessage, setDialogMessage] = useState("Something went wrong!");

    const navigate = useNavigate();

    const handleChange = (e) => {
        setArticle((prev) => ({...prev, [e.target.name]: e.target.value}));
    };

    useEffect(() => {
        if (loggedInUser) {
          setJournalist(loggedInUser.user_id);
        } 
    }, [loggedInUser]);

    const createArticle = async () => {
        const articleData = {
            ...article,
            journalist_id: journalistId
        };

        await axios.post(ARTICLES_LINK, articleData).then(
            (value) => {
                setDialogMessage("Successfully created!");
                setDialogIsOpen(true);
            },
            (error) => {
                setDialogMessage(error.response.data);
                setDialogIsOpen(true);
            }
        );
    };

    const closeDialog = ()=>{
        setDialogIsOpen(false);
        navigate("/");
    };

    return (
        <AppContainer classes={"flex flex-col gap-10"}>
            <H3>Add new article</H3>
            <CommentDialog onClose={closeDialog} isOpen={dialogIsOpen} message={dialogMessage}/>
            <TextInput
                id="article_title"
                type="text"
                placeholder="Title"
                onChange={handleChange}
                value={article.title}
                name="title"
                disabled={!loggedInUser.isJournalist}
            />
            <TextInput
                id="article_subtitle"
                type="text"
                placeholder="Subtitle"
                value={article.subtitle}
                onChange={handleChange}
                name="subtitle"
                disabled={!loggedInUser.isJournalist}
            />
            <Textarea
                id="article_content"
                placeholder="content"
                required
                rows={13}
                value={article.article_content}
                onChange={handleChange}
                name="article_content"
                type="text"
                disabled={!loggedInUser.isJournalist}
            />
            <div className={"lx-2"}><AppButton onClick={createArticle} disabled={!loggedInUser.isJournalist}>Add</AppButton></div>
        </AppContainer>
    );
};

export default ArticleAdd;
 