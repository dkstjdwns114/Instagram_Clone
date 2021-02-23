import React, { Component } from "react";
import { Link } from "react-router-dom";

import "./css/ProfileDetail.css";

import Spinner from "../components/Spinner/Spinner";
import AuthContext from "../context/auth-context";
import PostList from "../components/ProfileDetail/PostList/PostList";
import Saveds from "../components/ProfileDetail/SavedList/SavedList";
import FollowModal from "../components/Modal/FollowModal";

class ProfileDetail extends Component {
  state = {
    isLoading: false,
    profile_pic_url: "",
    createdMedias: [],
    username: "",
    full_name: "",
    isAuth: false,
    follower: [],
    following: [],
    isPosts: true,
    isSaved: false,
    isFollowingModal: false,
    isFollowerModal: false,
    saveds: [],
    isFollowing: false,
    isFollowed: false
  };

  constructor(props) {
    super(props);
    this.isPostHandler = this.isPostHandler.bind(this);
    this.isSavedHandler = this.isSavedHandler.bind(this);
    this.followingUserHandler = this.followingUserHandler.bind(this);
    this.unfollowUserHandler = this.unfollowUserHandler.bind(this);
  }

  static contextType = AuthContext;

  componentDidMount() {
    this.fetchData();
    this.setState({ currentUserId: localStorage.getItem("userId") });
  }

  followerClickHandler = () => {
    this.setState({ isFollowerModal: true });
  };

  followerCancelHandler = () => {
    this.setState({ isFollowerModal: false });
  };

  followingClickHandler = () => {
    this.setState({ isFollowingModal: true });
  };

  followingCancelHandler = () => {
    this.setState({ isFollowingModal: false });
  };

