const HDWalletProvider = require("@truffle/hdwallet-provider");
const mnemonic =
  "zone property silk grace quiz zero fiction cheap duty piano seat edge";

module.exports = {
  networks: {
    development: { host: "127.0.0.1", port: 7545, network_id: 5777 },
    rinkeby: {
      provider: () =>
        new HDWalletProvider(
          mnemonic,
          `https://rinkeby.infura.io/v3/dbb2298855e3436fb8ee3b408fc46f1b`
        ),
      network_id: 4, // Ropsten's id
      gas: 5500000, // Ropsten has a lower block limit than mainnet
      confirmations: 2, // # of confs to wait between deployments. (default: 0)
      timeoutBlocks: 200, // # of blocks before a deployment times out  (minimum/default: 50)
      skipDryRun: true, // Skip dry run before migrations? (default: false for public nets )
    },
  },

  mocha: {},

  // Configure your compilers
  compilers: {
    solc: {
      version: "0.8.14",
    },
  },
};
