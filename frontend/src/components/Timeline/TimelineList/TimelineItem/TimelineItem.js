import React from "react";

const timelineItem = (props) => (
  <li key={props.mediaId} className="events__list-item">
    <img key={props.mediaId} src={props.mediaUrl} alt={props.mediaUrl} />
    <br />
    {props.mediaCaption}
    <hr />
    <p>
      <button
        className="btn"
        onClick={props.onDetail.bind(this, props.mediaId)}
      >
        게시물 상세보기
      </button>
      {"   "}좋아요 {props.mediaLikeCnt}명
    </p>

    <hr />
    {props.comment}
    <div>
      {/* props.userId === props.creatorId  // 이 게시물이 내가 쓴것인지 확인하는 코드*/}
    </div>
  </li>
);

export default timelineItem;
