import React from "react";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import PlaylistMenu from "./PlaylistMenu";

const CLIENT_ID = "2576cea43cb54b30809d0dd85c936e6f";
const TOKEN_ENDPOINT = "https://accounts.spotify.com/api/token";
const DELAY = 10000;

export default () => {
  const [searchParams] = useSearchParams();
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (localStorage.getItem("tokens_already_requested") === "false") {
      // console.log("request for tokens initiated");
      const code = searchParams.get("code");

      const postBody = {
        client_id: CLIENT_ID,
        grant_type: "authorization_code",
        code: code,
        redirect_uri: "http://localhost:3000/main",
        code_verifier: localStorage.getItem("code_verifier"),
      };

      axios
        .post(TOKEN_ENDPOINT, queryStringify(postBody), {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded;",
          },
        })
        .then((response) => {
          // console.log(response.data)
          // console.log("request for tokens successful");
          localStorage.setItem("access_token", response.data.access_token);
          localStorage.setItem("refresh_token", response.data.refresh_token);
          localStorage.setItem("tokens_already_requested", "true");
          forceUpdate();
        })
        .catch((error) => {
          console.log("error in request for tokens.", error);
        });
    }
  });

  useEffect(() => {
    const interval = setInterval(() => {
      forceUpdate();
      requestUsingRefreshToken();
    }, DELAY);

    return () => clearInterval(interval);
  }, []);

  function requestUsingRefreshToken() {
    if (localStorage.getItem("refresh_token")) {
      // console.log("Request using refresh token initiated");

      const postBody = {
        grant_type: "refresh_token",
        client_id: CLIENT_ID,
        refresh_token: localStorage.getItem("refresh_token"),
      };

      axios
        .post(TOKEN_ENDPOINT, queryStringify(postBody), {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded;",
          },
        })
        .then((response) => {
          // console.log("request using refresh token successful");
          // console.log(response.data);

          localStorage.setItem("access_token", response.data.access_token);
          localStorage.setItem("refresh_token", response.data.refresh_token);
        })
        .catch((error) => {
          console.log("Error in request using refresh token.", error);
        });
    }
  }

  function forceUpdate() {
    let updatedValue = value + 1;
    setValue(updatedValue);
  }

  function queryStringify(obj) {
    let str = [];
    for (var p in obj)
      if (obj.hasOwnProperty(p)) {
        str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
      }
    return str.join("&");
  }

  return (
    <div>
      <PlaylistMenu />
    </div>
  );
};
