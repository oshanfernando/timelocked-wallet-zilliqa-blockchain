import React, {useState, useContext, useEffect} from 'react';
import {Dimmer, Loader, Table, Label, Message} from 'semantic-ui-react'
import TopUpModal from "./TopUpModal";
import UpdateWalletModal from "./UpdateWalletModal";
import CreateWallet from "./CreateWallet";
import {WALLETSTORE_CONTRACT_ADDR} from "../constants";
import {AppContext} from "../context/UserContext";
import {BN, units, toChecksumAddress, toBech32Address} from "@zilliqa-js/zilliqa";
import {getDateFromBlockNum, getViewBlockLink} from "../helpers";

export default function MyBeneficiaries () {

  const ctx = useContext(AppContext);
  const [currentAddress] = ctx.address;
  const [createdWallets, setCreatedWallets] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const [message, setMessage] = useState({show: false, msg: '', positive: true });

  useEffect(() => {
    getWalletStoreState().then(r => setLoading(false));
  }, [])

  const statusCallback = (msg) => {
    setMessage(msg);
    getWalletStoreState().then(r => setLoading(false));
  }

  const getWalletStoreState = async () => {
    setLoading(true);
    const zilliqa = window.zilPay;
    const state = await zilliqa.contracts.at(WALLETSTORE_CONTRACT_ADDR).getSubState('wallet_info');
    const walletInfo = state.wallet_info;
    setCreatedWallets([]);

    const { result: { header: { BlockNum: currentBlockNum } }} = await window.zilPay.blockchain.getLatestTxBlock();
    const { result: blockRate } = await window.zilPay.blockchain.getTxBlockRate();

    for (const [key, value] of Object.entries(walletInfo)) {
      if (toChecksumAddress(key) === currentAddress.base16) {
        for (const [k, v] of Object.entries(value)) {
          zilliqa.contracts.at(toChecksumAddress(k)).getState()
              .then(res => {
                const row = {
                  contractAddr: k,
                  balance: res['_balance'],
                  beneficiary: v,
                  unlockDate: getDateFromBlockNum(res['target_block'], currentBlockNum, blockRate)
                };
                setCreatedWallets(prevArr => [...prevArr, row]);
              });
        }
        break;
      }
    }
  }

  return (
      <div>
        {
          isLoading ?
              <Dimmer active inverted>
                <Loader size='large'>Please wait... </Loader>
              </Dimmer> : null
        }
        {
          message.show ?
              <Message
                  floating
                  success={message.positive}
                  error={!message.positive}
                  header={message.msg}
              />: null
        }
        <Table singleLine color='green'>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>Contract Address</Table.HeaderCell>
              <Table.HeaderCell>Current Balance</Table.HeaderCell>
              <Table.HeaderCell>Beneficiary</Table.HeaderCell>
              <Table.HeaderCell>Unlock Date</Table.HeaderCell>
              <Table.HeaderCell>Actions</Table.HeaderCell>
            </Table.Row>
          </Table.Header>

          <Table.Body>
            {
              createdWallets.map(row => (
                  <Table.Row key={row.contractAddr}>
                    <Table.Cell>
                      <a href={getViewBlockLink(row.contractAddr)} target='_blank'>{toBech32Address(row.contractAddr)}</a>
                    </Table.Cell>
                    <Table.Cell textAlign='center'>
                      <Label color='green'>
                        {units.fromQa(new BN(row.balance), units.Units.Zil)}
                        <Label.Detail>ZIL</Label.Detail>
                      </Label>
                    </Table.Cell>
                    <Table.Cell>{toBech32Address(row.beneficiary)}</Table.Cell>
                    <Table.Cell>{row.unlockDate}</Table.Cell>
                    <Table.Cell>
                      <TopUpModal contractAddr={row.contractAddr} statusCallback={statusCallback}/>
                      <UpdateWalletModal contractAddr={row.contractAddr} statusCallback={statusCallback}/>
                    </Table.Cell>
                  </Table.Row>
              ))
            }
          </Table.Body>

          <Table.Footer>
            <Table.Row>
              <Table.HeaderCell colSpan='5'>
                <CreateWallet statusCallback={statusCallback}/>
              </Table.HeaderCell>
            </Table.Row>
          </Table.Footer>
        </Table>

      </div>
  )
}
