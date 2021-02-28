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
                {props.recommendUsers.map((user) => {
                  return (
                    <li key={user.username + user._id}>
                      <Link to={"/profile/" + user.username}>
                        <img
                          src={user.profile_pic_url}
                          alt={user.username + "의 프로필 사진"}
                          className="profile_img"
                        />
                      </Link>
                      <div className="pofile_info">
                        <Link to={"/profile/" + user.username}>
                          <p className="profile_id">{user.username}</p>
                        </Link>
                        <p className="profile_intro">Anstagram 추천</p>
                      </div>
                      <div className="sidebar_follow_btn">
                        <Link to={"/profile/" + user.username} className="btn">
                          <span>프로필 보기</span>
                        </Link>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </div>
      </aside>
      {/* footer */}
      <footer className="footer">
        <span>ⓒ 2021. Anstagram all rights reserved.</span>
      </footer>
      {/* end footer */}
    </div>
  );
};

export default timelineRight;
