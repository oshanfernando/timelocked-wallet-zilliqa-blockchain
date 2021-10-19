import React, {useContext} from 'react'
import {Button, Dimmer, Form, Loader, Modal} from 'semantic-ui-react'
import {BN, normaliseAddress, Long, units} from "@zilliqa-js/zilliqa";
import {calculateNumBlocks, pollReceipt} from "../helpers";
import {AppContext} from "../context/UserContext";
import {scillaContractCode, WALLETSTORE_CONTRACT_ADDR} from "../constants";

export default function CreateWallet({statusCallback}) {

  const [open, setOpen] = React.useState(false);
  const [isLoading, setLoading] = React.useState(false);
  const [beneficiary, setBeneficiary] = React.useState();
  const [addressErrors, setAddressErrors] = React.useState();
  const [numBlocks, setNumBlocks] = React.useState();

  const ctx = useContext(AppContext);
  const [currentAddress] = ctx.address;

  const onDateChange = async (e) => {
    const d1 = new Date(e.target.value);
    const blocks = await calculateNumBlocks(d1);
    setNumBlocks(blocks);
  }

  const onBeneficiaryChange = (e) => {
    setBeneficiary(e.target.value)
    try {
      normaliseAddress(e.target.value)
      setAddressErrors(null)
    } catch (error) {
      setAddressErrors('Invalid Address Type')
    }

  }

  const updateWalletStore = async (createdContractAddr) => {

    if (createdContractAddr) {
      setLoading(true);
      const zilliqa = window.zilPay;
      const walletStoreContract = zilliqa.contracts.at(WALLETSTORE_CONTRACT_ADDR);

      const gasPrice = units.toQa('2000', units.Units.Li);
      const amount = new BN(0);
      const gasLimit = Long.fromNumber(8000);

      const contractCall = await walletStoreContract.call(
          'AddNewWallet',
          [
            {
              vname: 'contract_addr',
              type: 'ByStr20',
              value: createdContractAddr,
            },
            {
              vname: 'beneficiary',
              type: 'ByStr20',
              value: normaliseAddress(beneficiary),
            }
          ],
          {
            amount,
            gasPrice,
            gasLimit
          }
      );

      return contractCall.TranID;
    }
  }

  const deployContract = async () => {

    const init = [
      {
        vname: '_scilla_version',
        type: 'Uint32',
        value: '0'
      },
      {
        vname: 'owner',
        type: 'ByStr20',
        value: currentAddress.bech32
      },
      {
        vname: 'beneficiary',
        type: 'ByStr20',
        value: beneficiary
      },
      {
        vname: 'num_blocks',
        type: 'Uint32',
        value: numBlocks.toString()
      }
    ]

    setLoading(true);
    const zilliqa = window.zilPay;
    const contract = zilliqa.contracts.new(scillaContractCode, init)

    const contractCall = await contract.deploy({
      gasLimit: '25000',
      gasPrice: '1000000000'
    }, true);

    console.log(`Deploy contract response:`, contractCall);
    const [tx, ct] = contractCall;

    console.log('created contract address', ct.address);
    return {ctAddress: ct.address, tranID: tx.TranID};
  }

  const createWallet = async () => {
    if (numBlocks > 0 && beneficiary && !addressErrors) {
      console.log('***** Deploying Contract *****');
      setLoading(true)
      const createdContract = await deployContract();
      const receipt = await pollReceipt(createdContract.tranID);
      if (receipt.success) {
        console.log('***** Updating wallet store *****');
        const transID = await updateWalletStore(createdContract.ctAddress);
        const updateStoreReceipt = await pollReceipt(transID);

        if (updateStoreReceipt.success) {
          statusCallback({
            show: true,
            msg: 'Successfully created new wallet',
            positive: true });
        } else {
          statusCallback({
            show: true,
            msg: 'Failed to create new wallet!!',
            positive: false });
        }
      } else {
        statusCallback({
          show: true,
          msg: 'Failed to deploy new contract!!',
          positive: false });
      }
      setLoading(false);
    }

  }

  return (
      <Modal
          size="tiny"
          onClose={() => setOpen(false)}
          onOpen={() => setOpen(true)}
          open={open}
          closeOnEscape={false}
          closeOnDimmerClick={false}
          trigger={
            <Button floated='right' icon>
              Create New Wallet
            </Button>}
      >
        {
          isLoading ?
              <Dimmer active inverted>
                <Loader size='large'>Confirming transaction... </Loader>
              </Dimmer> : null
        }
        <Modal.Header>Create Wallet</Modal.Header>
        <Modal.Content>
          <Form>
            <Form.Input
                fluid
                label='Beneficiary'
                id='form-input-beneficiary'
                error={addressErrors}
                onChange={onBeneficiaryChange}
            />
            <Form.Field>
              <label>Unlock Date</label>
              <input type='datetime-local' onChange={onDateChange}/>
            </Form.Field>

          </Form>
        </Modal.Content>
        <Modal.Actions>
          <Button color='red' onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button
              content="Create Wallet"
              labelPosition='right'
              icon='checkmark'
              onClick={createWallet}
              positive
              disabled={!(numBlocks && beneficiary)}
          />
        </Modal.Actions>
      </Modal>
  )
}
