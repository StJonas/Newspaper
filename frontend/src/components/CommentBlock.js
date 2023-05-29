import {Text} from "./Typography";

const CommentBlock = ({comment_id, article_id, user_id, username, comment_content, comment_time}) => {

    return (
        <div className="mt-2 p-1 border-2 w-9/12">
            <div>
                <Text>from {username ? username : "[deleted user]"}</Text>
                <Text>{comment_time}</Text>
            </div>
            <div className="break-words ">
                <Text>{comment_content}</Text>
            </div>
        </div>


    );

};

export default CommentBlock;