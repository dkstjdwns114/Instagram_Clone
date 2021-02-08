import React from "react";

import TimelineItem from "./TimelineItem/TimelineItem";

const timelineList = (props) => {
  const medias = props.medias.map((media) => {
    const comment = media.commentTexts.map((media_caption, idx) => {
      return (
        <p key={media_caption._id}>
          <span key={media_caption.creator._id}>
            {media_caption.creator.username}
          </span>{" "}
          : {media_caption.media_comment}
        </p>
      );
    });
    return (
      <TimelineItem
        mediaId={media._id}
        mediaUrl={media.media_url}
        mediaCaption={media.media_caption}
        mediaLiked={media.likeds}
        comment={comment}
        creatorId={media.creator._id}
        userId={props.authUserId}
        likeDetail={props.onLikeDetail}
        commentDetail={props.onCommentDetail}
      />
    );
  });
  return <ul className="events__list">{medias}</ul>;
};

export default timelineList;
