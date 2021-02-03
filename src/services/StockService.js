import Web3 from 'web3'
import addrs from './addresses.json'
import { stocksABI, stakingABI, tokenABI } from '../utils/abis';
import JSBI from 'jsbi';
export class StockService {

    constructor(account, chainId) {
        this.account = account;
        this.chainId = chainId;
        if (!chainId) {
            this.chainId = 1
        }
        this.marketMaker = "0x15e343d8Cebb2d9b17Feb7271bB26e127aa2E537";
        this.timeTokenAddress = '0x23459b0026Ed1cAE0b6da5E9364aCec07469Ffcd';
        this.timeStakingAddress = '0x982C54303622347fB3724Ee757cCF6ACc553A5f8';

    }

    makeProvider = () => {
        if (this.INFURA_URL) return
        this.INFURA_URL = 'wss://' + this.getNetworkName().toLowerCase() + '.infura.io/ws/v3/cf6ea736e00b4ee4bc43dfdb68f51093';
        this.infuraWeb3 = new Web3(new Web3.providers.WebsocketProvider(this.INFURA_URL));

    }

    setWallet(account, chainId) {
        this.account = account
        if (!chainId) return

        const currChain = chainId ? chainId : 4
        if (this.chainId !== currChain) {
            // this.INFURA_URL = 'wss://' + this.getNetworkName().toLowerCase() + '.infura.io/ws/v3/cf6ea736e00b4ee4bc43dfdb68f51093';
            // this.infuraWeb3 = new Web3(new Web3.providers.WebsocketProvider(this.INFURA_URL));
            // this.chainId = chainId;
        }
    }

    TokensMaxDigit = {
        wbtc: 8,
        usdt: 6,
        usdc: 6,
        coinbase: 18,
        dea: 18,
        deus: 18,
        dai: 18,
        eth: 18,
    }

    networkNames = {
        1: "Mainnet",
        3: "Ropsten",
        4: "Rinkeby",
        42: "Kovan",
    }

    _getWei(number, token = "eth") {
        let max = this.TokensMaxDigit[token] ? this.TokensMaxDigit[token] : 18
        // let value = typeof number === "string" ? parseFloat(number).toFixed(18) : number.toFixed(18)
        let ans = Web3.utils.toWei(String(number), 'ether');
        ans = ans.substr(0, ans.length - (18 - max));
        return ans.toString()
    }

    checkWallet = () => this.account && this.chainId

    getNetworkName = () => this.networkNames[this.chainId.toString()]

    getAddr = (tokenName) => addrs[tokenName][this.chainId.toString()]

    getTokenAddr = (tokenName) => addrs["token"][tokenName][this.chainId.toString()]

    // conduct = (token, listener) => {

    //     if (!this.checkWallet()) return 0

    //     const metamaskWeb3 = new Web3(Web3.givenProvider);
    //     const conductorContract = new metamaskWeb3.eth.Contract(conductorABI, '0x905719b8303350f4528158042C6A0032Ff24c429');
    //     return conductorContract.methods.conduct(
    //         token.symbol, token.short_name, token.short_symbol, token.long_name, token.long_symbol, token.sign_for_conduct.v, token.sign_for_conduct.r, token.sign_for_conduct.s
    //     )
    //         .send({ from: this.account })
    //         .once('transactionHash', () => listener("transactionHash"))
    //         .once('receipt', () => listener("receipt"))
    //         .once('error', () => listener("error"));
    // }

    getAllowances = (tokenAddress, account, spender = this.marketMaker) => {
        this.makeProvider()

        if (!account) return

        if (tokenAddress !== "0x6B175474E89094C44Da98b954EedeAC495271d0F") {
            return 1000000000000000
        }

        const TokenContract = new this.infuraWeb3.eth.Contract(tokenABI, tokenAddress)
        return TokenContract.methods.allowance(account, spender).call().then(balance => {
            return Web3.utils.fromWei(balance, 'ether');
        })
    }

