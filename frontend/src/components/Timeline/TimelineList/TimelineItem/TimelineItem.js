import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const TimelineItem = (props) => {
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [likedId, setLikedId] = useState(null);
  const [savedId, setSavedId] = useState(null);
  const [mediaLikeds, setMediaLikeds] = useState([]);
  const [token, setToken] = useState("");
  const [isModal, setIsModal] = useState("");

  useEffect(() => {
    const accessToken = localStorage.getItem("access_token");
    setToken(accessToken);
    getLikedId();
    getSavedId();
    setMediaLikeds(props.mediaLiked);
  }, []);

  const getLikedId = () => {
    const requestBody = {
      query: `
        query {
          isLike(mediaId: "${props.mediaId}", userId: "${props.userId}"){
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
        if (resData.data.isLike) {
          setIsLiked(true);
          setLikedId(resData.data.isLike._id);
        } else {
          setIsLiked(false);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const getSavedId = () => {
    const requestBody = {
      query: `
        query {
          isSave(mediaId: "${props.mediaId}", userId: "${props.userId}"){
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
        if (resData.data.isSave) {
          setIsSaved(true);
          setSavedId(resData.data.isSave._id);
        } else {
          setIsSaved(false);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const likeMediaHandler = () => {
    if (!isLiked) {
      setIsLiked(true);
      const requestBody = {
        query: `
        mutation LikedMedia($mediaId: ID!){
          likedMedia(mediaId: $mediaId) {
            _id
            user {
              username
              profile_pic_url
            }
          }
        }
        `,
        variables: {
          mediaId: props.mediaId
        }
      };
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
          setLikedId(resData.data.likedMedia._id);
          const updatedLikeds = mediaLikeds;
          updatedLikeds.push({
            user: {
              username: resData.data.likedMedia.user.username,
              profile_pic_url: resData.data.likedMedia.user.profile_pic_url
            }
          });
          setMediaLikeds(updatedLikeds);
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      getLikedId();

      const requestBody = {
        query: `
          mutation CancelLiked($likedId: ID!) {
            cancelLiked(likedId: $likedId){
              _id
            }
          }
        `,
        variables: {
          likedId: likedId
        }
      };
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
          const currentLikeds = mediaLikeds;
          currentLikeds.pop();
          setMediaLikeds(currentLikeds);
          setIsLiked(false);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  const saveMediaHandler = () => {
    if (!isSaved) {
      setIsSaved(true);
      const requestBody = {
        query: `
          mutation SavedMedia($mediaId: ID!) {
            savedMedia(mediaId: $mediaId) {
              _id
            }
          }
        `,
        variables: {
          mediaId: props.mediaId
        }
      };
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
          setSavedId(resData.data.savedMedia._id);
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      getSavedId();
      const requestBody = {
        query: `
          mutation CancelSaved($savedId: ID!) {
            cancelSaved(savedId: $savedId){
              _id
            }
          }
        `,
        variables: {
          savedId: savedId
        }
      };
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
          setIsSaved(false);
          console.log(resData);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  const mediaTimeSet = (date) => {
    let currentTime = new Date().getTime();
    let time = currentTime - Number(date);
    let gapTime = Math.floor(time / 1000);
    let txt;
    if (gapTime < 60) {
      txt = gapTime + "초 전";
    } else if (60 <= gapTime && gapTime < 3600) {
      txt = Math.floor(gapTime / 60) + "분 전";
    } else if (3600 <= gapTime && gapTime < 86400) {
      txt = Math.floor(gapTime / 3600) + "시간 전";
    } else if (86400 <= gapTime && gapTime < 604800) {
      txt = Math.floor(gapTime / 86400) + "일 전";
    } else {
      txt = convertTime(date);
    }

    return txt;
  };

  const likeModal = () => {
    setIsModal(true);
  };

  const modalCloseHandler = () => {
    setIsModal(false);
  };

  const convertTime = (date) => {
    let s;
    let timestamp = date * 1;
    let d = new Date(timestamp);
    let now = new Date();

    d.getFullYear() === now.getFullYear()
      ? (s =
          leadingZeros(d.getMonth() + 1, 2) +
          "월 " +
          leadingZeros(d.getDate(), 2) +
          "일")
      : (s =
          leadingZeros(d.getFullYear(), 4) +
          "년 " +
          leadingZeros(d.getMonth() + 1, 2) +
          "월 " +
          leadingZeros(d.getDate(), 2) +
          "일");

    return s;
  };

  const leadingZeros = (n, digits) => {
    let zero = "";
    n = n.toString();

    if (n.length < digits) {
      for (let i = 0; i < digits - n.length; i++) zero += "0";
    }
    return zero + n;
  };

  return (
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
            <span className="icon-dots"></span>
          </button>
        </div>
      </div>
      <div className="feed_box">
        <img key={props.mediaId} src={props.mediaUrl} alt={props.mediaUrl} />
      </div>
      <div className="feed_info">
        <div className="social-icons">
          <section className="icons-section">
            <button className="icons-button" onClick={likeMediaHandler}>
              {!isLiked ? (
                <span className="icon1"></span>
              ) : (
                <span className="liked"></span>
              )}
            </button>
            <button className="icons-button" onClick={null}>
              <span className="icon2"></span>
            </button>
            <button className="icons-button" onClick={saveMediaHandler}>
              {!isSaved ? (
                <span className="icon4"></span>
              ) : (
                <span className="saved"></span>
              )}
            </button>
          </section>
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
                  <span className="likes_number">
                    {props.mediaLiked.length}
                  </span>
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
              <p className="time">{mediaTimeSet(props.mediaDate)}</p>
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
};

export default TimelineItem;
