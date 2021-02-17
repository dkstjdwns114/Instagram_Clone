import React from "react";

import TimelineItem from "./TimelineItem/TimelineItem";

const timelineList = (props) => {
  const medias = props.medias.map((media) => {
    return (
      <TimelineItem
        mediaId={media._id}
        mediaUrl={media.media_url}
        mediaCaption={media.media_caption}
        mediaLiked={media.likeds}
        commentCnt={media.commentTexts.length}
        creatorId={media.creator._id}
        userId={props.authUserId}
      />
    );
  });
  return <ul className="events__list">{medias}</ul>;
};

export default timelineList;
