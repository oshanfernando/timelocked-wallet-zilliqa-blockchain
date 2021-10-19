import React, {useContext} from 'react'
import {Icon, Container, Label} from "semantic-ui-react";
import {AppContext} from "../context/UserContext";

export default function NavBar() {

  const ctx = useContext(AppContext);
  const [authenticated, setAuthenticated] = ctx.auth;

  return (
      <Container style={headerStyles}>
        <Container style={{
          textAlign: 'right',
          width: '100%'
        }}>
          {
            authenticated ?
                <Label size='large' style={{
                  margin: 20
                }} color={authenticated ? 'green' : 'red'} >
                  <Icon name='user' />
                  {authenticated ? 'Connected' : 'Not Connected'}
                </Label> : null
          }
        </Container>

      </Container>
  )
}

const headerStyles = {
  backgroundColor: 'transparent',
  height: '5em',
  width: '100%',
  position: 'relative'
}
