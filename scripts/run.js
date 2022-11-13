const main = async () => {

    const [owner, otherPerson] = await hre.ethers.getSigners();

    const waveContractFactory = await hre.ethers.getContractFactory("WavePortal");
    const waveContract = await waveContractFactory.deploy({
        value: hre.ethers.utils.parseEther("0.1"),
      });
    await waveContract.deployed();
    
    console.log("Contract deployed to : ", waveContract.address);
    console.log("Contract deployed by : ", owner.address);

    //Balance before
    let contractBalance = await hre.ethers.provider.getBalance(waveContract.address);
    console.log("Contract balance:", hre.ethers.utils.formatEther(contractBalance));

    let ownerBalance = await hre.ethers.provider.getBalance(owner.address);
    console.log("Owner balance:", hre.ethers.utils.formatEther(ownerBalance));
    
    let waveCount = await waveContract.getTotalWaves();

    // Wave
    let waveTxn;
    waveTxn = await waveContract.wave("This is a msg!");
    await waveTxn.wait();

    waveTxn =  await waveContract.wave("This is another msg");
    await waveTxn.wait();

    //Check balance after calling wave
    contractBalance = await hre.ethers.provider.getBalance(waveContract.address);
    console.log("Contract balance:", hre.ethers.utils.formatEther(contractBalance));

    ownerBalance = await hre.ethers.provider.getBalance(owner.address);
    console.log("Owner balance:", hre.ethers.utils.formatEther(ownerBalance));



    let allWaves = await waveContract.getAllWaves();
    console.log("all waves : ", allWaves);

    waveCount = waveContract.getTotalWaves();
};

const runMain = async() => {
    try {
        await main();
        process.exit(0);
    }
    catch(error){
        console.log(error);
        process.exit(1);
    }
};

runMain();