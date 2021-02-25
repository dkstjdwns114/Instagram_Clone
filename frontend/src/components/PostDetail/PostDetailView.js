import React, { useState, useEffect, useRef } from "react";
import { Image } from "cloudinary-react";
import { Link, useHistory } from "react-router-dom";

const PostDetailView = (props) => {
  const [commentareaElRef, setCommenttextElRef] = useState(null);
  const [token, setAccessToken] = useState(null);
  const [comments, setComments] = useState([]);
  const [isActiveCommentBtn, setIsActiveCommentBtn] = useState(false);
  const [currentMediaCaption, setCurrentMediaCaption] = useState("");
  const [isEdit, setIsEdit] = useState(false);
  const modifyCaptionElRef = useRef();
  const scrollBottomRef = useRef();
  const history = useHistory();

  useEffect(() => {
    setAccessToken(props.accessToken);
    setComments(props.comments);
    setCommenttextElRef(React.createRef());
    setCurrentMediaCaption(props.media_caption);
  }, []);

  const commentInputChangeHandler = () => {
    if (commentareaElRef.current.value !== "") {
      setIsActiveCommentBtn(true);
    } else {
      setIsActiveCommentBtn(false);
    }
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
        history.push("/timeline");
      })
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

  const commentMediaHandler = (e) => {
    e.preventDefault();

    let text = commentareaElRef.current.value;

    if (text.trim().length === 0) {
      commentareaElRef.current.value = "";
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
        media_comment: text
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
        let createCommentUsername = resData.data.createComment.creator.username;
        let createCommentUserProfile =
          resData.data.createComment.creator.profile_pic_url;
        setComments((state) => [
          ...state,
          {
            creator: {
              username: createCommentUsername,
              profile_pic_url: createCommentUserProfile
            },
            media_comment: text,
            date: new Date().getTime()
          }
        ]);
        commentareaElRef.current.value = "";
        setTimeout(() => {
          scrollBottomRef.current.scrollIntoView({
            behavior: "smooth"
          });
        }, 300);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const modifySubmitEventHandler = () => {
    const media_caption = modifyCaptionElRef.current.value;
    console.log(media_caption);
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

  return (
    <article className="social-article">
      <div className="social-left-col">
        <div className="social-img-wrap">
          <Image
            key={props.mediaId}
            cloudName="anstagram123"
            version="1613990153"
            publicId={props.media_url}
            crop="pad"
            width="650"
            height="650"
          />
        </div>
      </div>
      <div className="social-right-col">
        <div className="social-header">
          <Link
            to={"/profile/" + props.creator_name}
            className="social-profile-img"
          >
            <img
              src={props.creator_profile}
              alt={props.creator_name + "님의 프로필 사진"}
            />
          </Link>
          <div className="social-follow">
            <Link to={"/profile/" + props.creator_name} className="social-name">
              {props.creator_name}
            </Link>
          </div>
          {props.isOwner && (
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
        <div className="social-comments-wrap">
          <div className="social-post">
            <div className="comment-header">
              <Link
                to={"/profile/" + props.creator_name}
                className="social-profile-img"
              >
                <img
                  src={props.creator_profile}
                  alt={props.creator_name + "님의 프로필 사진"}
                />
              </Link>
              <div className="social-copy">
                <Link to={"/profile/" + props.creator_name}>
                  <span className="social-name">{props.creator_name}</span>
                </Link>
                {!isEdit ? (
                  <span className="social-post-copy">
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

                <time>{props.convertTime(props.date)}</time>
              </div>
            </div>
            {comments.map((comment, idx) => {
              return (
                <div key={idx} className="comment-header">
                  <Link
                    to={"/profile/" + comment.creator.username}
                    className="social-profile-img"
                  >
                    <img
                      src={comment.creator.profile_pic_url}
                      alt={comment.creator.username + "님의 프로필 사진"}
                    />
                  </Link>
                  <div className="social-copy">
                    <Link to={"/profile/" + comment.creator.username}>
                      <span className="social-name">
                        {comment.creator.username}
                      </span>
                    </Link>
                    <span className="social-post-copy">
                      {comment.media_comment}
                    </span>
                    <time>{props.convertTime(comment.date)}</time>
                  </div>
                </div>
              );
            })}
            <div ref={scrollBottomRef} className="list-bottom"></div>
          </div>
          <div className="social-icons">
            <section className="icons-section">
              <button className="icons-button" onClick={props.likeHandler}>
                {!props.isLiked ? (
                  <span className="icon1"></span>
                ) : (
                  <span className="liked"></span>
                )}
              </button>
              <button className="icons-button" onClick={props.commentFocus}>
                <span className="icon2"></span>
              </button>
              <button className="icons-button" onClick={props.saveHandler}>
                {!props.isSaved ? (
                  <span className="icon4"></span>
                ) : (
                  <span className="saved"></span>
                )}
              </button>
            </section>
            <div className="likes-wrap" onClick={props.likeModal}>
              <span>{props.likeds.length}</span> likes
            </div>
          </div>
          <div className="social-date">
            <time>{props.convertTime(props.date)}</time>
          </div>
          <form
            onSubmit={commentMediaHandler}
            className="postdetail_comments_form"
          >
            <div className="input_box">
              <input
                type="text"
                id="commentarea"
                placeholder="Add a comment..."
                ref={commentareaElRef}
                onChange={commentInputChangeHandler}
              />
            </div>
            <div className="button_box">
              {isActiveCommentBtn ? (
                <input
                  type="submit"
                  className="active-comment-btn"
                  value="SUBMIT"
                />
              ) : (
                <input
                  type="submit"
                  className="disabled-comment-btn"
                  value="SUBMIT"
                  disabled="disabled"
                />
              )}
            </div>
          </form>
        </div>
      </div>
    </article>
  );
};

export default PostDetailView;
