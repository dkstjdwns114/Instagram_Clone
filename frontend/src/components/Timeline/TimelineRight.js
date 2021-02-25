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
                  <Link to="/profile/anstagram">
                    <img
                      src="https://res.cloudinary.com/anstagram123/image/upload/v1613644236/anstagram/defaultProfile_dsacxp.jpg"
                      alt="profile"
                      className="profile_img"
                    />
                  </Link>
                  <div className="pofile_info">
                    <Link to="/profile/anstagram">
                      <p className="profile_id">anstagram</p>
                    </Link>
                    <p className="profile_intro">Anstagram 추천</p>
                  </div>
                  <div className="sidebar_follow_btn">
                    <Link to="/profile/anstagram" className="btn">
                      <span>프로필 보기</span>
                    </Link>
                  </div>
                </li>
                <li>
                  <Link to="/profile/sooyaaa__">
                    <img
                      src="https://res.cloudinary.com/anstagram123/image/upload/v1614239288/anstagram/oqfxj2hxf8c9ls3txk8o.jpg"
                      alt="profile"
                      className="profile_img"
                    />
                  </Link>
                  <div className="pofile_info">
                    <Link to="/profile/sooyaaa__">
                      <p className="profile_id">sooyaaa__</p>
                    </Link>
                    <p className="profile_intro">Anstagram 추천</p>
                  </div>
                  <div className="sidebar_follow_btn">
                    <Link to="/profile/sooyaaa__" className="btn">
                      <span>프로필 보기</span>
                    </Link>
                  </div>
                </li>
                <li>
                  <Link to="/profile/sooyaaa__">
                    <img
                      src="https://res.cloudinary.com/anstagram123/image/upload/v1614239044/anstagram/cqp5pvi4kxylazf2o0ny.jpg"
                      alt="profile"
                      className="profile_img"
                    />
                  </Link>
                  <div className="pofile_info">
                    <Link to="/profile/yoohyein00">
                      <p className="profile_id">yoohyein00</p>
                    </Link>
                    <p className="profile_intro">Anstagram 추천</p>
                  </div>
                  <div className="sidebar_follow_btn">
                    <Link to="/profile/yoohyein00" className="btn">
                      <span>프로필 보기</span>
                    </Link>
                  </div>
                </li>
                <li>
                  <Link to="/profile/sooyaaa__">
                    <img
                      src="https://res.cloudinary.com/anstagram123/image/upload/v1614238911/anstagram/lozw5jhibl6i3ghmbbwj.jpg"
                      alt="profile"
                      className="profile_img"
                    />
                  </Link>
                  <div className="pofile_info">
                    <Link to="/profile/k_hanna_">
                      <p className="profile_id">k_hanna_</p>
                    </Link>
                    <p className="profile_intro">Anstagram 추천</p>
                  </div>
                  <div className="sidebar_follow_btn">
                    <Link to="/profile/k_hanna_" className="btn">
                      <span>프로필 보기</span>
                    </Link>
                  </div>
                </li>
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
