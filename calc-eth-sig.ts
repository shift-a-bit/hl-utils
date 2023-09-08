async function calcEthSig(plaintext) {
    let signature = await sign(plaintext, keyId);
    if (signature.Signature == undefined) {
        throw new Error('Signature is undefined.');
    }
    console.log("encoded sig: " + signature.Signature.toString('hex'));

    let decoded = EcdsaSigAsnParse.decode(signature.Signature, 'der');
    let r : BN = decoded.r;
    let s : BN = decoded.s;
    console.log("r: " + r.toString(10));
    console.log("s: " + s.toString(10));

    let tempsig = r.toString(16) + s.toString(16);

    let secp256k1N = new BN("fffffffffffffffffffffffffffffffebaaedce6af48a03bbfd25e8cd0364141", 16); // max value on the curve
    let secp256k1halfN = secp256k1N.div(new BN(2)); // half of the curve
    // Because of EIP-2 not all elliptic curve signatures are accepted
    // the value of s needs to be SMALLER than half of the curve
    // i.e. we need to flip s if it's greater than half of the curve
    if (s.gt(secp256k1halfN)) {
        console.log("s is on the wrong side of the curve... flipping - tempsig: " + tempsig + " length: " + tempsig.length);
        // According to EIP2 https://github.com/ethereum/EIPs/blob/master/EIPS/eip-2.md
        // if s < half the curve we need to invert it 
        // s = curve.n - s
        s = secp256k1N.sub(s);
        console.log("new s: " + s.toString(10));
        return { r, s }
    }
    // if s is less than half of the curve, we're on the "good" side of the curve, we can just return
    return { r, s }
}
