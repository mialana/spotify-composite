import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import Main from "./components/Main.js"
import LoginPage from "./components/LoginPage.js"
import './App.css';

export default class App extends React.Component {
  render() {
    return (
      <Router>
        <Routes>
          <Route path="/main" element={<Main />}>
          </Route>
          <Route path="/" element={<LoginPage />} />
        </Routes>

      </Router>



    );
  }
}