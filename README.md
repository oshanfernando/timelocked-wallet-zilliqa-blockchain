# Time-Locked wallets on Zilliqa Blockchain

This project is an example of a time-locked wallet implementation using Scilla smart contracts on [Zilliqa](https://www.zilliqa.com/) blockchain.

The idea behind time-locked wallets is to lock the funds for a set period of time. The amount locked in the wallet can only withdrawn when the set date is passed and only by the authorized person/beneficiary.


* The dApp allows users to create a time-locked wallet for a specific beneficiary, top up the wallet and change the unlock date as well. 

* Once the wallet is created, only the intended beneficiary is allowed access to the funds after the set unlock date has passed.

<br>

Checkout the [Medium article](https://medium.com/@oshan.fernando/building-a-time-locked-wallet-on-zilliqa-blockchain-part-1-400f5e253b05) for detailed explanation. 

<br>

## Prerequisites

* [ZilPay](https://zilpay.io/) wallet extension has to be installed
* A TestNet wallet has to be created
* The wallet should have some TestNet ZIL to pay for gas and to top-up the wallet. If you do not have TestNet ZIL, go to [this](https://dev-wallet.zilliqa.com/faucet) link and run the faucet to get some free ZIL

<br>

## Running the application


1. Deploy the [TimeLockedWalletsStore.scilla](/TimeLockedWalletsStore.scilla) to the Testnet using your wallet.


2. In the [constants.js](/src/constants.js) file, change the **WALLETSTORE_CONTRACT_ADDR** to the address of your deployed smart contract.

<br>

> You could also skip step 1 and 2 and test the project on Testnet as it is. The contract address at **WALLETSTORE_CONTRACT_ADDR** in the code is a valid contract address.

<br>

3. Install the dependencies

```
npm install
```

4. Start the development server

```
npm start
```

## Demo

Website: https://timelocked-wallet-zilliqa-blockchain.vercel.app/

Walkthrough video:

  <a href="https://www.youtube.com/watch?v=5m5asIZn2ec" target="_blank">
    <img src="https://img.youtube.com/vi/5m5asIZn2ec/0.jpg" alt="Watch the video" width="480" height="360" border="10" />
  </a>




