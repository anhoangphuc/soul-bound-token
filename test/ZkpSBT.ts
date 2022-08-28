import { ethers } from "hardhat";
import { AnonymousSbt } from "../typechain-types"
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import { expect } from 'chai';
import { Wallet, utils } from 'ethers';
import { encryptAMessage, decryptMessage, hashIteration } from './utils';

context('ZKP', async () => {
    let anonymousSBT: AnonymousSbt;
    const age = 20;
    let admin: SignerWithAddress;
    let account1: Wallet;

    beforeEach(async () => {
        [admin] = await ethers.getSigners();
        const AnonymousSbtContract = await ethers.getContractFactory("AnonymousSbt");
        anonymousSBT = await AnonymousSbtContract.deploy();
        await anonymousSBT.deployed();
        account1 = Wallet.createRandom();
    })

    it(`Mint a new SBT`, async () => {
        const age = 20;
        const secret = Math.trunc(Math.random() * 1e9);
        const encryptedSecret = encryptAMessage(account1.publicKey.substring(2), secret);
        const commitment = hashIteration(`${secret}`, age);
        await anonymousSBT.connect(admin).mint(account1.address, encryptedSecret, commitment);
        const balance = await anonymousSBT.balanceOf(account1.address);
        expect(balance).to.be.equal(1);
    })

    it(`Verify account1`, async () => {
        const ageInfo = await anonymousSBT.sbts(account1.address);
        const secret = decryptMessage(account1.privateKey, ageInfo.secret);
        const userProof = hashIteration(`${secret}`, age - 18);
        const computeProof = hashIteration(userProof, 18);
        expect((computeProof === ageInfo.commitment));
    });
})