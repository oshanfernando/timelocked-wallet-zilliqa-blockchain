import {VIEWBLOCK_URL} from "./constants";

export const calculateNumBlocks = async (d1) => {
  const { result } = await window.zilPay.blockchain.getTxBlockRate();

  const now = new Date();
  const millis =  d1 - now;
  const seconds = millis / 1000;

  return (Math.ceil(seconds * result))
}

export const getDateFromBlockNum = (blockNum, currentBlockNum, blockRate) => {
  const blockTime = 1 / blockRate;
  const blockDiff = blockNum - currentBlockNum;
  const totalTimeSeconds = blockTime * blockDiff;

  return new Date(new Date().getTime() + totalTimeSeconds*1000).toLocaleString();

}

export const getViewBlockLink = (contAddr) => {
  return `${VIEWBLOCK_URL}${contAddr}?network=testnet`
}

export const pollReceipt = (tranID) => {
  return new Promise((resolve, reject) => {
    let timeout = setInterval(async () => {
      window.zilPay.blockchain
          .getTransaction(tranID)
          .then(tx => {
            console.log('tx receipt', tx);
            clearInterval(timeout);
            resolve(tx);

          })
          .catch(err => console.log(err));
    }, 4000);
  });
}
