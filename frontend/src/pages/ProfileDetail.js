import React, { Component } from "react";
import { Link } from "react-router-dom";

import "./css/ProfileDetail.css";

import Spinner from "../components/Spinner/Spinner";
import AuthContext from "../context/auth-context";

class ProfileDetail extends Component {
  state = {
    isLoading: false,
    profile_pic_url: "",
    createdMedias: [],
    username: ""
  };

  static contextType = AuthContext;

  componentDidMount() {
    this.fetchData();
  }

  fetchData() {
    this.setState({ isLoading: true });
    const requestBody = {
      query: `
        query{
          userData(username: "${this.props.match.params.username}"){
            _id
            username
            profile_pic_url
            createdMedias {
              _id
              media_url
            }
          }
        }
      `
    };

    fetch("http://localhost:8000/graphql", {
      method: "POST",
      body: JSON.stringify(requestBody),
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then((res) => {
        if (res.status !== 200 && res.status !== 201) {
          throw new Error("Failed!");
        }
        return res.json();
      })
      .then((resData) => {
        console.log(resData);
        this.setState({
          isLoading: false,
          profile_pic_url: resData.data.userData.profile_pic_url,
          createdMedias: resData.data.userData.createdMedias.reverse(),
          username: resData.data.userData.username
        });
      })
      .catch((err) => {
        console.log(err);
        this.setState({ isLoading: false });
      });
  }

  render() {
    return (
      <>
        {this.state.isLoading ? (
          <Spinner />
        ) : (
          <div className="profileDetail_main">
            <div className="container">
              {/* profile */}
              <div className="profileDetail_profile">
                <div className="profile_img">
                  <img
                    src={this.state.profile_pic_url}
                    alt={this.state.profile_pic_url}
                  />
                </div>
                <div className="info">
                  <div className="area_text">
                    <h2 className="user_id">{this.state.username}</h2>
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
                      <span className="sub_title">
                        {this.state.createdMedias.length}
                      </span>
                    </div>
                    <div className="tit_desc">
                      <span className="title">팔로워</span>
                      <span className="sub_title">XX</span>
                    </div>
                    <div className="tit_desc">
                      <span className="title">팔로우</span>
                      <span className="sub_title">XX</span>
                    </div>
                  </div>
                  <div className="area_text profile_info">
                    <h3 className="info_title">User full name</h3>
                    <p className="info_sub">한줄소개</p>
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
                    {this.state.createdMedias.map((media, idx) => {
                      console.log(media);
                      return (
                        <li key={media._id}>
                          <Link to={"/p/" + media._id}>
                            <div className="board_img">
                              <img
                                src={media.media_url}
                                alt={media.media_url}
                              />
                            </div>
                          </Link>
                        </li>
                      );
                    })}
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
        )}
      </>
    );
  }
}

export default ProfileDetail;
