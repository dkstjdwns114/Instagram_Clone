import React from "react";

import SaveItem from "./SavedItem/SavedItem";

const savedList = (props) => {
  const medias = props.medias.map((saved) => {
    return (
      <SaveItem
        key={saved.media._id}
        mediaId={saved.media._id}
        mediaUrl={saved.media.media_url}
      />
    );
  });
  return <ul className="board_list">{medias.reverse()}</ul>;
};

export default savedList;
