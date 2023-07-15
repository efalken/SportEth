advanceTime = (time) => {
    return ethers.provider.send("evm_increaseTime", [time]);
}

advanceBlock = () => {
    return ethers.provider.send("evm_mine");
}

takeSnapshot = () => {
    return ethers.provider.send("evm_snapshot");
}

revertToSnapShot = (id) => {
    return ethers.provider.send("evm_revert", [id]);
}

advanceTimeAndBlock = async (time) => {
    await advanceTime(time)
    await advanceBlock()
    return ethers.provider.getBlock('latest');
}

module.exports = {
    advanceTime,
    advanceBlock,
    advanceTimeAndBlock,
    takeSnapshot,
    revertToSnapShot
}