import { ChainId } from "./web3";

export const MULTICALL_NETWORKS = {
    [ChainId.ETH]: '0xeefBa1e63905eF1D7ACbA5a8513c70307C1cE441',
    [ChainId.ROPSTEN]: '0x53C43764255c17BD724F74c4eF150724AC50a3ed',
    [ChainId.RINKEBY]: '0x42Ad527de7d4e9d9d011aC45B31D8551f8Fe9821',
    [ChainId.FTM]: '0x63B8310c5093ac917552931D8b15d5AB6945c0a6',
    [ChainId.XDAI]: '0xb5b692a88BDFc81ca69dcB1d924f59f0413A602a',
    [ChainId.BSC]: '0xe348b292e8eA5FAB54340656f3D374b259D658b8',
    [ChainId.BSC_TESTNET]: '0xe348b292e8eA5FAB54340656f3D374b259D658b8',
    [ChainId.HECO]: '0xc9a9F768ebD123A00B52e7A0E590df2e9E998707',
    [ChainId.HECO_TESTNET]: '0x935Bfe9AfaA2Be26049ea4EDE40A3A2243361F87',
    [ChainId.MATIC]: '0x95028E5B8a734bb7E2071F96De89BABe75be9C8E',
    [ChainId.MATIC_TESTNET]: '0x9Fc8e50Eb08C1F463b45d1AFb9c261B0a1903006',
    [ChainId.AVALANCHE]: '0x0FB54156B496b5a040b51A71817aED9e2927912E',
}

export const SEALED_ADDRESS = "0xd8cb412e40447eefc7ddab672f1001c5e039f166"

export const MIGRATOR_ADDRESS = {
    [ChainId.RINKEBY]: "0x30DbC9F20f0F7FFB6CD97f4101b3f89910305A05",
    [ChainId.MATIC]: "0xD6739b3012Dd4179C0Cb45C57e6eADD063983143",
    [ChainId.ETH]: "0xD6739b3012Dd4179C0Cb45C57e6eADD063983143",
}

//START DEI
export const COLLATERAL_ADDRESS = {
    [ChainId.HECO]: "0x7a5a3819EcB1E481D656dAbE4a489644FBcb5844",
    [ChainId.RINKEBY]: "0x52e3462B6961ce623763EE21a20d6BA32899CA9b",
    [ChainId.AVALANCHE]: "0x9Ea9F4F8DDeb79f2b8d16EBA1Aff0306f8035919",
    [ChainId.MATIC]: "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174",
    [ChainId.ETH]: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
}

export const ORACLE_ADDRESS = {
    [ChainId.HECO]: "0x0c94362098A5a1F5bA93BaF5B611B9da366E7Df9",
    [ChainId.RINKEBY]: "0xa2554F60ABb902c27426E84c53e679Edcf80c7F9",
    [ChainId.AVALANCHE]: "0x74864887DbCa456D6709ddeF5e43A42F80455718",
    [ChainId.MATIC]: "0x3967e99B02d86ffc84fb69Fd9a7C136952906201",
    [ChainId.ETH]: '0x3967e99B02d86ffc84fb69Fd9a7C136952906201',
}

export const DEI_ADDRESS = {
    [ChainId.HECO]: "0x2017F04FA02bD74712062286e2C9949F3F75a5B1",
    [ChainId.RINKEBY]: "0xDE14254d2877EbbC573D38eB61fc3fDaC9A8Ea8e",
    [ChainId.AVALANCHE]: "0x84A57Ee5D76E0faBFfFa42599A4B324096a51440",
    [ChainId.MATIC]: "0xDE12c7959E1a72bbe8a5f7A1dc8f8EeF9Ab011B3",
    [ChainId.ETH]: '0xDE12c7959E1a72bbe8a5f7A1dc8f8EeF9Ab011B3',
}

export const DEUS_ADDRESS = {
    [ChainId.HECO]: "0x86eD67215aE62a849B5f0c900A7Ed8B9e94945B9",
    [ChainId.RINKEBY]: "0x20C714b12776744d7F35e2E0F9F4477b1117F017",
    [ChainId.AVALANCHE]: "0x33767b9bF00D2b6a1f21f47b4Ef8c3F6F1686346",
    [ChainId.MATIC]: "0xDE5ed76E7c05eC5e4572CfC88d1ACEA165109E44",
    [ChainId.ETH]: '0xDE5ed76E7c05eC5e4572CfC88d1ACEA165109E44',
}

