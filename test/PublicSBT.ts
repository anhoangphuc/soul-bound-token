import { ethers } from "hardhat";
import { PublicSbt } from "../typechain-types"
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import { expect } from 'chai';

context('PublicSBT', async () => {
    let publicSBT: PublicSbt;
    const age = 20;
    let admin: SignerWithAddress, account1: SignerWithAddress, account2: SignerWithAddress;

    beforeEach(async () => {
        [admin, account1, account2] = await ethers.getSigners();
        const PublicSbtContract = await ethers.getContractFactory("PublicSbt");
        publicSBT = await PublicSbtContract.deploy();
        await publicSBT.deployed();

        await publicSBT.connect(admin).mint(account1.address, 20);
    })

    it(`Verify account1`, async () => {
        const ageInfo = await publicSBT.sbts(account1.address);
        expect(ageInfo.age >= 18);
    });

    it(`Transfer is reverted`, async () => {
        await expect(publicSBT.connect(account1).transferFrom(account1.address, account2.address, 0))
        .to.be.revertedWithCustomError(publicSBT, "TransferNotAllowed");
    })
})