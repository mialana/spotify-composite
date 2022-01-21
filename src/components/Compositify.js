import React, { useEffect, useState } from "react";
import axios from "axios";

export default (props) => {
  const [playlistName, setPlaylistName] = useState("");
  const [description, setDescription] = useState("");
  const [collaboration, setCollaboration] = useState(false);
  const [privacy, setPrivacy] = useState("Public");
  const [isPublic, setIsPublic] = useState(true);

  const [token, setToken] = useState("");
  const [playlistID, setPlaylistID] = useState("");
  const [playlistURL, setPlaylistURL] = useState("");
  const [modifiedArray, setModifiedArray] = useState();
  const [visible, setVisible] = useState("notVisible");
  const [repeats, setRepeats] = useState();
  const [original, setOriginal] = useState();

  useEffect(() => {
    if (localStorage.getItem("access_token")) {
      setToken(localStorage.getItem("access_token"));
    }
  });

  useEffect(() => {
    if (typeof repeats != "undefined") {
      const currentRepeats = repeats;
      setRepeats(currentRepeats - 1);
    }
  }, [modifiedArray]);

  useEffect(() => {
    if (playlistID !== "" && typeof repeats != "undefined") {
      // console.log("Add to playlist called");
      // console.log("100 uris: ", modifiedArray);
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
        .then(() => {
          const modArrayLastInd = modifiedArray.length - 1;
          const fullArrayLastInd = props.playlists.length - 1;
          if (
            modifiedArray[modArrayLastInd] !==
              props.playlists[fullArrayLastInd] &&
            repeats !== 0
          ) {
            const offset = original - repeats + 1;
            const start = offset * 100;
            if (repeats !== 1) {
              const end = start + 100;
              let truncatedArray = props.playlists.slice(start, end);
              setModifiedArray(truncatedArray);
            }
          } else if (
            modifiedArray[modArrayLastInd] === props.playlists[fullArrayLastInd]
          ) {
            const visibility = "isVisible";
            setVisible(visibility);
          }
        })
        .catch((error) => {
          console.log("error in adding to playlist: ", error);
        });
    }
  }, [playlistID, repeats]);

  function compositifyCalled(event) {
    event.preventDefault();
    if (collaboration == true && isPublic == true) {
      alert("To create a collaborative playlist, you must set the playlist to private")
      return;
    }
    if (
      playlistName !== "" &&
      props.playlists.length &&
      localStorage.getItem("user_id")
    ) {
      if (props.playlists.length > 100) {
        let truncatedArray = props.playlists.slice(0, 100);
        setModifiedArray(truncatedArray);
        createNewPlaylist();
      } else {
        setModifiedArray(props.playlists);
        createNewPlaylist();
      }
    } else if (playlistName === "") {
      alert("Playlist Name Required!");
    } else if (!props.playlists.length) {
      alert("Must Select A Playlist");
    }
  }

  function createNewPlaylist() {
    // console.log(props.playlists);
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
        // console.log("Create new playlist successful");
        setPlaylistURL(response.data.external_urls.spotify);
        setPlaylistID(response.data.id);

        if (modifiedArray !== props.playlists) {
          const numOfRepeats = Math.floor(props.playlists.length / 100) + 1;
          setOriginal(numOfRepeats);
          setRepeats(numOfRepeats);
        }
        if (modifiedArray === props.playlists) {
          setRepeats(0);
        }
      })
      .catch((error) => {
        console.log("Error in creating new playlist: ", error);
      });
  }

  function modifyPrifacy(input) {
    setPrivacy(input.target.value);
    if (input.target.value === "Public") {
      setIsPublic(true);
    }
    if (input.target.value === "Private") {
      setIsPublic(false);
    }
  }

  function resetAll() {
    props.forReset();
    setPlaylistName("");
    setDescription("");
    setCollaboration(false);
    setPrivacy("Public");
    setIsPublic(true);
    setPlaylistID("");
    setPlaylistURL("");
    setModifiedArray();
    setVisible("notVisible");
    setRepeats();
    setOriginal();
  }

  return (
    <div className="formOverall">
      <div className="customize">
        <strong>Customize Your Playlist!</strong>
      </div>
      <form onSubmit={compositifyCalled} className="form">
        <input
          name="PlaylistName"
          value={playlistName}
          onChange={(input) => setPlaylistName(input.target.value)}
          placeholder="~ Playlist Name ~"
          className="playlistName"
        />
        <textarea
          name="Description"
          value={description}
          onChange={(input) => setDescription(input.target.value)}
          placeholder="Description:"
          className="description"
        />
        <div className="privacyCollaboration">
          <div>
            <select
              name="Privacy"
              value={privacy}
              onChange={(input) => modifyPrifacy(input)}
              className="privacy"
            >
              <option>Public</option>
              <option>Private</option>
            </select>
          </div>
          <div className="collaborationText">
            Collaboration?
            <input
              className="collaboration"
              name="Collaboration"
              type="checkbox"
              checked={collaboration}
              onChange={(input) => setCollaboration(input.target.checked)}
            />
          </div>
        </div>
        <button type="submit" className="submit">
          <strong>COMPOSITIFY!</strong>
        </button>
      </form>
      <a
        className={visible}
        href={playlistURL}
        rel="noopener noreferrer"
        target="_blank"
      >
        <strong>Bring Me To My Playlist!</strong>
      </a>
      <button className={visible} onClick={resetAll}>
        <strong>Reset All</strong>
      </button>
    </div>
  );
};
