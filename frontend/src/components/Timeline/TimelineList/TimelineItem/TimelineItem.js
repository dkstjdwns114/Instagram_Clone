import React from "react";

const timelineItem = (props) => (
  <li key={props.mediaId} className="events__list-item">
    <img key={props.mediaId} src={props.mediaUrl} alt={props.mediaUrl} />
    <br />
    {props.mediaCaption}
    <hr />
    <p>
      좋아요 {props.mediaLiked.length}명 | 댓글 {props.comment.length}개
    </p>
    {(props.mediaLiked.length !== 0 || props.comment.length !== 0) && <hr />}
    {props.mediaLiked.length !== 0 && (
      <button
        className="btn"
        onClick={props.likeDetail.bind(this, props.mediaId)}
      >
        좋아요 상세보기
      </button>
    )}
    {props.comment.length !== 0 && (
      <button
        className="btn"
        onClick={props.commentDetail.bind(this, props.mediaId)}
      >
        댓글 {props.comment.length}개 상세보기
      </button>
    )}
    <div>
      {/* props.userId === props.creatorId  // 이 게시물이 내가 쓴것인지 확인하는 코드*/}
    </div>
  </li>
);

export default timelineItem;
