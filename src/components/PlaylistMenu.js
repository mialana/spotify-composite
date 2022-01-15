import React, { useEffect, useState } from "react";
import PrintPlaylists from "./PrintPlaylists";
import axios from "axios";

const PLAYLISTS_ENDPOINT = "https://api.spotify.com/v1/me/playlists";

export default () => {
  const [token, setToken] = useState("");
  const [data, setData] = useState([]);
  const [selectedPlaylists, setSelectedPlaylists] = useState([]);

  //   hooks like useState don't work in classes

  const handleGetPlaylists = async () => {
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
        printData();
      })
      .catch((error) => {
        console.log("error was found.", error);
      });
  };

  useEffect(() => {
    if (localStorage.getItem("access_token")) {
      setToken(localStorage.getItem("access_token"));
    }
  });

  useEffect(() => {
    if (token != "") {
      // call handleGetPlaylists only when token has been set
      handleGetPlaylists();
    }
  }, [token]);
  // needs token as parameter or else this useEffect is called once only

  function playlistClicked(item) {
    console.log("Clicked", item.name)
    setSelectedPlaylists(selectedPlaylists => [...selectedPlaylists, item]);
  }

  useEffect(() => {
    console.log(selectedPlaylists);
  }, [selectedPlaylists])

  function printData() {
    if (data != []) {
      // console.log("print data called");
      // console.log(data.items);
      {
        return data?.items
          ? data.items.map((item) => (
              <div key={item.id}>
                <div onClick={() => playlistClicked(item)} className="listitems">{item.name}</div>
              </div>
            ))
          : null;
      }
    }
  }

  // functions need return statements of some sort;

  return <div className= "left-contentlist">{printData()}</div>;
};
