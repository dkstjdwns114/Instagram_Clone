import React, { Component } from "react";
import { Link } from "react-router-dom";
import AuthContext from "../context/auth-context";
import Axios from "axios";

import "./css/EditAccount.css";

class EditAccount extends Component {
  state = {
    isLoading: false,
    profile_pic_url: "",
    fileInputState: "",
    previewSource: "",
    isGetImage: undefined,
    imageUrl: "",
    prevIsGetImage: "",
    isActiveBtn: false,
    imageSelected: "",
    getFullName: "",
    getUserName: "",
    getIntroduction: "",
    currentUserName: ""
  };

  static contextType = AuthContext;

  componentDidMount() {
    setTimeout(() => {
      this.fetchData();
    }, 100);
  }

  activeBtnHandler = () => {
    if (
      this.imageElRef.current.value !== "" ||
      this.fullNameElRef.current.value !== this.state.getFullName ||
      this.usernameElRef.current.value !== this.state.getUserName ||
      this.introductionElRef.current.value !== this.state.getIntroduction
    ) {
      this.setState({ isActiveBtn: true });
    } else {
      this.setState({ isActiveBtn: false });
    }
  };

  constructor(props) {
    super(props);
    this.imageElRef = React.createRef();
    this.fullNameElRef = React.createRef();
    this.usernameElRef = React.createRef();
    this.introductionElRef = React.createRef();
  }

  updateData = async () => {
    const username = this.usernameElRef.current.value;
    const full_name = this.fullNameElRef.current.value;
    let intruduction = this.introductionElRef.current.value;

    if (full_name.length === 0 || username.length === 0) return;

    if (intruduction.length === 0) intruduction = "";

    const requestBody = {
      query: `
          mutation UpdateUser($username: String!, $full_name: String!, $profile_pic_url: String!, $introduction: String!) {
            updateUser(updateUserInput: {username: $username, full_name: $full_name, profile_pic_url: $profile_pic_url, introduction: $introduction}) {
              _id
              username
              full_name
              profile_pic_url
              introduction
            }
          }
        `,
      variables: {
        username: username,
        full_name: full_name,
        profile_pic_url: this.state.profile_pic_url,
        introduction: intruduction
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
        const modifiedData = resData.data.updateUser;
        this.imageElRef.current.value = "";
        this.fullNameElRef.current.value = modifiedData.full_name;
        this.usernameElRef.current.value = modifiedData.username;
        this.introductionElRef.current.value = modifiedData.introduction;
        this.setState({
          isActiveBtn: false,
          previewSource: modifiedData.profile_pic_url,
          profile_pic_url: modifiedData.profile_pic_url,
          currentUserName: modifiedData.username
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  async fetchData() {
    this.setState({ isLoading: true });
    const requestBody = {
      query: `
        query{
          editProfileData{
            _id
            username
            profile_pic_url
            full_name
            introduction
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
        const userData = resData.data.editProfileData;
        this.fullNameElRef.current.value = userData.full_name;
        this.usernameElRef.current.value = userData.username;
        this.introductionElRef.current.value = userData.introduction;
        this.setState({
          previewSource: userData.profile_pic_url,
          profile_pic_url: userData.profile_pic_url,
          getFullName: userData.full_name,
          getUserName: userData.username,
          getIntroduction: userData.introduction,
          currentUserName: userData.username
        });
      })
      .catch((err) => {
        console.log(err);
        this.setState({ isLoading: false });
      });
  }

  fileOnChangeHandler = (e) => {
    this.handleFileInputChange(e);
    this.activeBtnHandler();
  };

  handleFileInputChange = (e) => {
    const file = e.target.files[0];
    this.setState({ imageSelected: file });
    this.previewFile(file);
  };

  previewFile = (file) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      this.setState({ previewSource: reader.result });
    };
  };

  submitBtnHandler = async () => {
    if (this.imageElRef.current.value !== "") {
      try {
        const formData = new FormData();
        formData.append("file", this.state.imageSelected);
        formData.append("upload_preset", "anstagram");
        Axios.post(
          "https://api.cloudinary.com/v1_1/anstagram123/image/upload",
          formData
        ).then((response) => {
          this.setState({
            profile_pic_url: response.data.secure_url
          });
          this.updateData();
        });
      } catch (err) {
        console.error(err);
      }
    } else {
      this.updateData();
    }
  };

  render() {
    return (
      <div className="wrap">
        <div className="container">
          <div className="inner">
            <header className="title">
              <h1>
                <span className="header_tit">프로필 편집</span>
              </h1>
            </header>
            <form className="form">
              <div className="form-create-control">
                <label htmlFor="image">사진</label>
                <input
                  type="file"
                  id="image"
                  ref={this.imageElRef}
                  onChange={this.fileOnChangeHandler}
                />
                {this.state.previewSource && (
                  <img
                    src={this.state.previewSource}
                    alt="chosen"
                    id="profile_img"
                  />
                )}
              </div>
              <div className="input_box">
                <label className="form_tit" htmlFor="full_name">
                  이름
                </label>
                <input
                  id="full_name"
                  ref={this.fullNameElRef}
                  type="text"
                  placeholder="이름"
                  onChange={this.activeBtnHandler}
                />
              </div>
              <div className="input_box">
                <label className="form_tit" htmlFor="username">
                  사용자이름
                </label>
                <input
                  id="username"
                  ref={this.usernameElRef}
                  type="text"
                  placeholder="사용자이름"
                  onChange={this.activeBtnHandler}
                />
              </div>
              <div className="input_box">
                <label className="form_tit" htmlFor="caption">
                  소개
                </label>
                <textarea
                  id="caption"
                  ref={this.introductionElRef}
                  onChange={this.activeBtnHandler}
                />
              </div>
              <div className="button_box">
                {!this.state.isActiveBtn ? (
                  <button type="button" className="btn" disabled="disabled">
                    <span>제출</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    className="active-btn"
                    onClick={this.submitBtnHandler}
                  >
                    <span>제출</span>
                  </button>
                )}
              </div>
            </form>
            <div className="move_mypage">
              <Link
                to={"/profile/" + this.state.currentUserName}
                className="page_move"
              >
                <span>마이페이지로 이동</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
export default EditAccount;
