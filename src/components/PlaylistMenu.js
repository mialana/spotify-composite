import React, { useEffect, useState } from "react";
import axios from "axios";
import Compositify from "./Compositify";

const PLAYLISTS_ENDPOINT = "https://api.spotify.com/v1/me/playlists";
const USER_ENDPOINT = "https://api.spotify.com/v1/me";

export default () => {
  const [token, setToken] = useState("");
  const [data, setData] = useState();
  const [selectedPlaylists, setSelectedPlaylists] = useState([]);

  //   hooks like useState don't work in classes

  const handleGetPlaylists = () => {
    // console.log("handleGetPlaylists called");
    // console.log(token);
    axios
      .get(PLAYLISTS_ENDPOINT, {
        headers: {
          Authorization: "Bearer " + token,
        },
        params: { limit: 15, offset: 0 },
      })
      .then((response) => {
        setData(response.data);
        console.log("handleGetPlaylists successful");
      })
      .catch((error) => {
        console.log("error was found.", error);
      });
  };

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
  // needs token as parameter or else this useEffect is called once only

  // useEffect(() => {
  //   if (selectedPlaylists.length > 1) {
  //     console.log("playlists: ", selectedPlaylists);
  //     sessionStorage.setItem("selected_playlists", JSON.stringify(selectedPlaylists));
  //   }
  // }, [selectedPlaylists]);

  function playlistClicked(playlist) {
    console.log("Clicked", playlist.id);
    const token_for_user = localStorage.getItem("access_token");
    const GET_PLAYLIST_ENDPOINT = `https://api.spotify.com/v1/playlists/${playlist.id}`;
    console.log(GET_PLAYLIST_ENDPOINT);
    console.log(token_for_user);
    axios
      .get(GET_PLAYLIST_ENDPOINT, {
        headers: {
          Authorization: "Bearer " + token_for_user,
        },
      })
      .then((response) => {
        console.log("get playlist successful");
        console.log(response.data.tracks.items)
        const trackURIs = response.data.tracks.items.map((item) => {return item.track.uri});
        
        console.log("trackIDs: ", trackURIs)
        setSelectedPlaylists((selectedPlaylists) => [
          ...selectedPlaylists,
          ...trackURIs
        ]);
      })
      .catch((error) => {
        console.log("get playlist failed: ", error);
      });
  }

  function printData() {
    if (data !== undefined) {
      // console.log("print data called");
      // console.log(data.items);
      {
        return data?.items
          ? data.items.map((item) => (
              <div key={item.id}>
                <div
                  onClick={() => playlistClicked(item)}
                  className="listitems"
                >
                  {item.name}
                </div>
              </div>
            ))
          : null;
      }
    }
  }

  // functions need return statements of some sort;

  return (
    <div>
      <div className="left-contentlist">{printData()}</div>
      <p>
        <button>Refresh</button>
        <button>Next</button>
        <button>Previous</button>
      </p>
      <Compositify playlists={selectedPlaylists} />
    </div>
  );
};
