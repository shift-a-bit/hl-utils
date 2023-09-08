function getEthereumAddress(publicKey: Buffer): string {
    console.log("Encoded Pub Key: " + publicKey.toString('hex'));

    // The public key is ASN1 encoded in a format according to 
    // https://tools.ietf.org/html/rfc5480#section-2
    // I used https://lapo.it/asn1js to figure out how to parse this 
    // and defined the schema in the EcdsaPubKey object
    let res = EcdsaPubKey.decode(publicKey, 'der');
    let pubKeyBuffer : Buffer = res.pubKey.data;
    console.log("Pub Key Buffer: " + pubKeyBuffer.toString('hex'));

    // The public key starts with a 0x04 prefix that needs to be removed
    // more info: https://www.oreilly.com/library/view/mastering-ethereum/9781491971932/ch04.html
    pubKeyBuffer = pubKeyBuffer.slice(1, pubKeyBuffer.length);

    const address = keccak256(pubKeyBuffer) // keccak256 hash of publicKey  
    const buf2 = Buffer.from(address, 'hex');
    const EthAddr = "0x" + buf2.slice(-20).toString('hex'); // take last 20 bytes as ethereum adress
    console.log("Generated Ethreum address: " + EthAddr);
    return EthAddr;
}
