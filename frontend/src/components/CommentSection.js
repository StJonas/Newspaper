import {Text} from "./Typography";

const CommentSection = ({articleId}) => {
    return (
        <div className={"border-t-2 mt-5"}>
            <Text>Comment section of article with id: {articleId}</Text>
        </div>
    );
};

export default CommentSection;