    approve = (tokenAddress, amount, listener) => {
        if (!this.checkWallet()) return 0

        console.log(tokenAddress, amount);
        amount = Math.max(amount, 10 ** 20);

        const metamaskWeb3 = new Web3(Web3.givenProvider);
        const tokenContract = new metamaskWeb3.eth.Contract(tokenABI, tokenAddress);
        return tokenContract.methods.approve(this.marketMaker, this._getWei(amount))
            .send({ from: this.account })
            .on('transactionHash', () => listener("transactionHash"))
            .once('receipt', () => listener("receipt"))
            .on('error', () => listener("error"));
    }

    getTokenBalance = (tokenAddress, account) => {
        this.makeProvider()
        if (!account) return
        const TokenContract = new this.infuraWeb3.eth.Contract(tokenABI, tokenAddress)
        return TokenContract.methods.balanceOf(account).call().then(balance => {
            return Web3.utils.fromWei(balance, 'ether');
        })
    }

    buy = (address, amount, info, listener) => {
        if (!this.checkWallet()) return 0
        // var BN = Web3.utils.BN;
        // console.log("before", amount);
        // amount = new BN(amount).toString()
        // console.log("after", amount);
        const metamaskWeb3 = new Web3(Web3.givenProvider);
        const marketMakerContract = new metamaskWeb3.eth.Contract(stocksABI, this.marketMaker);

        console.log(address, this._getWei(amount), info.blockNo);
        console.log(info["signs"][0].v, info["signs"][0].r, info["signs"][0].s);
        const price = String(JSBI.BigInt(info.price))
        return marketMakerContract.methods.buy(
            address.toString(), this._getWei(amount), info.blockNo.toString(), price, info.fee.toString(), info["signs"][0].v.toString(), info["signs"][0].r.toString(), info["signs"][0].s.toString())
            .send({ from: this.account })
            .on('transactionHash', () => listener("transactionHash"))
            .once('receipt', () => listener("receipt"))
            .on('error', () => listener("error"));
    }

    sell = (address, amount, info, listener) => {
        if (!this.checkWallet()) return 0
        const price = String(JSBI.BigInt(info.price))
        const metamaskWeb3 = new Web3(Web3.givenProvider);
        const marketMakerContract = new metamaskWeb3.eth.Contract(stocksABI, this.marketMaker);
        return marketMakerContract.methods.sell(
            address.toString(), this._getWei(amount), info.blockNo.toString(), price, info.fee.toString(), info["signs"][0].v.toString(), info["signs"][0].r.toString(), info["signs"][0].s.toString())
            .send({ from: this.account })
            .on('transactionHash', () => listener("transactionHash"))
            .once('receipt', () => listener("receipt"))
            .on('error', () => listener("error"));
    }

    getTotalCap = (account) => {
        this.makeProvider()
        if (!account) return 0
        const metamaskWeb3 = new Web3(Web3.givenProvider);
        const TokenContract = new this.infuraWeb3.eth.Contract(tokenABI, this.timeTokenAddress);
        const marketMakerContract = new metamaskWeb3.eth.Contract(stocksABI, this.marketMaker);
        const TimeStakingContract = new metamaskWeb3.eth.Contract(stakingABI, this.timeStakingAddress)

        return TokenContract.methods.balanceOf(account).call().then(balance => {
            return TimeStakingContract.methods.users(account).call().then(stakedAmount => {
                return marketMakerContract.methods.capRatio().call().then(ratio => {
                    const balace = Number(Web3.utils.fromWei(balance, 'ether'));
                    const stakedAmount2 = Number(Web3.utils.fromWei(stakedAmount[0], 'ether'));
                    const result = ((balace + stakedAmount2) * Number(Web3.utils.fromWei(ratio, 'ether')))
                    return result;
                })
            })
        })
    }

    getUsedCap = (account) => {
        if (!account) return 0
        const metamaskWeb3 = new Web3(Web3.givenProvider);
        const marketMakerContract = new metamaskWeb3.eth.Contract(stocksABI, this.marketMaker);
        return marketMakerContract.methods.boughtAmount(account).call().then(info => {
            return Web3.utils.fromWei(info, 'ether');
        })
    }

}