export const DEI_POOL_ADDRESS = { // DEI Pool library
    [ChainId.HECO]: "0xAAb7c66d8857bFdC5d7Ff28290E88711BFb00cC0",
    [ChainId.RINKEBY]: "0x5dB942E60E0d38D9bD033bEC2dA83EA132C808E2",
    [ChainId.AVALANCHE]: "0xA2fCe691f555e91663A0Afb9b090Ad5f2Cc15eA1",
    [ChainId.MATIC]: "0xc63eAf6BC162531b153Dfc61F225E62d2edB4488",
    [ChainId.ETH]: '0xc63eAf6BC162531b153Dfc61F225E62d2edB4488',
}

export const COLLATERAL_POOL_ADDRESS = {
    [ChainId.HECO]: "0x960690BBa6BFB18A5F05bf5399c038156aBa847d",
    [ChainId.RINKEBY]: "0x5dB942E60E0d38D9bD033bEC2dA83EA132C808E2",
    [ChainId.AVALANCHE]: "0x6eE1e9A9FAc04365236c16521008943cBA1175A3",
    [ChainId.MATIC]: "0xa0F395aD5df1Fceb319e162CCf1Ef6645dE8508f",
    [ChainId.ETH]: '0xa0F395aD5df1Fceb319e162CCf1Ef6645dE8508f',
}

export const PROXY_MINT_ADDRESS = {
    [ChainId.HECO]: "0xd25CF1D484CFE0d6DaeaF890D31AcC40b1DAc5f8",
    [ChainId.RINKEBY]: "0x24440A076e1363B62b00463A447Fcc7AE1ee9999",
    [ChainId.AVALANCHE]: "0x591832987934843AAa8e868e713A7d35b9c59c71",
    [ChainId.MATIC]: "0xd8e79FeC03dd3ca0dCF4d7525d2dC438E8Fc0606",
    [ChainId.ETH]: '',
}
export const NEW_PROXY_MINT_ADDRESS = {
    [ChainId.MATIC]: "0x8E17742983CBa809bc554868D8a69A37e3a8a207",
    [ChainId.ETH]: '0xB095aA0A0A206ed943FAA7f5BD28A47Aaf2fEc09',
}

export const DEUS_SWAP_ADDRESS = {
    [ChainId.ETH]: '0x45558df54A0CD8dF50134E8675DB1A39815E7768',
    [ChainId.MATIC]: "0xEa798f9c3eDD2A66ec036Ec754BB4561074DaCA2",
}

//Staking
export const DEI_DEUS_LP = {
    [ChainId.HECO]: "0xd0B9d3A52fa1dAee082F9ac998b9fB49F6bb7a16",
    [ChainId.RINKEBY]: "0xAc439EB3F654B65e1d878BFD026C7bFa9Df97059",
    [ChainId.AVALANCHE]: "0x6c3de04c121D6754bbb963F183ab31734e6a0e9b",
    [ChainId.MATIC]: "0x2Bc3ce6D7cfc0B476E60aDaA1B27DE76DB95EE4e",
    [ChainId.ETH]: '0xd6dd359B8C9d18CCB3FE8627060F88D1776d2993',
}

export const DEI_COLLATERAL_LP = {
    [ChainId.MATIC]: "0xD4F9134ba896FB6901CD6A5EA4EEB683eb1c15c6",
    [ChainId.ETH]: '0x6870F9b4DD5d34C7FC53D0d85D9dBd1aAB339BF7',
}

export const DEUS_NATIVE_LP = {
    [ChainId.MATIC]: "0x6152943b506211ce1FA872702a1b0bc594Cfa2d2",
    [ChainId.ETH]: '0x367E2D443988E4b222FBFdAFDb35eeB7ddA9FBB7',
}

export const DEUS_NATIVE_STAKING = {
    [ChainId.MATIC]: "0x4C48f1421F62d923d9130834135FB4A58E2F4298",
    [ChainId.ETH]: '0x4C48f1421F62d923d9130834135FB4A58E2F4298',
}

