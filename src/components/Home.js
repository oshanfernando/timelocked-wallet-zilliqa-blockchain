import React from 'react'
import {Tab, Header, Icon} from 'semantic-ui-react'
import MyBeneficiaries from "./MyBeneficiaries";
import MyWallets from "./MyWallets";

const panes = [
  {
    menuItem: { key: 'myBeneficiaries', icon: 'users', content: 'My Beneficiaries' },
    render: () => (
        <Tab.Pane>
          <p>Created wallets can only be claimed/withdrawn by the specified beneficiary when the Unlock Date has been passed</p><br/>
          <MyBeneficiaries/>
        </Tab.Pane>
    )
  },
  {
    menuItem: { key: 'myWallets', icon: 'user', content: 'My Wallets' },
    render: () => (
        <Tab.Pane>
          <p>You can claim/withdraw these wallets when the Unlock Date has been passed</p><br/>
          <MyWallets/>
        </Tab.Pane>),
  },
]

const Home = () => (
    <div>
      <Header as='h2' icon textAlign='center' style={{marginBottom: '2em'}}>
        <Icon name='lock' circular/>
        <Header.Content>TIME-LOCKED WALLETS</Header.Content>
      </Header>
      <Tab panes={panes} />
    </div>)

export default Home
