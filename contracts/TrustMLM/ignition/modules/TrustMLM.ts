import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const TrustMLM = buildModule("TrustMLM", (m) => {
  const usdcAddress = "0x754288077d0ff82af7a5317c7cb8c444d421d103"; // Example oUSDC (https://klaytnscope.com/token/0x754288077d0ff82af7a5317c7cb8c444d421d103)
  const defaultUpline = "0x0fFee57EAA1026857E381BC51B6832735006fc6a"; // Example Default Upline (Platform Address)
  const trustMLM = m.contract("TrustMLM", [usdcAddress, defaultUpline]);

  return { trustMLM };
});

export default TrustMLM;