export const DEI_DEUS_STAKING = {
    [ChainId.MATIC]: "0x4e5D8794f08F2792DC51016d0a4b9A205cAFc63A",
    [ChainId.ETH]: '0x4e5D8794f08F2792DC51016d0a4b9A205cAFc63A',
}

export const DEI_COLLATERAL_STAKING = {
    [ChainId.MATIC]: "0xa78Ea447ce5AA4669A5f0cD8D27bF5883E1Bf20f",
    [ChainId.ETH]: '0xa78Ea447ce5AA4669A5f0cD8D27bF5883E1Bf20f',
}

export const DEI_COLLATERAL_ZAP = {
  [ChainId.ETH]: '',
  [ChainId.MATIC]: "0x61516fcA37dCd42434B7C198ADA3E94fBDDFd228",
}

export const DEI_DEUS_ZAP = {
    [ChainId.HECO]: "0xd25CF1D484CFE0d6DaeaF890D31AcC40b1DAc5f8",
    [ChainId.RINKEBY]: "0x2D6b0130775EE72bAF3e59cc7A82a2CF479a8D8f",
    [ChainId.AVALANCHE]: "0x591832987934843AAa8e868e713A7d35b9c59c71",
    [ChainId.MATIC]: "0x6c7D6D5142bB40bb5482c2A63B976dBA51b387b4",
    [ChainId.ETH]: '0x38C89aE559cc0A2a81aa40D173919Aaa79Dc0bD9',
}

export const DEUS_NATIVE_ZAP = {
  [ChainId.HECO]: "0xd25CF1D484CFE0d6DaeaF890D31AcC40b1DAc5f8",
  [ChainId.RINKEBY]: "0x2D6b0130775EE72bAF3e59cc7A82a2CF479a8D8f",
  [ChainId.AVALANCHE]: "0x591832987934843AAa8e868e713A7d35b9c59c71",
  [ChainId.MATIC]: "0x6c7D6D5142bB40bb5482c2A63B976dBA51b387b5",
  [ChainId.ETH]: '0x38C89aE559cc0A2a81aa40D173919Aaa79Dc0bD8',
}

export const MINT_PATH = {
    [ChainId.MATIC]: {
        DEUS: [DEUS_ADDRESS[ChainId.MATIC], DEI_ADDRESS[ChainId.MATIC]],
        DEI: [DEI_ADDRESS[ChainId.MATIC], COLLATERAL_ADDRESS[ChainId.MATIC]],
        WETH: ["0x7ceb23fd6bc0add59e62ac25578270cff1b9f619", COLLATERAL_ADDRESS[ChainId.MATIC]],
        USDC: [COLLATERAL_ADDRESS[ChainId.MATIC]],
        MATIC: ["0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270", "0x7ceb23fd6bc0add59e62ac25578270cff1b9f619", COLLATERAL_ADDRESS[ChainId.MATIC]]
    },
    [ChainId.RINKEBY]: {
        DEUS: [DEUS_ADDRESS[ChainId.RINKEBY], DEI_ADDRESS[ChainId.RINKEBY]],
        ETH: ["0xc778417e063141139fce010982780140aa0cd5ab", COLLATERAL_ADDRESS[ChainId.RINKEBY]],
        USDC: [COLLATERAL_ADDRESS[ChainId.RINKEBY]],
        HUSD: ["0x8313949568A16b2Cc786Af26F363071777Af4b8b", COLLATERAL_ADDRESS[ChainId.RINKEBY]],
        DEI: [DEI_ADDRESS[ChainId.RINKEBY], COLLATERAL_ADDRESS[ChainId.RINKEBY]],
    },
    [ChainId.ETH]: {
        DEUS: [DEUS_ADDRESS[ChainId.ETH], DEI_ADDRESS[ChainId.ETH]],
        ETH: ["0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2", COLLATERAL_ADDRESS[ChainId.ETH]],
        USDC: [COLLATERAL_ADDRESS[ChainId.ETH]],
        DAI: ["0x6B175474E89094C44Da98b954EedeAC495271d0F", COLLATERAL_ADDRESS[ChainId.ETH]],
        DEI: [DEI_ADDRESS[ChainId.ETH], COLLATERAL_ADDRESS[ChainId.ETH]],
        wBTC: ["0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599", "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2", COLLATERAL_ADDRESS[ChainId.ETH]],
    },
}
//END DEI
