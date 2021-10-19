import React from 'react'
import {Button, Dimmer, Header, Icon, Loader, Modal} from 'semantic-ui-react'
import {BN, Long, units} from "@zilliqa-js/zilliqa";
import {pollReceipt} from "../helpers";

export default function WithdrawModal({contractAddr, statusCallback}) {
  const [open, setOpen] = React.useState(false);
  const [isLoading, setLoading] = React.useState(false);

  const withdrawFunds = async () => {
    setLoading(true);
    const zilliqa = window.zilPay;
    const walletStoreContract = zilliqa.contracts.at(contractAddr);

    const gasPrice = units.toQa('2000', units.Units.Li);
    const amount = new BN(0);
    const gasLimit = Long.fromNumber(8000);

    const contractCall = await walletStoreContract.call(
        'WithdrawFunds',
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
        msg: `You have successfully withdrawn the balance to your wallet`,
        positive: true
      });
    } else {
      statusCallback({
        show: true,
        msg: 'Withdrawal Failed',
        positive: false
      });
    }
    setLoading(false);
  }


  return (
      <Modal
          size='tiny'
          onClose={() => setOpen(false)}
          onOpen={() => setOpen(true)}
          open={open}
          closeOnEscape={false}
          closeOnDimmerClick={false}
          trigger={<Icon name='lock open' size='large'/>}
      >
        {
          isLoading ?
              <Dimmer active inverted>
                <Loader size='large'>Confirming transaction... </Loader>
              </Dimmer> : null
        }
        <Modal.Header>Withdraw Funds </Modal.Header>
        <Modal.Content>
          <Header>Are you sure you want to withdraw funds ?</Header>
          <br/>
        </Modal.Content>
        <Modal.Actions>
          <Button negative onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button
              positive
              onClick={withdrawFunds}>
            Withdraw
          </Button>
        </Modal.Actions>
      </Modal>
  )
}
