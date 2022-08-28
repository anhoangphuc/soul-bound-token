import { ethers } from "hardhat";
import {BytesLike} from "ethers";
import EthCrypto from 'eth-crypto';

export async function encryptAMessage(publicKey: string, secret: number) {
    const encrypted = await EthCrypto.encryptWithPublicKey(
        publicKey,
        JSON.stringify(secret)
    );
    return EthCrypto.cipher.stringify(encrypted);
}

export async function decryptMessage(privateKey: string, encrypted: string) {
    const encryptedObject = EthCrypto.cipher.parse(encrypted);
    const decrypted = await EthCrypto.decryptWithPrivateKey(privateKey, encryptedObject);
    const decryptedPayload = JSON.parse(decrypted);
    return decryptedPayload;
}

(async function main() {
    const account1 = await ethers.Wallet.createRandom();
    const x = await encryptAMessage(account1.publicKey.substring(2,), 100);
    console.log(x);

    const decryptedX = await decryptMessage(account1.privateKey, x);
    console.log(decryptedX);
})