import React from "react";
import base64url from "base64url";
import sha256 from "sha256";
global.Buffer = global.Buffer || require("buffer").Buffer;

const SPOTIFY_AUTHORIZE_ENDPOINT = "https://accounts.spotify.com/authorize";
const CLIENT_ID = "2576cea43cb54b30809d0dd85c936e6f";
const RESPONSE_TYPE = "code";
const REDIRECT_URL_AFTER_LOGIN = "http://localhost:3000/main";
const SCOPES =
  "user-read-currently-playing user-read-playback-state playlist-read-private playlist-modify-private playlist-modify-public";
const CODE_CHALLENGE_METHOD = "S256";

export default () => {
  const generateRandomString = (myLength) => {
    const chars =
      "AaBbCcDdEeFfGgHhIiJjKkLlMmNnOoPpQqRrSsTtUuVvWwXxYyZz1234567890_.-~";
    const randomArray = Array.from(
      { length: myLength },
      (v, k) => chars[Math.floor(Math.random() * chars.length)]
    );

    const randomString = randomArray.join("");
    return randomString;
  };

  async function createCodeChallenge() {
    localStorage.setItem("code_verifier", generateRandomString(128));

    const hexDigest = sha256(localStorage.getItem("code_verifier"));
    const base64Digest = Buffer.from(hexDigest, "hex").toString("base64");
    const CODE_CHALLENGE = await base64url.fromBase64(base64Digest);

    return CODE_CHALLENGE;
  }

  const handleLogin = async () => {
    localStorage.clear();
    localStorage.setItem("tokens_already_requested", "false");
    localStorage.setItem("user_id_already_requested", "false");
    const setCodeChallenge = await createCodeChallenge();
    window.location = `${SPOTIFY_AUTHORIZE_ENDPOINT}?client_id=${CLIENT_ID}&response_type=${RESPONSE_TYPE}&redirect_uri=${REDIRECT_URL_AFTER_LOGIN}&scope=${SCOPES}&code_challenge_method=${CODE_CHALLENGE_METHOD}&code_challenge=${setCodeChallenge}`;
  };

  // useEffect(() => {
  //   console.log("onLoad has been called")
  //   window.addEventListener('load', localStorage.clear());
  //   return function cleanup() {
  //     window.removeEventListener('load', localStorage.clear());
  //   };
  // }, []);

  return (
    <div className="login">
      <span className="logintext">
        Welcome to Spotify Composite! To get started, click on the button below.
      </span>
      <p>
        <button className="loginbutton" onClick={handleLogin}>
          <strong>Login to Spotify</strong>
        </button>
      </p>
    </div>
  );
};
