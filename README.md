# spark-spotify-composite

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

NOTE - PLEASE READ: According to the Spotify API Developer rules, this app requires specific user account 
authorization to use.
Please email liu.amy05@gmail.com if you wish to obtain access to this app.

- View the following link for more information on this requirement:
  [Spotify For Developers](https://developer.spotify.com/community/news/2021/05/27/improving-the-developer-and-user-experience-for-third-party-apps/)
  
## Description

For the Spark Red Technical Assessment, I made an app called Spotify Composite.
It essentially merges multiple playlists from a user's Spotify account into 
one large, customized playlist.

Upon arriving on the initial log-in page, users will be asked to sign in to their
Spotify account and confirm that the app can access certain data from their account.

After confirming, they will be redirected to the app's home page, where they can see
a scroll menu containing their playlists and a customization menu containing various fields.

To use the app, the user should first select as little or as many of their playlists 
as they'd like. Then, they should fill in the fields on the right-hand side to their liking.
The only required field is playlist name.

Lastly, the user just needs to press the "COMPOSITIFY" button. The merged playlist will
be created and placed in your account, and two buttons will pop up.
One will open a new tab directing you to your playlist, the other will reset all fields.

Enjoy your Compositify-ed Playlist!!!

## Implemented Features

Authorization Code Flow and API Calls:
My app utilizes the PKCE extension of the [Spotify Authorization Code Flow](https://developer.spotify.com/documentation/general/guides/authorization/code-flow/)

I chose to use Axios GET/POST requests to make my API calls. 
Listed below are the specific types of calls made to the Spotify API:

- User Authorization Request(Same link as above)
- Access Token Request (Same link as above)
- Refreshed Access Token Request (Same link as above)
- [Get Current User's Profile Request](https://developer.spotify.com/documentation/web-api/reference/#/operations/get-current-users-profile)
- [Get Current User's Playlists Request](https://developer.spotify.com/documentation/web-api/reference/#/operations/get-a-list-of-current-users-playlists)
- [Get Playlist Request](https://developer.spotify.com/documentation/web-api/reference/#/operations/get-playlist)
- [Create Playlist Request](https://developer.spotify.com/documentation/web-api/reference/#/operations/create-playlist)
- [Add Items to Playlist Request](https://developer.spotify.com/documentation/web-api/reference/#/operations/add-tracks-to-playlist)

UI/UX Features:
- Redirect to Login Page by clicking logo
- Redirect to playlist url by clicking playlist image
- Unselect button
- Unselect All button
- Scrollable Div Box
- "COMPOSITIFY" Form Submission button
- Bring Me To My Playlist button
- Reset All button

Miscellaneous Features:
- Site deployed on Netlify
- General HTML/CSS
- React hooks
- Components
- Animations

## Time Spent

Friday, January 14th: 3 hrs
Saturday, January 15th: 2.5 hrs
Sunday, January 16th - Thursday, January 20th: Brief 15-30 minute work sessions

## How to Run

Method 1: [Live Deployment of Website on Netlify](https://boring-brahmagupta-56d3ae.netlify.app)

Method 2: Run site locally using the following steps:

First, download the .zip file for the master branch above.

Then, make sure you have node and npm installed using:

### `node -v`
### `npm -v`

If not installed, download the appropriate package on [this site](https://nodejs.org/en/download/)

Now, navigate into the project directory and run:

### `npm install`

Followed by:

### `npm start`

This will run the app in development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\