  fetchAboutFollow(currentUser, profileUser) {
    this.setState({ isLoading: true });
    const requestBody = {
      query: `
        query {
          isFollowed(currentUserId: "${currentUser}", otherUserId: "${profileUser}"){
            _id
          }
          isFollowing(currentUserId: "${currentUser}", otherUserId: "${profileUser}"){
            _id
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
          isFollowed: resData.data.isFollowed,
          isFollowing: resData.data.isFollowing
        });
      })
      .catch((err) => {
        console.log(err);
        this.setState({ isLoading: false });
      });
  }

  fetchSaveds() {
    this.setState({ isLoading: true });
    const requestBody = {
      query: `
        query {
          saveds {
            media {
              _id
              media_url
            }
          }
        }
      `
    };

    const token = this.context.token;

    fetch("http://localhost:8000/graphql", {
      method: "POST",
      body: JSON.stringify(requestBody),
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token
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
        this.setState({ isLoading: false, saveds: resData.data.saveds });
      })
      .catch((err) => {
        console.log(err);
        this.setState({ isLoading: false });
      });
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
            full_name
            createdMedias {
              _id
              media_url
            }
            follower {
              _id
              username
              profile_pic_url
            }
            following {
              _id
              username
              profile_pic_url
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
        if (resData.data.userData._id === this.state.currentUserId) {
          this.setState({ isAuth: true });
          this.fetchSaveds();
        }
        this.setState({
          isLoading: false,
          profile_pic_url: resData.data.userData.profile_pic_url,
          createdMedias: resData.data.userData.createdMedias,
          username: resData.data.userData.username,
          full_name: resData.data.userData.full_name,
          follower: resData.data.userData.follower,
          following: resData.data.userData.following,
          profileUserId: resData.data.userData._id
        });
        this.fetchAboutFollow(
          this.state.currentUserId,
          resData.data.userData._id
        );
      })
      .catch((err) => {
        console.log(err);
        this.setState({ isLoading: false });
      });
  }

  followingUserHandler() {
    const requestBody = {
      query: `
        mutation CreateFollowing($current_userId: ID!, $followed_userId: ID!) {
          createFollowing(followInput: {current_userId: $current_userId, followed_userId: $followed_userId}) {
            _id
            following {
              _id
              username
              profile_pic_url
            }
            followed {
              _id
              username
              profile_pic_url
            }
          }
        }
      `,
      variables: {
        current_userId: this.state.currentUserId,
        followed_userId: this.state.profileUserId
      }
    };

    const token = this.context.token;

    fetch("http://localhost:8000/graphql", {
      method: "POST",
      body: JSON.stringify(requestBody),
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token
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
        this.setState({ isFollowing: true });
      })
      .catch((err) => {
        console.log(err);
      });
  }

  unfollowUserHandler() {
    const requestBody = {
      query: `
        mutation CancelFollowing($current_userId: ID!, $unfollowed_userId: ID!) {
          cancelFollowing(unfollowInput: {current_userId: $current_userId, unfollowed_userId: $unfollowed_userId}) {
            _id
            username
          }
        }
      `,
      variables: {
        current_userId: this.state.currentUserId,
        unfollowed_userId: this.state.profileUserId
      }
    };

    const token = this.context.token;

    fetch("http://localhost:8000/graphql", {
      method: "POST",
      body: JSON.stringify(requestBody),
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token
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
        this.setState({ isFollowing: false });
      })
      .catch((err) => {
        console.log(err);
      });
  }

  isPostHandler() {
    this.setState({ isPosts: true, isSaved: false });
  }

  isSavedHandler() {
    this.setState({ isSaved: true, isPosts: false });
  }

  render() {
    return (
      <>
        {this.state.isFollowingModal && (
          <FollowModal
            title="Following"
            users={this.state.following}
            onClose={this.followingCancelHandler}
          />
        )}
        {this.state.isFollowerModal && (
          <FollowModal
            title="Follower"
            users={this.state.follower}
            onClose={this.followerCancelHandler}
          />
        )}
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
                    {this.state.isAuth && (
                      <>
                        <Link to="#" className="profile_edit">
                          프로필 편집
                        </Link>
                        <button type="button" className="setting_btn">
                          <i className="fas fa-cog"></i>
                        </button>
                      </>
                    )}
                    {!this.state.isAuth &&
                      (!this.state.isFollowing ? (
                        <span
                          className="following"
                          onClick={this.followingUserHandler}
                        >
                          팔로우
                        </span>
                      ) : (
                        <span
                          className="unfollow"
                          onClick={this.unfollowUserHandler}
                        >
                          팔로우 취소
                        </span>
                      ))}
                  </div>
                  <div className="area_text">
                    <div className="tit_desc">
                      <span className="title">게시물</span>
                      <span className="sub_title">
                        {this.state.createdMedias.length}
                      </span>
                    </div>
                    <div
                      className="tit_desc hover-me"
                      onClick={this.followerClickHandler}
                    >
                      <span className="title">팔로워</span>
                      <span className="sub_title">
                        {this.state.follower.length}
                      </span>
                    </div>
                    <div
                      className="tit_desc hover-me"
                      onClick={this.followingClickHandler}
                    >
                      <span className="title">팔로우</span>
                      <span className="sub_title">
                        {this.state.following.length}
                      </span>
                    </div>
                  </div>
                  <div className="area_text profile_info">
                    <h3 className="info_title">{this.state.full_name}</h3>
                    <p className="info_sub">한줄소개</p>
                  </div>
                </div>
              </div>
              {/* end profile */}

              {/* contents */}
              <div className="contents">
                <div className="tab_box">
                  <ul className="tab_list">
                    <li
                      className={this.state.isPosts ? "active" : null}
                      onClick={this.isPostHandler}
                    >
                      <span className="tab_span">
                        <i className="fas fa-list"></i>
                        <span>게시물</span>
                      </span>
                    </li>
                    {this.state.isAuth && (
                      <li
                        className={!this.state.isPosts ? "active" : null}
                        onClick={this.isSavedHandler}
                      >
                        <span className="tab_span">
                          <i className="fas fa-bookmark"></i>
                          <span>저장됨</span>
                        </span>
                      </li>
                    )}
                  </ul>
                </div>
                <div className="boards">
                  {this.state.isPosts && (
                    <PostList medias={this.state.createdMedias} />
                  )}
                  {this.state.isSaved && <Saveds medias={this.state.saveds} />}
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
