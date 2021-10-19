import React from 'react'
import {Button, Modal, Icon, Form, Dimmer, Loader, Header} from 'semantic-ui-react'
import {Long, units, toBech32Address} from "@zilliqa-js/zilliqa";
import {pollReceipt} from "../helpers";

export default function TopUpModal({contractAddr, statusCallback}) {
  const [open, setOpen] = React.useState(false);
  const [isLoading, setLoading] = React.useState(false);
  const [depositZilAmount, setDepositZilAmount] = React.useState(0.0);

  const depositFunds = async () => {
    if (depositZilAmount > 0) {
      setLoading(true);
      const zilliqa = window.zilPay;
      const walletStoreContract = zilliqa.contracts.at(contractAddr);

      const gasPrice = units.toQa('2000', units.Units.Li);
      const amount = units.toQa(depositZilAmount, units.Units.Zil);
      const gasLimit = Long.fromNumber(8000);

      const contractCall = await walletStoreContract.call(
          'DepositFunds',
          [],
          {
            amount,
            gasPrice,
            gasLimit
          }
      );
      const receipt = await pollReceipt(contractCall.TranID);
      if (receipt.success) {
        statusCallback({
          show: true,
          msg: `You have successfully deposited ${depositZilAmount} ZIL`,
          positive: true });
      } else {
        statusCallback({
          show: true,
          msg: 'Top-Up failed!!',
          positive: false });
      }
      setLoading(false);
      setOpen(false);
    }
  }


  return(
      <Modal
          size='tiny'
          onClose={() => setOpen(false)}
          onOpen={() => setOpen(true)}
          open={open}
          closeOnEscape={false}
          closeOnDimmerClick={false}
          trigger={<Icon title="Top-Up" name='dollar sign' size='large'/>}
      >
        {
          isLoading ?
              <Dimmer active inverted>
                <Loader size='large'>Confirming transaction... </Loader>
              </Dimmer> : null
        }
        <Modal.Header>Top-up wallet </Modal.Header>
        <Modal.Content>
          <Header>Deposit funds to {toBech32Address(contractAddr)}</Header>
          <br/>
          <Form>
            <Form.Input
                fluid
                label='Amount (ZIL)'
                id='form-input-amount'
                type={'number'}
                value={depositZilAmount}
                onChange={e => setDepositZilAmount(e.target.value)}
            />
          </Form>
        </Modal.Content>
        <Modal.Actions>
          <Button negative onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button
              positive
              disabled={depositZilAmount <= 0}
              onClick={depositFunds}>
            Deposit
          </Button>
        </Modal.Actions>
      </Modal>
  )
}
