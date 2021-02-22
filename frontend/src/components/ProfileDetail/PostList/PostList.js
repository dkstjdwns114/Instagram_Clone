import React from "react";

import PostItem from "./PostItem/PostItem";

const postList = (props) => {
  const medias = props.medias.map((media) => {
    return (
      <PostItem
        key={media._id}
        mediaId={media._id}
        mediaUrl={media.media_url}
      />
    );
  });
  return <ul className="board_list">{medias.reverse()}</ul>;
};

export default postList;
