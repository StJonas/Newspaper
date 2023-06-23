import {Button, Label, Textarea} from "flowbite-react";
import {useSelector} from "react-redux";
import axios from "axios";
import {COMMENTS_LINK} from "../assets/constants";
import {useEffect, useState} from "react";
import CommentDialog from "./CommentDialog";

const NewCommentForm = ({article_id, reloadComments}) => {
    const loggedInUser = useSelector(state => state.loggedInUser);
    const [dialogIsOpen, setDialogIsOpen] = useState(false);
    const [dialogMessage, setDialogMessage] = useState("Something went wrong!");

    const [comment, setComment] = useState({
        article_id: article_id,
        user_id: loggedInUser.user_id,
        comment_content: "",
    });

    const makeComment = async () => {
        await axios.post(COMMENTS_LINK, comment).then(
            (value) => {
                setDialogMessage("Successfully commented!");
                setDialogIsOpen(true);
            },
            (error) => {
                setDialogMessage(error.response.data);
                setDialogIsOpen(true);
            }
        );
    }


    useEffect(() => {
        setComment((prev) => ({...prev, user_id: loggedInUser.user_id}));
    }, [loggedInUser]);


    const handleChange = (e) => {
        setComment((prev) => ({...prev, comment_content: e.target.value}));
    };

    const closeDialog = ()=>{
        setDialogIsOpen(false);
        setComment((prev)=>({...prev, comment_content: ""}));
        reloadComments();
    };

    return (
        <div className={"w-5/12"} id="textarea">
            <CommentDialog onClose={closeDialog} isOpen={dialogIsOpen} message={dialogMessage}/>
            <div className="block mb-2">
                <Label
                    htmlFor="comment"
                    value={"Your comment:"}
                />
            </div>
            <Textarea
                id="comment_content"
                placeholder={loggedInUser.user_id === null ? "You have to be logged in!" : "Leave a comment..."}
                required
                rows={4}
                disabled={loggedInUser.user_id === null}
                value={comment.comment_content}
                onChange={handleChange}
            />
            <Button color="dark" className={"mt-1"} disabled={loggedInUser.user_id === null || comment.comment_content === "" || comment.comment_content === null} onClick={makeComment}>
                Comment
            </Button>
        </div>
    );

};

export default NewCommentForm;