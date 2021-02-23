import React from "react";
import { Link } from "react-router-dom";

const timelineRight = (props) => {
  return (
    <div className="contents_right">
      <aside className="aside">
        <div className="feed_profile aside_profile">
          <div className="profile">
            <Link to={"/profile/" + props.myData.username}>
              <img
                src={props.myData.profile_pic_url}
                alt="profile"
                className="profile_img"
              />
            </Link>

            <div className="pofile_info">
              <Link to={"/profile/" + props.myData.username}>
                <p className="profile_id">{props.myData.username}</p>
              </Link>
              <p className="profile_intro">{props.myData.full_name}</p>
            </div>
          </div>
        </div>
        <div className="follow">
          <div className="follow_info follow_story">
            <div className="follow_title">
              <span className="text_tit">회원님을 위한 추천</span>
            </div>
            <div className="follow_list_wrap feed_profile">
              <ul className="profile follow_list scroll">
                <li>
                  <img
                    src="https://scontent-ssn1-1.cdninstagram.com/v/t51.2885-19/s150x150/131994802_214284176856542_767716126641019031_n.jpg?_nc_ht=scontent-ssn1-1.cdninstagram.com&_nc_ohc=Oy1gj4z4hu0AX9uvUp1&tp=1&oh=6f5bbb5c5743e2186d7b68877c8f16cd&oe=6058B472"
                    alt="profile"
                    className="profile_img"
                  />
                  <div className="pofile_info">
                    <p className="profile_id">테스트아이디1번</p>
                    <p className="profile_intro">팔로워 1명</p>
                  </div>
                  <div className="follow_btn">
                    <button type="button" className="btn">
                      <span>팔로우</span>
                    </button>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </aside>

      {/* footer */}
      <footer className="footer">
        <span>Copyright 2020</span>
      </footer>
      {/* end footer */}
    </div>
  );
};

export default timelineRight;
