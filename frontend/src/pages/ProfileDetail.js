import React, { Component } from "react";
import { Link } from "react-router-dom";

import "./css/ProfileDetail.css";

class ProfileDetail extends Component {
  render() {
    return (
      <div className="profileDetail_main">
        <div className="container">
          {/* profile */}
          <div className="profileDetail_profile">
            <div className="profile_img">
              <img
                src="https://scontent-ssn1-1.cdninstagram.com/v/t51.2885-19/s320x320/131994802_214284176856542_767716126641019031_n.jpg?_nc_ht=scontent-ssn1-1.cdninstagram.com&_nc_ohc=Oy1gj4z4hu0AX9uvUp1&tp=1&oh=b30589d5f4b2d57670f1593a8d915a9d&oe=60573D02"
                alt=""
              />
            </div>
            <div className="info">
              <div className="area_text">
                <h2 className="user_id">duthegee</h2>
                <Link to="" className="profile_edit">
                  프로필 편집
                </Link>
                <button type="button" className="setting_btn">
                  <i className="fas fa-cog"></i>
                </button>
              </div>
              <div className="area_text">
                <div className="tit_desc">
                  <span className="title">게시물</span>
                  <span className="sub_title">7</span>
                </div>
                <div className="tit_desc">
                  <span className="title">팔로워</span>
                  <span className="sub_title">10</span>
                </div>
                <div className="tit_desc">
                  <span className="title">팔로우</span>
                  <span className="sub_title">15</span>
                </div>
              </div>
              <div className="area_text profile_info">
                <h3 className="info_title">안녕하세요.</h3>
                <p className="info_sub">네 지나가세요~</p>
              </div>
            </div>
          </div>
          {/* end profile */}

          {/* contents */}
          <div className="contents">
            <div className="tab_box">
              <ul className="tab_list">
                <li className="active">
                  <Link to="#">
                    <i className="fas fa-list"></i>
                    <span>게시물</span>
                  </Link>
                </li>
                <li>
                  <Link to="#">
                    <i className="fas fa-tv"></i>
                    <span>IGTV</span>
                  </Link>
                </li>
                <li>
                  <Link to="#">
                    <i className="fas fa-bookmark"></i>
                    <span>저장됨</span>
                  </Link>
                </li>
                <li>
                  <Link to="#">
                    <i className="fas fa-user-tag"></i>
                    <span>태그됨</span>
                  </Link>
                </li>
              </ul>
            </div>
            <div className="boards">
              <ul className="board_list">
                <li>
                  <Link to="#">
                    <div className="board_img">
                      <img
                        src="https://scontent-ssn1-1.cdninstagram.com/v/t51.2885-19/s320x320/131994802_214284176856542_767716126641019031_n.jpg?_nc_ht=scontent-ssn1-1.cdninstagram.com&_nc_ohc=Oy1gj4z4hu0AX9uvUp1&tp=1&oh=b30589d5f4b2d57670f1593a8d915a9d&oe=60573D02"
                        alt="프로필 이미지"
                      />
                    </div>
                  </Link>
                </li>
                <li>
                  <Link to="#">
                    <div className="board_img">
                      <img
                        src="https://scontent-ssn1-1.cdninstagram.com/v/t51.2885-19/s320x320/131994802_214284176856542_767716126641019031_n.jpg?_nc_ht=scontent-ssn1-1.cdninstagram.com&_nc_ohc=Oy1gj4z4hu0AX9uvUp1&tp=1&oh=b30589d5f4b2d57670f1593a8d915a9d&oe=60573D02"
                        alt="메인 프로필"
                      />
                    </div>
                  </Link>
                </li>
                <li>
                  <Link to="#">
                    <div className="board_img">
                      <img
                        src="https://scontent-ssn1-1.cdninstagram.com/v/t51.2885-15/e35/s1080x1080/151213134_134563205204831_6028190961915282611_n.jpg?_nc_ht=scontent-ssn1-1.cdninstagram.com&_nc_cat=1&_nc_ohc=04BXqyVT0bMAX9RJshx&tp=1&oh=d91e13721a3ace2311d5fbe4841228b2&oe=60576B66"
                        alt="리버풀"
                      />
                    </div>
                  </Link>
                </li>
                <li>
                  <Link to="#">
                    <div className="board_img">
                      <img
                        src="https://scontent-ssn1-1.cdninstagram.com/v/t51.2885-15/e35/s1080x1080/151213134_134563205204831_6028190961915282611_n.jpg?_nc_ht=scontent-ssn1-1.cdninstagram.com&_nc_cat=1&_nc_ohc=04BXqyVT0bMAX9RJshx&tp=1&oh=d91e13721a3ace2311d5fbe4841228b2&oe=60576B66"
                        alt="리버풀"
                      />
                    </div>
                  </Link>
                </li>
                <li>
                  <Link to="#">
                    <div className="board_img">
                      <img
                        src="https://scontent-ssn1-1.cdninstagram.com/v/t51.2885-15/e35/s1080x1080/151213134_134563205204831_6028190961915282611_n.jpg?_nc_ht=scontent-ssn1-1.cdninstagram.com&_nc_cat=1&_nc_ohc=04BXqyVT0bMAX9RJshx&tp=1&oh=d91e13721a3ace2311d5fbe4841228b2&oe=60576B66"
                        alt="리그오브레전드"
                      />
                    </div>
                  </Link>
                </li>
                <li>
                  <Link to="#">
                    <div className="board_img">
                      <img
                        src="https://scontent-ssn1-1.cdninstagram.com/v/t51.2885-15/e35/s1080x1080/151213134_134563205204831_6028190961915282611_n.jpg?_nc_ht=scontent-ssn1-1.cdninstagram.com&_nc_cat=1&_nc_ohc=04BXqyVT0bMAX9RJshx&tp=1&oh=d91e13721a3ace2311d5fbe4841228b2&oe=60576B66"
                        alt="자바스크립트"
                      />
                    </div>
                  </Link>
                </li>
                <li>
                  <Link to="#">
                    <div className="board_img">
                      <img
                        src="https://scontent-ssn1-1.cdninstagram.com/v/t51.2885-15/e35/s1080x1080/151213134_134563205204831_6028190961915282611_n.jpg?_nc_ht=scontent-ssn1-1.cdninstagram.com&_nc_cat=1&_nc_ohc=04BXqyVT0bMAX9RJshx&tp=1&oh=d91e13721a3ace2311d5fbe4841228b2&oe=60576B66"
                        alt="자바스크립트"
                      />
                    </div>
                  </Link>
                </li>
                <li>
                  <Link to="#">
                    <div className="board_img">
                      <img
                        src="https://scontent-ssn1-1.cdninstagram.com/v/t51.2885-15/e35/s1080x1080/151213134_134563205204831_6028190961915282611_n.jpg?_nc_ht=scontent-ssn1-1.cdninstagram.com&_nc_cat=1&_nc_ohc=04BXqyVT0bMAX9RJshx&tp=1&oh=d91e13721a3ace2311d5fbe4841228b2&oe=60576B66"
                        alt="자바스크립트"
                      />
                    </div>
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          {/* end contents */}

          {/* footer */}
          <footer className="footer">
            <span>Copyright 2020</span>
          </footer>
          {/* end footer */}
        </div>
      </div>
    );
  }
}

export default ProfileDetail;
