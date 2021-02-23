import React, { Component } from "react";
import Axios from "axios";

import "./css/PostDetail.css";

class TestPage extends Component {
  state = {
    imageSelected: ""
  };

  uploadImage = () => {
    console.log(this.state.imageSelected);
    const formData = new FormData();
    formData.append("file", this.state.imageSelected);
    formData.append("upload_preset", "anstagram");

    console.log(formData);

    Axios.post(
      "https://api.cloudinary.com/v1_1/anstagram123/image/upload",
      formData
    )
      .then((response) => {
        console.log(response.data.public_id);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  render() {
    return (
      <div style={{ marginTop: "80px" }}>
        <input
          type="file"
          onChange={(event) => {
            this.setState({ imageSelected: event.target.files[0] });
          }}
        />
        <button onClick={this.uploadImage}>Upload Image</button>
      </div>
    );
  }
}

export default TestPage;
