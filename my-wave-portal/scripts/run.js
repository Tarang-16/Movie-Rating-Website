const main = async () => {
  //const [owner, randomPerson] = await hre.ethers.getSigners(); //here I grabbed the wallet address of contract owner and I also grabbed a random wallet address and called it randomPerson.
  const waveContractFactory = await hre.ethers.getContractFactory("WavePortal"); //This will actually compile our contract and generate the necessary files we need to work with our contract under the artifacts directory.
  const waveContract = await waveContractFactory.deploy({
    value: hre.ethers.utils.parseEther("0.01"),
  }); //Hardhat will create a local Ethereum network for us, but just for this contract. Then, after the script completes it'll destroy that local network. So, every time you run the contract, it'll be a fresh blockchain.
  await waveContract.deployed(); //We'll wait until our contract is officially deployed to our local blockchain!
  await waveContract.deployTransaction.wait(6);

  console.log("Contract deployed to:", waveContract.address);
  //console.log("Contract deployed by:", owner.address);

  let contractBalance = await hre.ethers.provider.getBalance(
    waveContract.address
  );
  console.log(
    "Contract Balance: ",
    hre.ethers.utils.formatEther(contractBalance)
  );

  let waveCount;
  waveCount = await waveContract.getTotalWaves();
  console.log(waveCount.toNumber());

  let waveTxn = await waveContract.wave("A message!");
  await waveTxn.wait();

  contractBalance = await hre.ethers.provider.getBalance(waveContract.address);
  console.log(
    "Contract balance:",
    hre.ethers.utils.formatEther(contractBalance)
  );

  let allWaves = await waveContract.getAllWaves();
  console.log(allWaves);

  const [_, randomPerson] = await hre.ethers.getSigners();
  waveTxn = await waveContract
    .connect(randomPerson)
    .wave("Another message!", { gasLimit: 300000 });
  await waveTxn.wait();
};

const runmain = async () => {
  try {
    await main();
    process.exit(0);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

runmain();
