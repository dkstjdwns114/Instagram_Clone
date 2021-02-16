import React from "react";
import { Link } from "react-router-dom";

const timelineItem = (props) => (
  <li key={props.mediaId} className="events__list-item">
    <div className="social-header">
      <a href="/gllcollege/" className="social-profile-img">
        <img
          src="https://scontent-ssn1-1.cdninstagram.com/v/t51.2885-19/s320x320/131994802_214284176856542_767716126641019031_n.jpg?_nc_ht=scontent-ssn1-1.cdninstagram.com&_nc_ohc=PDorBUdEWtwAX9sYsr4&tp=1&oh=cf29f6436cf30c756daf0b3772249b4e&oe=60534882"
          alt="gllcollege's profile picture"
        />
      </a>
      <div className="social-follow">
        <a title="gllcollege" href="/gllcollege/" className="social-name">
          테스트아이디
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
