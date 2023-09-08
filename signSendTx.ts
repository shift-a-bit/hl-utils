const web3 = new Web3(new Web3.providers.HttpProvider("https://kovan.infura.io/v3/<your key>"));

let pubKey = await getPublicKey(keyId);
let ethAddr = getEthereumAddress((pubKey.PublicKey as Buffer));
let ethAddrHash = ethutil.keccak(Buffer.from(ethAddr));

// signing the 1st time
// we're signing the hash of our ethereum address
let sig = await findEthereumSig(ethAddrHash);
let recoveredPubAddr = findRightKey(ethAddrHash, sig.r, sig.s, ethAddr);

const txParams: TxData = {
    nonce: await web3.eth.getTransactionCount(ethAddr),
    gasPrice: '0x0918400000',
    gasLimit: 160000,
    to: '0x0000000000000000000000000000000000000000',
    value: '0x00',
    data: '0x00',
    r: sig.r.toBuffer(),
    s: sig.s.toBuffer(),
    v : recoveredPubAddr.v
}

let tx = new Transaction(txParams, { chain: 'kovan', });

// signing the 2nd time
// this time we're signing the hash of the actual transaction
// tx.hash calculates the hash
// false indicates that we do not want the hash function to take the signature into account
let txHash = tx.hash(false); 
sig = await findEthereumSig(txHash); // this returns r and s
recoveredPubAddr = findRightKey(txHash, sig.r, sig.s, ethAddr); // this finds the right v
tx.r = sig.r.toBuffer();
tx.s = sig.s.toBuffer();
tx.v = new BN(recoveredPubAddr.v).toBuffer();
console.log(txParams);
console.log("Sender Address: 0x" + tx.getSenderAddress().toString('hex'));

// Send signed tx to ethereum network 
const serializedTx = tx.serialize().toString('hex');    
web3.eth.sendSignedTransaction('0x' + serializedTx)
.on('confirmation', (confirmationNumber : number, receipt : TransactionReceipt) => {})
.on('receipt', (txReceipt : TransactionReceipt) => { 
    console.log("signAndSendTx txReceipt. Tx Address: " + txReceipt.transactionHash);
})  
.on('error', error => console.log(error));
