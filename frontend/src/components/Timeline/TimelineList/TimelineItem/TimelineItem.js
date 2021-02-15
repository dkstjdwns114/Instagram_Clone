import React from "react";
import { Link } from "react-router-dom";

const timelineItem = (props) => (
  <li key={props.mediaId} className="events__list-item">
    <img key={props.mediaId} src={props.mediaUrl} alt={props.mediaUrl} />
    <br />
    {props.mediaCaption}
    <hr />
    <p>
      좋아요 {props.mediaLiked.length}명 | 댓글 {props.comment.length}개
    </p>
    <hr />
    <Link to={"/p/" + props.mediaId} className="btn post-detail">
      게시물 상세보기
    </Link>
    <div>
      {/* props.userId === props.creatorId  // 이 게시물이 내가 쓴것인지 확인하는 코드*/}
    </div>
  </li>
);

export default timelineItem;
