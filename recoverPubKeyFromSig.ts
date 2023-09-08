function recoverPubKeyFromSig(sig: Buffer, r : BN, s : BN, v: number) {
    console.log("Recovering public key with sig " + sig.toString('hex') + " r: " + r.toString(16) + " s: " + s.toString(16));
    let rBuffer = r.toBuffer();
    let sBuffer = s.toBuffer();
    let pubKey = ethutil.ecrecover(sig, v, rBuffer, sBuffer);
    let addrBuf = ethutil.pubToAddress(pubKey);
    var RecoveredEthAddr = ethutil.bufferToHex(addrBuf);
    console.log( "Recovered ethereum address: " +  RecoveredEthAddr);
    return RecoveredEthAddr;
}
