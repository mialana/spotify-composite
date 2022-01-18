import React, { useEffect, useState } from "react";
import axios from "axios";
import Compositify from "./Compositify";

const PLAYLISTS_ENDPOINT = "https://api.spotify.com/v1/me/playlists";
const USER_ENDPOINT = "https://api.spotify.com/v1/me";

export default () => {
  const [token, setToken] = useState("");
  const [data, setData] = useState({});
  const [selectedPlaylists, setSelectedPlaylists] = useState([]);
  const [playlistsEndpoint, setPlaylistsEndpoint] = useState(
    "https://api.spotify.com/v1/me/playlists"
  );
  const [total, setTotal] = useState(0);
  const [isSelected, setIsSelected] = useState([]);

  //   hooks like useState don't work in classes

  const handleGetPlaylists = () => {
    // console.log("handleGetPlaylists called");
    // console.log(token);
    const limit = 5;
    axios
      .get(playlistsEndpoint, {
        headers: {
          Authorization: "Bearer " + token,
        },
        params: { limit: limit, offset: 0 },
      })
      .then((response) => {
        // console.log("data: ", data);
        if (total === 0) {
          setData(response.data);
          // setRepeats((response.data.total / limit) + 1);
          // setRepeats(repeats - 1);
        } else if (data.items.length > 0) {
          console.log("this is being called");

          let allDataItems = data.items;
          allDataItems = [...allDataItems, ...response.data.items];
          let allData = data;
          console.log(allData);

          let filteredDataItems = allDataItems.filter(
            (ele, ind) =>
              allData.items.findIndex(
                (elem) => ele.id === elem.id && elem.id === ele.id
              ) === -1
          );
          console.log("this is filtered items: ", filteredDataItems);

          let lastChance = data.items;
          lastChance = [...lastChance, ...filteredDataItems];
          allData = { ...response.data, items: lastChance };

          setData(allData);
          // setRepeats(repeats - 1);
        }

        setTotal(response.data.total);
        console.log("handleGetPlaylists successful");

        // console.log(data);
      })
      .catch((error) => {
        console.log("error was found.", error);
      });
  };

  function playlistClicked(playlist) {
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
        let index = data.items.findIndex((item) => item.id === playlist.id);
        console.log(index);
        let selectionArray = isSelected;
        selectionArray[index] = "true";
        console.log(selectionArray);
        setIsSelected(selectionArray);
      })
      .catch((error) => {
        console.log("get playlist failed: ", error);
      });
  }

  // function findIndex(id) {
  //   for (var i = 0; i < data.length; i++) {
  //     console.log("looking", i)
  //     if (data[i].id === id) {
  //       console.log("found: ", i)
  //       return i;
  //     }
  //   }
  //   console.log("unsuccessful")
  //   return -1; //to handle the case where the value doesn't exist
  // }

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
                  className={
                    isSelected[
                      data.items.findIndex(
                        (playlist) => playlist.id === item.id
                      )
                    ]
                  }
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

  useEffect(() => {
    if (data.next) {
      if (data.next !== null) {
        setPlaylistsEndpoint(data.next);
      }
    }
  });

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
    handleGetPlaylists();
    console.log("selected playlists: ", selectedPlaylists);
  }

  useEffect(() => {
    if (data.next) {
      if (data.next !== null) {
        handleGetPlaylists();
      }
    }
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

  useEffect(() => {
    if (total !== 0) {
      let initIsSelected = Array(total).fill("false");
      console.log(initIsSelected);
      setIsSelected(initIsSelected);
      console.log(data.items);
    }
  }, [total]);

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
