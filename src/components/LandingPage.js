import React, {useContext, useState} from 'react';
import {Button} from "semantic-ui-react";
import {AppContext} from "../context/UserContext";
import {BN, units} from "@zilliqa-js/zilliqa";

export default function LandingPage() {
  const ctx = useContext(AppContext);
  const [authenticated, setAuthenticated] = ctx.auth;
  const [balance, setBalance] = ctx.balance;
  const [currentAddress, setCurrentAddress] = ctx.address;

  const [loading, setLoading] = useState(false);

  const authenticateZilPay = async () => {
    if (typeof window.zilPay !== 'undefined') {
      setLoading(true);
      if (window.zilPay.wallet.net !== 'testnet') {
        throw new Error('Accessible only on TestNet');
      }
      try {
        const isConnect = await window.zilPay.wallet.connect();
        if (isConnect) {
          const zilliqa = window.zilPay;
          const address = zilliqa.wallet.defaultAccount;
          setCurrentAddress(address);
          const balanceState = await zilliqa.blockchain.getBalance(address.bech32);
          const balance = balanceState.result.balance;

          setBalance(units.fromQa(new BN(balance), units.Units.Zil))
          setAuthenticated(true);
          setLoading(false);

        } else {
          throw new Error('user rejected');
        }
      } catch (error) {
        setLoading(false);
        setAuthenticated(false)
      }
    } else {
      alert('ZilPay is not installed');
    }
  }

  return (
      <div style={styles}>
        <div style={center}>
          <h1 style={{fontSize: '50px', color: 'white'}}>TIME-LOCKED WALLETS</h1> <br/>
          <p style={{fontSize: '20px', color: '#ffffff99'}}> Lock you ZIL securely until a date you wish with access to the funds only by a specified person</p>
          <div style={{marginTop: '50px'}}>
            <Button loading={loading} size='huge' inverted basic onClick={authenticateZilPay}>
              Connect ZilPay
            </Button>
          </div>
        </div>

        <footer style={footerStyle}>
          <a href="https://www.freepik.com/vectors/background">Background vector created by starline - www.freepik.com</a>
        </footer>
      </div>
  )
}

const styles = {
  backgroundImage: "url(/background2.jpg)",
  height: '100vh',
  backgroundPosition: 'center',
  backgroundRepeat: 'no-repeat',
  backgroundSize: 'cover'
}

const center = {
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  height: '100%'
}

const footerStyle = {
  position: 'fixed',
  left: 0,
  bottom: 0,
  width: '100%',
  color: 'gray',
  textAlign: 'right'
}


