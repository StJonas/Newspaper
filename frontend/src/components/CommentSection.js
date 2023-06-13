import {H3} from "./Typography";
import CommentBlock from "./CommentBlock";
import {useEffect, useState} from "react";
import axios from "axios";
import {COMMENTS_LINK} from "../assets/constants";
import NewCommentForm from "./NewCommentForm";

const CommentSection = ({articleId}) => {
    const [comments, setComments] = useState([]);

    const fetchAllComments = async () => {
        try {
            const response = await axios.get(COMMENTS_LINK + articleId);
            setComments(response.data);
        } catch (error) {
            console.log("Fetching comments error: ", error);
        }
    };

    useEffect(() => {
        reloadComments();
    });

    const reloadComments = () => {
        fetchAllComments();
    }

    return (
        <div className="border-t-2 mt-5">
            <H3>Comments</H3>
            <div className={"flex"}>
                <div className={"w-1/2"}>
                    {comments.map(comment => (
                        <CommentBlock
                            key={comment.comment_id}
                            comment_id={comment.comment_id}
                            article_id={comment.article_id}
                            user_id={comment.user_id}
                            username={comment.username}
                            comment_content={comment.comment_content}
                            comment_time={comment.comment_time}
                        />
                    ))}
                </div>
                <div className={"w-1/2"}>
                    <NewCommentForm article_id={articleId} reloadComments={reloadComments}/>
                </div>
            </div>
        </div>
    );
};

export default CommentSection;