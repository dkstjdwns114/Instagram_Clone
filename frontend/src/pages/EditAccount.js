import React, { Component } from "react";
import { Link } from "react-router-dom";
import AuthContext from "../context/auth-context";

import "./css/EditAccount.css";

class EditAccount extends Component {
  state = {
    isLoading: false,
    authUserName: "",
    profile_pic_url: "",
    fileInputState: "",
    previewSource: "",
    isGetImage: undefined,
    imageUrl: "",
    prevIsGetImage: "",
    isActiveBtn: false
  };

  static contextType = AuthContext;

  componentDidMount() {
    setTimeout(() => {
      this.setState({ authUserName: this.context.userName });
      this.fetchData();
    }, 100);
  }

  activeBtnHandler = () => {
    this.setState({ isActiveBtn: true });
  };

  constructor(props) {
    super(props);
    this.imageElRef = React.createRef();
    this.fullNameElRef = React.createRef();
    this.usernameElRef = React.createRef();
    this.introductionElRef = React.createRef();
  }

  async fetchData() {
    this.setState({ isLoading: true });
    const requestBody = {
      query: `
        query{
          userData(username: "${this.state.authUserName}"){
            _id
            username
            profile_pic_url
            full_name
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
        const userData = resData.data.userData;
        this.fullNameElRef.current.value = userData.full_name;
        this.usernameElRef.current.value = userData.username;
        // this.introductionElRef.current.value = userData.introduction
        this.setState({ previewSource: userData.profile_pic_url });
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
    this.previewFile(file);
  };

  previewFile = (file) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      this.setState({ previewSource: reader.result });
    };
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
                  ref={this.captionElRef}
                  onChange={this.activeBtnHandler}
                />
              </div>
              <div className="button_box">
                <button
                  type="button"
                  className={!this.state.isActiveBtn ? "btn" : "btn active-btn"}
                  disabled="disabled"
                >
                  <span>제출</span>
                </button>
              </div>
            </form>
            <div className="password_forget">
              <Link to="#" className="page_move">
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
