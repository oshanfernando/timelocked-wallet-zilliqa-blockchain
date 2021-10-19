import React, {useContext} from "react";
import NavBar from "./components/NavBar";
import {AppContext} from "./context/UserContext";
import {Container} from 'semantic-ui-react'
import Home from "./components/Home";
import LandingPage from "./components/LandingPage";


function App() {
  const ctx = useContext(AppContext);
  const [authenticated, setAuthenticated] = ctx.auth;

  return (
      <div>
        {authenticated ?
            <Container>
              <NavBar/>
              <Home/>
            </Container>
            : <LandingPage/>
        }
      </div>
  );
}

export default App;
