import React from 'react';
interface Author {
    name: string;
    avatar?: string;
    id?: string;
}
interface CommentType {
    id: string;
    content: string;
    user: Author;
    createdAt: string;
}
interface CommentListProps {
    props: {
        blogid: string;
        newComment?: CommentType | null;
    };
}
declare const CommentList: React.FC<CommentListProps>;
export default CommentList;
//# sourceMappingURL=CommentList.d.ts.map