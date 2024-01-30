import { http, createConfig } from 'wagmi'
import { klaytn, klaytnBaobab } from 'wagmi/chains'

// Create wagmiConfig
export const config = createConfig({
  chains: [ klaytnBaobab ],
  transports: {
    [klaytn.id]: http("https://rpc.ankr.com/klaytn"),
    [klaytnBaobab.id]: http("https://rpc.ankr.com/klaytn_testnet")
  },
})
