import React from "react";
import { Link } from "react-router-dom";

const timelineItem = (props) => (
  <li key={props.mediaId} className="feeds_list_li">
    <div className="feed_profile">
      <div className="profile">
        <img
          src={props.creatorProfile}
          alt={props.creatorName + "님의 프로필 사진"}
          className="profile_img"
        />
        <p className="profile_id">{props.creatorName}</p>
      </div>
      <div className="profile_add link_list">
        <button type="button" className="state_btn">
          <img
            src="https://s3.ap-northeast-2.amazonaws.com/cdn.wecode.co.kr/bearu/more.png"
            alt=""
          />
        </button>
      </div>
    </div>
    <div className="feed_box">
      <img key={props.mediaId} src={props.mediaUrl} alt={props.mediaUrl} />
    </div>
    <div className="feed_info">
      <div className="feed_state">
        <ul className="link_list">
          <li>
            <button type="button" className="state_btn">
              <img
                src="https://s3.ap-northeast-2.amazonaws.com/cdn.wecode.co.kr/bearu/heart.png"
                alt="like_img"
              />
            </button>
          </li>
          <li>
            <button type="button" className="state_btn">
              <img
                src="https://s3.ap-northeast-2.amazonaws.com/cdn.wecode.co.kr/bearu/comment.png"
                alt="comment_img"
              />
            </button>
          </li>
          <li>
            <button type="button" className="state_btn">
              <img
                src="https://s3.ap-northeast-2.amazonaws.com/cdn.wecode.co.kr/bearu/share.png"
                alt="share_img"
              />
            </button>
          </li>
        </ul>
        <div className="link_list">
          <button type="button" className="state_btn">
            <img
              src="https://s3.ap-northeast-2.amazonaws.com/cdn.wecode.co.kr/bearu/bookmark.png"
              alt="bookmark_img"
            />
          </button>
        </div>
      </div>
      <div className="feed_comments">
        <div className="feed_likes comments_margin">
          <div className="likes_user profile">
            <img
              src="https://scontent-ssn1-1.cdninstagram.com/v/t51.2885-19/s150x150/131994802_214284176856542_767716126641019031_n.jpg?_nc_ht=scontent-ssn1-1.cdninstagram.com&_nc_ohc=Oy1gj4z4hu0AX9uvUp1&tp=1&oh=6f5bbb5c5743e2186d7b68877c8f16cd&oe=6058B472"
              alt="profile"
              className="profile_img"
            />
          </div>
          <div className="comments_info">
            <p className="comments_tit">
              <span className="user_id">000</span>님
              <span>
                외{" "}
                <span className="likes_number">{props.mediaLiked.length}</span>
              </span>
              명이 좋아합니다.
            </p>
          </div>
        </div>
        <div className="comment_list comments_margin">
          <ul className="comments_info comment_list_ul">
            <li>
              <div className="comments_tit">
                <span className="user_id">{props.creatorName}</span>
                <span className="comment_contents">{props.mediaCaption}</span>
              </div>
            </li>
          </ul>
          <div className="feed_time">
            <p className="time">4시30분</p>
          </div>
        </div>
      </div>
    </div>
    <Link to={"/p/" + props.mediaId} className="btn post-detail">
      게시물 상세보기
    </Link>
    {/* <form className="comments_form">
      <div className="input_box">
        <input type="text" placeholder="댓글달기..." id="comment_input" />
      </div>
      <div className="button_box">
        <button type="button" className="btn" disabled="disabled">
          <span className="">게시</span>
        </button>
      </div>
    </form> */}

    <div>
      {/* props.userId === props.creatorId  // 이 게시물이 내가 쓴것인지 확인하는 코드*/}
    </div>
  </li>
);

export default timelineItem;
