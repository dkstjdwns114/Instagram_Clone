import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Image } from "cloudinary-react";

import LikeModal from "../../../Modal/LikeModal";

const TimelineItem = (props) => {
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [likedId, setLikedId] = useState(null);
  const [savedId, setSavedId] = useState(null);
  const [mediaLikeds, setMediaLikeds] = useState([]);
  const [mediaComments, setMediaComments] = useState([]);
  const [token, setToken] = useState("");
  const [isModal, setIsModal] = useState(false);
  const [isOwner, setIsOwner] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [currentMediaCaption, setCurrentMediaCaption] = useState("");
  const [isActiveCommentBtn, setIsActiveCommentBtn] = useState(false);
  const modifyCaptionElRef = useRef();
  const addCommentElRef = useRef();

  useEffect(() => {
    setToken(props.contextToken);
    getLikedId();
    getSavedId();
    setMediaLikeds(props.mediaLiked);
    setMediaComments(props.comments);
    setCurrentMediaCaption(props.mediaCaption);
    if (props.creatorId === props.userId) {
      setIsOwner(true);
    }
  }, [props]);

  const commentInputChangeHandler = () => {
    if (addCommentElRef.current.value !== "") {
      setIsActiveCommentBtn(true);
    } else {
      setIsActiveCommentBtn(false);
    }
  };

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
    fetch("/graphql", {
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

  const commentSubmitEventHandler = (e) => {
    e.preventDefault();

    const comment_text = addCommentElRef.current.value;

    if (comment_text.trim().length === 0) {
      addCommentElRef.current.value = "";
      return;
    }

    const requestBody = {
      query: `
        mutation CreateComment($mediaId: ID!, $media_comment: String!) {
          createComment(commentInput: {mediaId: $mediaId, media_comment: $media_comment}){
            _id
            creator {
              username
              profile_pic_url
            }
          }
        }
      `,
      variables: {
        mediaId: props.mediaId,
        media_comment: comment_text
      }
    };
    fetch("/graphql", {
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
        let createCommentUsername = resData.data.createComment.creator.username;
        setMediaComments((state) => [
          ...state,
          {
            creator: {
              username: createCommentUsername
            },
            media_comment: comment_text
          }
        ]);
        addCommentElRef.current.value = "";
        setIsActiveCommentBtn(false);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const modifySubmitEventHandler = () => {
    const media_caption = modifyCaptionElRef.current.value;
    const requestBody = {
      query: `
        mutation {
          updateMedia(mediaId: "${props.mediaId}", media_caption: "${media_caption}"){
            _id
            media_caption
          }
        }
        `
    };
    fetch("/graphql", {
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
        setCurrentMediaCaption(resData.data.updateMedia.media_caption);
        setIsEdit(false);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const modifyCancelEventHandler = () => {
    setIsEdit(false);
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
    fetch("/graphql", {
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
      fetch("/graphql", {
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
          setLikedId(resData.data.likedMedia._id);
          const updatedLikeds = mediaLikeds;
          updatedLikeds.push({
            user: {
              username: resData.data.likedMedia.user.username,
              profile_pic_url: resData.data.likedMedia.user.profile_pic_url
            }
          });
          setMediaLikeds(updatedLikeds);
          setIsLiked(true);
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
      fetch("/graphql", {
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
      fetch("/graphql", {
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
      fetch("/graphql", {
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

  const likeModalHandler = () => {
    setIsModal(true);
    props.viewLikes();
  };

  const modalCloseHandler = () => {
    setIsModal(false);
    props.cancelLikes();
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

  const deleteMediaHandler = () => {
    const requestBody = {
      query: `
          mutation DeleteMedia($mediaId: ID!) {
            deleteMedia(mediaId: $mediaId) {
              _id
            }
          }
        `,
      variables: {
        mediaId: props.mediaId
      }
    };

    fetch("/graphql", {
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
      .then((resData) => {})
      .catch((err) => {
        console.log(err);
      });
  };

  const modifyMediaHandler = () => {
    setIsEdit(true);
    setTimeout(() => {
      modifyCaptionElRef.current.value = currentMediaCaption;
    }, 10);
  };

  const commentFocusHandler = () => {
    document.getElementById(props.mediaId).focus();
  };

  return (
    <>
      {isModal && <LikeModal likes={mediaLikeds} onClose={modalCloseHandler} />}
      <li key={props.mediaId} className="feeds_list_li">
        <div className="feed_profile">
          <div className="profile">
            <Link to={"/profile/" + props.creatorName}>
              <img
                src={props.creatorProfile}
                alt={props.creatorName + "님의 프로필 사진"}
                className="profile_img"
              />
            </Link>
            <Link to={"/profile/" + props.creatorName}>
              <p className="profile_id">{props.creatorName}</p>
            </Link>
          </div>
          {isOwner && (
            <>
              <div className="profile_add">
                <span className="state_btn">
                  <span className="icon-dots">
                    <div className="select-box">
                      <div className="select-box__current" tabIndex="1">
                        <div className="select-box__value">
                          <input
                            className="select-box__input"
                            type="radio"
                            defaultChecked
                          />
                          <p className="select-box__input-text"></p>
                        </div>
                      </div>
                      <ul className="select-box__list">
                        <>
                          <li onClick={modifyMediaHandler}>
                            <label
                              className="select-box__option"
                              aria-hidden="aria-hidden"
                            >
                              수정
                            </label>
                          </li>
                          <li onClick={deleteMediaHandler} className="warning">
                            <label
                              className="select-box__option"
                              aria-hidden="aria-hidden"
                            >
                              삭제
                            </label>
                          </li>
                        </>
                      </ul>
                    </div>
                  </span>
                </span>
              </div>
            </>
          )}
        </div>
        <div className="feed_box" onDoubleClick={likeMediaHandler}>
          <Image
            key={props.mediaId}
            cloudName="anstagram123"
            version="1613990153"
            publicId={props.mediaUrl}
            crop="pad"
            width="650"
            height="650"
          />
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
              <button className="icons-button" onClick={commentFocusHandler}>
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
              <div className="comments_info">
                <p className="comments_tit">
                  <span
                    className="likes_number hover-and-pointer"
                    onClick={likeModalHandler}
                  >
                    {mediaLikeds.length} likes
                  </span>
                </p>
              </div>
            </div>
            <div className="comment_list comments_margin">
              <ul className="comments_info comment_list_ul">
                <li>
                  <div className="comments_tit">
                    <Link to={"/profile/" + props.creatorName}>
                      <span className="user_id hover-and-pointer">
                        {props.creatorName}
                      </span>
                    </Link>
                    {!isEdit ? (
                      <span className="comment_contents">
                        {currentMediaCaption}
                      </span>
                    ) : (
                      <>
                        <input
                          type="text"
                          className="timeline-item-modify-text"
                          placeholder="1자 이상 입력하세요!"
                          ref={modifyCaptionElRef}
                        />
                        <button
                          className="timeline-item-modify-btn"
                          onClick={modifySubmitEventHandler}
                        >
                          SUBMIT
                        </button>
                        <button
                          className="timeline-item-modify-btn-cancel"
                          onClick={modifyCancelEventHandler}
                        >
                          CANCEL
                        </button>
                      </>
                    )}
                  </div>
                </li>
                {mediaComments.length > 2 && (
                  <div className="feed_more_comment">
                    <Link to={"/p/" + props.mediaId}>
                      <p className="comment_more_click">
                        댓글 {mediaComments.length}개 모두 보기
                      </p>
                    </Link>
                  </div>
                )}
                {mediaComments.length >= 2 && (
                  <li>
                    <div className="comments_tit">
                      <Link
                        to={
                          "/profile/" +
                          mediaComments[mediaComments.length - 2].creator
                            .username
                        }
                      >
                        <span className="user_id hover-and-pointer">
                          {
                            mediaComments[mediaComments.length - 2].creator
                              .username
                          }
                        </span>
                      </Link>
                      <span className="comment_contents">
                        {mediaComments[mediaComments.length - 2].media_comment}
                      </span>
                    </div>
                  </li>
                )}
                {mediaComments.length >= 1 && (
                  <li>
                    <div className="comments_tit">
                      <Link
                        to={
                          "/profile/" +
                          mediaComments[mediaComments.length - 1].creator
                            .username
                        }
                      >
                        <span className="user_id hover-and-pointer">
                          {
                            mediaComments[mediaComments.length - 1].creator
                              .username
                          }
                        </span>
                      </Link>
                      <span className="comment_contents">
                        {mediaComments[mediaComments.length - 1].media_comment}
                      </span>
                    </div>
                  </li>
                )}
              </ul>
              <div className="feed_time">
                <p className="time">{mediaTimeSet(props.mediaDate)}</p>
              </div>
            </div>
          </div>
        </div>
        <form className="comments_form" onSubmit={commentSubmitEventHandler}>
          <div className="input_box">
            <input
              type="text"
              id={props.mediaId}
              placeholder="댓글달기..."
              onChange={commentInputChangeHandler}
              ref={addCommentElRef}
            />
          </div>
          <div className="button_box">
            {!isActiveCommentBtn ? (
              <button type="submit" className="btn" disabled="disabled">
                <span className="">게시</span>
              </button>
            ) : (
              <button type="submit" className="comment-submit-btn">
                <span className="">게시</span>
              </button>
            )}
          </div>
        </form>
      </li>
    </>
  );
};

export default TimelineItem;
