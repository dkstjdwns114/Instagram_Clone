import React from "react";
import { Link } from "react-router-dom";

const timelineItem = (props) => (
  <li key={props.mediaId} className="events__list-item">
    <div className="social-header">
      <a href="/gllcollege/" className="social-profile-img">
        <img
          src={props.creatorProfile}
          alt={props.creatorName + "님의 프로필 사진"}
        />
      </a>
      <div className="social-follow">
        <a title="gllcollege" href="/gllcollege/" className="social-name">
          {props.creatorName}
        </a>
        <span className="SPAN_13">•</span>
        <button type="button">Follow</button>
      </div>
    </div>
    <hr />
    <img key={props.mediaId} src={props.mediaUrl} alt={props.mediaUrl} />
    <br />
    {props.mediaCaption}
    <hr />
    <p>
      좋아요 {props.mediaLiked.length}명 | 댓글 {props.commentCnt}개
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
