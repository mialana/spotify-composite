import React, { useEffect, useState } from "react";
import axios from "axios";

export default (props) => {
  const [playlistName, setPlaylistName] = useState("");
  const [privacy, setPrivacy] = useState("Public");
  const [isPublic, setIsPublic] = useState(true);
  const [description, setDescription] = useState("");
  const [collaboration, setCollaboration] = useState(false);
  const [token, setToken] = useState("");
  const [playlistID, setPlaylistID] = useState("");
  const [value, setValue] = useState(0);
  const [modifiedArray, setModifiedArray] = useState();

  function forceUpdate() {
    setValue((value) => value + 1); // update the state to force render
  }

  const modifyPrifacy = (input) => {
    setPrivacy(input.target.value);
    if (input.target.value === "Public") {
      setIsPublic(true);
    }
    if (input.target.value === "Private") {
      setIsPublic(false);
    }
  };

  const compositifyCalled = (event) => {
    event.preventDefault();
    forceUpdate();
    if (
      playlistName !== "" &&
      props.playlists.length &&
      localStorage.getItem("user_id")
    ) {
      console.log(playlistName);
      console.log(privacy);
      console.log(description);
      console.log(collaboration);
      console.log(isPublic);
      if (props.playlists.length > 100) {
        alert("WARNING: You have exceeded 100 total playlist items. Your compiled playlist will not contain the excess items.")
        let truncatedArray = props.playlists.slice(0, 100);
        setModifiedArray(truncatedArray);
        createNewPlaylist();
      }
      else {
        setModifiedArray(props.playlists);
        createNewPlaylist();
      }
      
    } else if (playlistName === "") {
      alert("Playlist Name Required!");
    } else if (props.playlists.length) {
      alert("Must Select A Playlist");
    }
  };

  function createNewPlaylist() {
    const userID = localStorage.getItem("user_id");
    const NEW_PLAYLIST_ENDPOINT = `https://api.spotify.com/v1/users/${userID}/playlists`;

    const postBody = {
      name: playlistName,
      public: isPublic,
      collaborative: collaboration,
      description: description,
    };

    axios
      .post(NEW_PLAYLIST_ENDPOINT, JSON.stringify(postBody), {
        headers: {
          Authorization: "Bearer " + token,
        },
      })
      .then((response) => {
        console.log("create new playlist successful");
        setPlaylistID(response.data.id);
        console.log(response.data.id);
      })
      .catch((error) => {
        console.log("error in creating new playlist: ", error);
      });
  }

  useEffect(() => {
    if (playlistID !== "") {
      console.log("add to playlist called");
      console.log("calling 100 uris: ", modifiedArray)
      const ADD_TO_PLAYLIST_ENDPOINT = `https://api.spotify.com/v1/playlists/${playlistID}/tracks`;

      const postBody = {
        position: 0,
        uris: modifiedArray,
      };

      axios
        .post(ADD_TO_PLAYLIST_ENDPOINT, JSON.stringify(postBody), {
          headers: {
            Authorization: "Bearer " + token,
            "Content-Type": "application/json",
          },
        })
        .then((response) => {
          console.log("add to playlist successful");
        })
        .catch((error) => {
          console.log("error in adding to playlist: ", error);
        });
    }
  }, [playlistID]);

  useEffect(() => {
    if (localStorage.getItem("access_token")) {
      setToken(localStorage.getItem("access_token"));
    }
  });

  return (
    <form onSubmit={compositifyCalled}>
      <input
        name="PlaylistName"
        value={playlistName}
        onChange={(input) => setPlaylistName(input.target.value)}
      />
      <textarea
        name="Description"
        value={description}
        onChange={(input) => setDescription(input.target.value)}
      />
      <input
        name="Collaboration"
        type="checkbox"
        checked={collaboration}
        onChange={(input) => setCollaboration(input.target.checked)}
      />
      <div>
        <select
          name="Privacy"
          value={privacy}
          onChange={(input) => modifyPrifacy(input)}
        >
          <option>Public</option>
          <option>Private</option>
        </select>
      </div>
      <button type="submit">Compositify!</button>
    </form>
  );
};
