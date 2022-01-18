import React, { useEffect, useState } from "react";
import axios from "axios";
import Compositify from "./Compositify";

const PLAYLISTS_ENDPOINT = "https://api.spotify.com/v1/me/playlists";
const USER_ENDPOINT = "https://api.spotify.com/v1/me";

export default () => {
  const [token, setToken] = useState("");
  const [data, setData] = useState([]);
  const [selectedPlaylists, setSelectedPlaylists] = useState([]);
  const [playlistsEndpoint, setPlaylistsEndpoint] = useState(
    "https://api.spotify.com/v1/me/playlists"
  );
  //   hooks like useState don't work in classes
  const [value, setValue] = useState(0);

  function forceUpdate() {
    setValue((value) => value + 1); // update the state to force render
  }

  const handleGetPlaylists = () => {
    // console.log("handleGetPlaylists called");
    // console.log(token);
    axios
      .get(playlistsEndpoint, {
        headers: {
          Authorization: "Bearer " + token,
        },
        params: { limit: 5, offset: 0 },
      })
      .then((response) => {
        
        console.log(value)
        if (value === 0) {
          setData(response.data);
          setValue(value + 1)
        } else if (value !== 0) {
          setData(data)
        }

        console.log("handleGetPlaylists successful");
        
        
        // console.log(data);
      })
      .catch((error) => {
        console.log("error was found.", error);
      });
  };

  function playlistClicked(playlist, index) {
    console.log("Clicked", playlist);
    const token_for_user = localStorage.getItem("access_token");
    const GET_PLAYLIST_ENDPOINT = `https://api.spotify.com/v1/playlists/${playlist.id}`;
    // console.log(GET_PLAYLIST_ENDPOINT);
    // console.log(token_for_user);
    axios
      .get(GET_PLAYLIST_ENDPOINT, {
        headers: {
          Authorization: "Bearer " + token_for_user,
        },
      })
      .then((response) => {
        console.log("get playlist successful");
        console.log(response.data.tracks.items);
        const trackURIs = response.data.tracks.items
          .map((item) => {
            if (item.track.type !== "track") {
              alert(
                "WARNING: Your playlist contains an item of irregular type. It will not be included in your compiled playlist."
              );
              return null;
            }
            return item.track.uri;
          })
          .filter((item) => {
            return item !== null;
          });
        // console.log("trackIDs: ", trackURIs);
        setSelectedPlaylists((selectedPlaylists) => [
          ...selectedPlaylists,
          ...trackURIs,
        ]);
      })
      .catch((error) => {
        console.log("get playlist failed: ", error);
      });

    let selectedData = data.items.map((item) => {
      if (item.id === playlist.id || item.content === "true") {
        return {
          ...item,
          content: "true",
        };
      }
      else {
        return item;
      }
    });
    console.log("selected data: ", selectedData)
    setData(selectedData);
    handleGetPlaylists();
  }

  function printData() {
    if (data !== undefined) {
      console.log("print data called");
      // console.log(data);
      // console.log(data.items);
      {
        return data?.items
          ? data.items.map((item, i) => (
              <div key={item.id} className="listitems">
                <div
                  className={item.content}
                  onClick={() => playlistClicked(item, i)}
                >
                  {i} {item.name}
                </div>
              </div>
            ))
          : null;
        // functions need return statements of some sort;
      }
    }
  }

  function handleNext() {
    // console.log(data)
    if (data.next === null) {
      alert("Oh no! You don't have any more playlists!");
    }
    if (data.next) {
      setPlaylistsEndpoint(data.next);
    }
  }

  function handlePrevious() {
    // console.log(data)
    if (data.previous === null) {
      alert("Oh no! You don't have any previous playlists!");
    }
    if (data.previous) {
      setPlaylistsEndpoint(data.previous);
    }
  }

  function handleUnselectAll() {
    let clearedArr = [];
    setSelectedPlaylists(clearedArr);
    setValue(0);
    handleGetPlaylists();
    console.log("selected playlists: ", selectedPlaylists);
  }

  useEffect(() => {
    if (playlistsEndpoint !== "https://api.spotify.com/v1/me/playlists")
      handleGetPlaylists();
  }, [playlistsEndpoint]);

  useEffect(() => {
    if (
      localStorage.getItem("access_token") &&
      localStorage.getItem("user_id_already_requested") === "false"
    ) {
      const token_for_user = localStorage.getItem("access_token");
      axios
        .get(USER_ENDPOINT, {
          headers: {
            Authorization: "Bearer " + token_for_user,
          },
        })
        .then((response) => {
          console.log("user profile request successful");
          console.log(response.data.id);
          localStorage.setItem("user_id", response.data.id);
          localStorage.setItem("user_id_already_requested", "true");
        })
        .catch((error) => {
          console.log("get user profile request failed: ", error);
        });
    }
  });

  useEffect(() => {
    if (localStorage.getItem("access_token")) {
      setToken(localStorage.getItem("access_token"));
    }
  });

  useEffect(() => {
    if (token !== "") {
      // call handleGetPlaylists only when token has been set
      handleGetPlaylists();
    }
  }, [token]);

  return (
    <div>
      <div className="left-contentlist">{printData()}</div>
      <p>
        <button onClick={handleUnselectAll}>Unselect All</button>
        <button onClick={handleNext}>Next</button>
        <button onClick={handlePrevious}>Previous</button>
      </p>
      <Compositify playlists={selectedPlaylists} />
    </div>
  );
};
