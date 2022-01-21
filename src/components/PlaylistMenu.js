import React, { useEffect, useState } from "react";
import axios from "axios";
import Compositify from "./Compositify";

const PLAYLISTS_ENDPOINT = "https://api.spotify.com/v1/me/playlists";
const USER_ENDPOINT = "https://api.spotify.com/v1/me";

export default () => {
  const [token, setToken] = useState("");
  const [data, setData] = useState({});
  const [selectedTracks, setSelectedTracks] = useState([]);
  const [total, setTotal] = useState(0);
  const [isSelected, setIsSelected] = useState([]);
  const [playlistsEndpoint, setPlaylistsEndpoint] = useState(
    "https://api.spotify.com/v1/me/playlists"
  );

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
          // console.log("user profile request successful");
          // console.log("User ID: ", response.data.id);
          localStorage.setItem("user_id", response.data.id);
          localStorage.setItem("user_id_already_requested", "true");
        })
        .catch((error) => {
          console.log("Get user profile request failed: ", error);
        });
    }
  });

  useEffect(() => {
    if (total !== 0) {
      let initialIsSelected = Array(total).fill("notSelected");
      // console.log("Initial isSelected Array: ", initialIsSelected);
      setIsSelected(initialIsSelected);
    }
  }, [total]);

  useEffect(() => {
    if (localStorage.getItem("access_token")) {
      setToken(localStorage.getItem("access_token"));
    }
    if (data.next) {
      if (data.next !== null) {
        setPlaylistsEndpoint(data.next);
      }
    }
  });

  useEffect(() => {
    if (data.next) {
      if (data.next !== null) {
        handleGetPlaylists();
      }
    }
  }, [playlistsEndpoint]);

  useEffect(() => {
    if (token !== "") {
      handleGetPlaylists();
    }
  }, [token]);

  useEffect(() => {
    if (isSelected.length > 0) {
      // console.log("Print Data called from useEffect");
      printData();
    }
  }, [isSelected]);

  function handleGetPlaylists() {
    axios
      .get(playlistsEndpoint, {
        headers: {
          Authorization: "Bearer " + token,
        },
        params: { limit: 5, offset: 0 },
      })
      .then((response) => {
        if (total === 0) {
          setData(response.data);
        } else if (data.items.length > 0) {
          let filteredDataItems = response.data.items.filter(
            (ele) =>
              data.items.findIndex(
                (elem) => ele.id === elem.id && elem.id === ele.id
              ) === -1
          );

          let totalDataItems = data.items;
          totalDataItems = [...totalDataItems, ...filteredDataItems];

          let totalData = data;
          totalData = { ...response.data, items: totalDataItems };
          setData(totalData);
        }
        setTotal(response.data.total);
        // console.log("handleGetPlaylists successful");

        // console.log(data);
      })
      .catch((error) => {
        console.log("Error was found.", error);
      });
  }

  function playlistClicked(playlist, selected, endpoint) {
    // console.log("Clicked: ", playlist);

    let index = data.items.findIndex((item) => item.id === playlist.id);
    // console.log("Index of selection: ", index);
    let selectionArray = isSelected;
    if (selected === true) {
      selectionArray[index] = "wasSelected";
    }
    if (selected === false) {
      selectionArray[index] = "notSelected";
    }
    // console.log("Current selection state array: ", selectionArray);
    setIsSelected(selectionArray);

    const token_for_user = localStorage.getItem("access_token");
    const GET_PLAYLIST_ENDPOINT = `https://api.spotify.com/v1/playlists/${playlist.id}`;
    // console.log(token_for_user);
    axios
      .get(endpoint, {
        headers: {
          Authorization: "Bearer " + token_for_user,
        },
      })
      .then((response) => {
        // console.log("Get playlist successful");
        // console.log("Returned Selected Tracks: ", response.data);

        if (selected === true) {
          if (response.data.items) {
            const trackURIs = response.data.items
              .map((item) => {
                if (item.track.type !== "track") {
                  alert(
                    "WARNING: Your playlist contains an item of irregular type. It will not be included in your compiled playlist."
                  );
                  return null;
                } else if (item.track.type === "track") {
                  return item.track.uri;
                }
              })
              .filter((item) => {
                return item !== null;
              });
            // console.log("trackURIs: ", trackURIs);
            setSelectedTracks((selectedTracks) => [
              ...selectedTracks,
              ...trackURIs,
            ]);
            if (response.data.next !== null) {
              playlistClicked(playlist, selected, response.data.next);
            }
          } else if (response.data.tracks.items) {
            const trackURIs = response.data.tracks.items
              .map((item) => {
                if (item.track.type !== "track") {
                  alert(
                    "WARNING: Your playlist contains an item of irregular type. It will not be included in your compiled playlist."
                  );
                  return null;
                } else if (item.track.type === "track") {
                  return item.track.uri;
                }
              })
              .filter((item) => {
                return item !== null;
              });
            // console.log("trackURIs: ", trackURIs);
            setSelectedTracks((selectedTracks) => [
              ...selectedTracks,
              ...trackURIs,
            ]);
            if (response.data.tracks.next !== null) {
              playlistClicked(playlist, selected, response.data.tracks.next);
            }
          }
        }
        if (selected === false) {
          const updatedTracks = selectedTracks;

          const unselectedURIs = response.data.tracks.items.map((item) => {
            return item.track.uri;
          });

          const urisRemoved = updatedTracks.filter(
            (ele) =>
              unselectedURIs.findIndex(
                (elem) => ele === elem && elem === ele
              ) === -1
          );
          // console.log(urisRemoved);
          setSelectedTracks(urisRemoved);
        }
      })
      .catch((error) => {
        console.log("Get playlist failed: ", error);
      });
  }

  function printData() {
    if (data !== undefined) {
      // console.log("Print Data called");
      // console.log(data);
      {
        return data?.items
          ? data.items.map((item, i) => (
              <div
                key={item.id}
                className={
                  isSelected[
                    data.items.findIndex((playlist) => playlist.id === item.id)
                  ]
                }
                onClick={() =>
                  playlistClicked(
                    item,
                    true,
                    `https://api.spotify.com/v1/playlists/${item.id}`
                  )
                }
              >
                <div className="pictures">
                  <a href={item.external_urls.spotify}>
                    <img
                      src={item.images[0].url}
                      alt="albumpicture"
                      className="albumPic"
                    ></img>
                  </a>
                </div>
                <div className="tracks">
                  <div>
                    <strong>{item.name}</strong>
                  </div>
                </div>
                <div className="unselectButton">
                  <button
                    className="unselect"
                    onClick={(b) => {
                      b.stopPropagation();
                      playlistClicked(
                        item,
                        false,
                        `https://api.spotify.com/v1/playlists/${item.id}`
                      );
                    }}
                  >
                    <strong>X</strong>
                  </button>
                </div>
              </div>
            ))
          : null;
      }
    }
  }

  function handleUnselectAll() {
    let clearedArr = [];
    // console.log("Cleared playlists: ", clearedArr);
    setSelectedTracks(clearedArr);
    let initialIsSelected = Array(total).fill("notSelected");
    // console.log("Initial isSelected Array: ", initialIsSelected);
    setIsSelected(initialIsSelected);
  }

  return (
    <div className="overallPage">
      <div className="left-contentlist">
        <div className="choose"><strong>Choose from your Playlists Below!</strong></div>
        <p>
          <button className="unselectAll" onClick={handleUnselectAll}>
            <strong>UNSELECT ALL</strong>
          </button>
        </p>
        {printData()}
      </div>

      <Compositify playlists={selectedTracks} forReset={handleUnselectAll} />
    </div>
  );
};
