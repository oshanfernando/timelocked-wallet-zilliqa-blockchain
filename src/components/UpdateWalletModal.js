import React from 'react'
import {Button, Modal, Icon, Form, Header, Dimmer, Loader} from 'semantic-ui-react'
import {calculateNumBlocks, pollReceipt} from "../helpers";
import {Long, toBech32Address, units, BN} from "@zilliqa-js/zilliqa";

export default function UpdateWalletModal({contractAddr, statusCallback}) {
  const [open, setOpen] = React.useState(false);
  const [isLoading, setLoading] = React.useState(false);
  const [numBlocks, setNumBlocks] = React.useState();

  const onDateChange = async (e) => {
    const d1 = new Date(e.target.value);
    const blocks = await calculateNumBlocks(d1);
    setNumBlocks(blocks);
  }

  const updateWallet = async () => {
    if(numBlocks > 0) {
      setLoading(true);
      const zilliqa = window.zilPay;
      const walletStoreContract = zilliqa.contracts.at(contractAddr);


      const gasPrice = units.toQa('2000', units.Units.Li);
      const amount = new BN(0);
      const gasLimit = Long.fromNumber(8000);

      const contractCall = await walletStoreContract.call(
          'ChangeTargetBlock',
          [{
            vname: 'new_num_blocks',
            type: 'Uint32',
            value: numBlocks.toString()
          }],
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
          msg: `You have successfully updated the Unlock Date`,
          positive: true });
      } else {
        statusCallback({
          show: true,
          msg: 'Update failed!!',
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
          trigger={<Icon style={{marginLeft: '10px'}} title="Update Unlock Date" name='edit' size='large'/>}
      >
        {
          isLoading ?
              <Dimmer active inverted>
                <Loader size='large'>Confirming transaction... </Loader>
              </Dimmer> : null
        }

        <Modal.Header>Update unlock Date</Modal.Header>
        <Modal.Content>
          <Header>Update unlock Date of {toBech32Address(contractAddr)}</Header>
          <br/>
          <Form>
            <Form.Field>
              <label>Unlock Date</label>
              <input type='datetime-local' onChange={onDateChange}/>
            </Form.Field>
          </Form>
        </Modal.Content>
        <Modal.Actions>
          <Button negative onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button positive onClick={updateWallet}>
            Yes
          </Button>
        </Modal.Actions>
      </Modal>
  )
}
