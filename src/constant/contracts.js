import { ChainId } from "./web3";

export const MULTICALL_NETWORKS = {
    [ChainId.ETH]: '0xeefBa1e63905eF1D7ACbA5a8513c70307C1cE441',
    [ChainId.ROPSTEN]: '0x53C43764255c17BD724F74c4eF150724AC50a3ed',
    [ChainId.RINKEBY]: '0x42Ad527de7d4e9d9d011aC45B31D8551f8Fe9821',
    [ChainId.FANTOM]: '0x63B8310c5093ac917552931D8b15d5AB6945c0a6',
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


//DEI Contracts
export const ORACLE_ADDRESS = {
    [ChainId.HECO]: "0x0c94362098A5a1F5bA93BaF5B611B9da366E7Df9",
    [ChainId.RINKEBY]: "0x49Dc71aD8947c846D2A0961d2999A0dEB97373C6",
    [ChainId.AVALANCHE]: "0x74864887DbCa456D6709ddeF5e43A42F80455718",
}
export const DEI_ADDRESS = {
    [ChainId.HECO]: "0x2017F04FA02bD74712062286e2C9949F3F75a5B1",
    [ChainId.RINKEBY]: "0xD7049C0aDf21826F415ECcfd7E021fc6a0840a34",
    [ChainId.AVALANCHE]: "0x84A57Ee5D76E0faBFfFa42599A4B324096a51440",
    [ChainId.MATIC]: "0x0E08f54B1334757518330Fab17410b074194e55F",
}

//TODO
export const DEUS_ADDRESS = {
    [ChainId.HECO]: "0x86eD67215aE62a849B5f0c900A7Ed8B9e94945B9",
    [ChainId.RINKEBY]: "0x9Fb1721a9ecb6901b0AA0741a9EcAa1B013AD591",
    [ChainId.AVALANCHE]: "0x33767b9bF00D2b6a1f21f47b4Ef8c3F6F1686346",
    [ChainId.MATIC]: "0x5976D7ABc3d7e057cbFf6e210580fCce994964E8",
}

export const COLLATERAL_ADDRESS = {
    [ChainId.HECO]: "0x7a5a3819EcB1E481D656dAbE4a489644FBcb5844",
    [ChainId.RINKEBY]: "0x6ea88583cd04C4D3fF36d3FB2B25deEf93FC78dD",
    [ChainId.AVALANCHE]: "0x9Ea9F4F8DDeb79f2b8d16EBA1Aff0306f8035919",
    [ChainId.MATIC]: "0x0eF52C70fB995d0334fcBc98F4a3b2e6B1f062F5",
}

export const DEI_POOL_ADDRESS = {
    [ChainId.HECO]: "0xAAb7c66d8857bFdC5d7Ff28290E88711BFb00cC0",
    [ChainId.RINKEBY]: "0xB5703113741A46b58BcBdD09d895bbe8348cBa9D",
    [ChainId.AVALANCHE]: "0xA2fCe691f555e91663A0Afb9b090Ad5f2Cc15eA1",
    [ChainId.MATIC]: "0x5bF303faFc74e872C74F2b9a4b770B6B5eC5E3EC",
}

export const COLLATERAL_POOL_ADDRESS = {
    [ChainId.HECO]: "0x960690BBa6BFB18A5F05bf5399c038156aBa847d",
    [ChainId.RINKEBY]: "0x7A14660d803f455d04e6caF2291269E282b9DF8c",
    [ChainId.AVALANCHE]: "0x6eE1e9A9FAc04365236c16521008943cBA1175A3",
    [ChainId.MATIC]: "0xDFe6Dee587F9FEf00C12948fb37D0f8E37BeC96B",
}

export const PROXY_MINT_ADDRESS = {
    [ChainId.HECO]: "0xd25CF1D484CFE0d6DaeaF890D31AcC40b1DAc5f8",
    [ChainId.AVALANCHE]: "0x591832987934843AAa8e868e713A7d35b9c59c71",
}

