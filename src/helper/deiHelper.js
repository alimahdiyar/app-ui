import BigNumber from "bignumber.js"
import { COLLATERAL_ADDRESS, COLLATERAL_POOL_ADDRESS, DEI_ADDRESS, DEI_COLLATERAL_ZAP, DEI_DEUS_ZAP, DEUS_ADDRESS, MINT_PATH, TO_NATIVE_PATH, DEUS_NATIVE_ZAP, SELL_PATH } from "../constant/contracts"
import { isZero, TEN } from "../constant/number"
import { collateralToken } from "../constant/token"
import { ChainId } from "../constant/web3"
import { TransactionState } from "../utils/constant"
import { CustomTransaction, getTransactionLink } from "../utils/explorers"
import { fetcher, formatUnitAmount } from "../utils/utils"
import { getDeiContract, getDeiStakingContract, getCollateralPoolContract, getZapContract, getNewProxyMinterContract, getDeusSwapContract, getDeusSwapSellContract } from "./contractHelpers"
import { getToWei } from "./formatBalance"

const baseUrl = "https://oracle4.deus.finance/dei"

export const dollarDecimals = 6
export const collatUsdPrice = "1000000"
const LENGTH_COLLAT = {
    [ChainId.ETH]: 3,
    [ChainId.BSC]: 3,
    [ChainId.FTM]: 3,
    [ChainId.MATIC]: 4,
}

const COLLAT_PRICE = {
    [ChainId.BSC_TESTNET]: "1000000000000000000",
    [ChainId.BSC]: "1000000000000000000",
}

export const makeCostData = (deiPrice, collatRatio, poolBalance = null, ceiling = null, decimals = 6) => {
    const dp = deiPrice ? `$${new BigNumber(deiPrice).toFixed(2)}` : null
    const cr = collatRatio !== null ? `${new BigNumber(collatRatio).toFixed(2)}%` : null
    const pc = poolBalance !== null && ceiling !== null ? formatUnitAmount(new BigNumber(poolBalance).div(TEN.pow(decimals - 6))) + ' / ' + formatUnitAmount(new BigNumber(ceiling).div(TEN.pow(decimals - 6))) : null
    const av = pc ? formatUnitAmount(new BigNumber(ceiling).minus(poolBalance).div(TEN.pow(decimals - 6))) : null
    return [{
        name: 'DEI PRICE',
        value: dp
    }, {
        name: 'COLLATERAL RATIO',
        value: cr
    }, {
        name: 'POOL BALANCE / CEILING',
        value: pc
    }, {
        name: 'AVAILABLE TO MINT',
        value: av
    }]
}

export const makeCostDataRedeem = (collatRatio, poolBalance, chainId = ChainId.ETH, decimals = 6) => {
    const cToken = collateralToken[chainId] ? collateralToken[chainId] : collateralToken[ChainId.ETH]
    const cr = collatRatio !== null ? `${new BigNumber(collatRatio).toFixed(2)}%` : null
    const pb = poolBalance !== null ? `${formatUnitAmount(new BigNumber(poolBalance).div(TEN.pow(decimals - 6)))} ${cToken?.symbol}` : null
    return [{
        name: 'COLLATERAL RATIO',
        value: cr
    }, {
        name: 'POOL BALANCE',
        value: pb
    }]
}

export const makeCostDataBuyBack = (deus_price, dei_price, pool, buyBack, recollateralize, address, chainId) => {
    if (!chainId) return []
    const cToken = collateralToken[chainId]
    const deusPrice = deus_price !== null && !isNaN(deus_price) ? `$${new BigNumber(deus_price).toFixed(3)}` : null
    const deiPrice = dei_price !== null && !isNaN(dei_price) ? `$${new BigNumber(dei_price).toFixed(3)}` : null
    const p = pool ? pool : null
    const bb = buyBack !== null && !isNaN(buyBack) ? `${formatUnitAmount(buyBack)} DEUS` : null
    const rc = recollateralize !== null && !isNaN(recollateralize) ? `${formatUnitAmount(recollateralize)} ${cToken?.symbol}` : null

    return [{
        name: 'EXCHANGE RATES',
        title1: cToken?.symbol,
        value1: deiPrice,
        title2: 'DEUS: ',
        value2: deusPrice
    }, {
        name: 'AVAILABLE VALUE',
        title1: 'To Buyback: ',
        value1: bb,
        title2: 'To Recollateralize: ',
        value2: rc
    }, {
        name: 'POOL 🌊',
        value1: p,
        isLink: true,
        path: getTransactionLink(chainId, address)
    }]
}

//MULTICALL Array
export const getStakingData = (conf, account) => {
    if (!conf) return []
    return [
        {
            address: conf.stakingContract,
            name: "users",
            params: [account]
        },
        {
            address: conf.stakingContract,
            name: "pendingReward",
            params: [account]
        }
    ]
}
export const getStakingTokenData = (conf, account) => {
    if (!account) return []
    return [
        {
            address: conf.depositToken.address,
            name: "allowance",
            params: [account, conf.stakingContract]
        },
        {
            address: conf.depositToken.address,
            name: "balanceOf",
            params: [account]
        },
        {
            address: conf.depositToken.address,
            name: "balanceOf",
            params: [conf.stakingContract]
        }
    ]
}

export const getHusdPoolData = (chainId = ChainId.ETH, collat_usd_price, account) => {
    const LEN = LENGTH_COLLAT[chainId] ?? 3
    let collaterals = []
    for (let i = 0; i < LEN; i++) {
        collaterals.push(COLLAT_PRICE[chainId] ?? collat_usd_price);
    }

    let calls = [
        {
            address: COLLATERAL_POOL_ADDRESS[chainId],
            name: 'collatDollarBalance',
            params: [COLLAT_PRICE[chainId] ?? collat_usd_price],
        },
        {
            address: COLLATERAL_POOL_ADDRESS[chainId],
            name: 'availableExcessCollatDV',
            params: [collaterals]
        },
        {
            address: COLLATERAL_POOL_ADDRESS[chainId],
            name: 'pool_ceiling',
        },
        {
            address: COLLATERAL_POOL_ADDRESS[chainId],
            name: 'redemption_fee',
        },
        {
            address: COLLATERAL_POOL_ADDRESS[chainId],
            name: 'minting_fee',
        },
        {
            address: COLLATERAL_POOL_ADDRESS[chainId],
            name: 'buyback_fee',
        },
        {
            address: COLLATERAL_POOL_ADDRESS[chainId],
            name: 'recollat_fee',
        },
        {
            address: COLLATERAL_POOL_ADDRESS[chainId],
            name: 'recollateralizePaused',
        },
        {
            address: COLLATERAL_POOL_ADDRESS[chainId],
            name: 'buyBackPaused',
        },
        {
            address: COLLATERAL_POOL_ADDRESS[chainId],
            name: 'mintPaused',
        },
        {
            address: COLLATERAL_POOL_ADDRESS[chainId],
            name: 'redeemPaused',
        },
        {
            address: COLLATERAL_POOL_ADDRESS[chainId],
            name: 'bonus_rate',
        },
        {
            address: COLLATERAL_POOL_ADDRESS[chainId],
            name: 'redemption_delay',
        },
    ]
    if (account) {
        calls = [...calls,
        {
            address: COLLATERAL_POOL_ADDRESS[chainId],
            name: 'redeemDEUSBalances',
            params: [account]
        },
        {
            address: COLLATERAL_POOL_ADDRESS[chainId],
            name: 'redeemCollateralBalances',
            params: [account]
        }]
    }
    return calls
}

//WRITE FUNCTIONS
export const SendWithToast = (fn, account, chainId, message, payload = {}) => {
    if (!fn) return
    let hash = null
    const value = payload.value ? { value: payload.value } : {}
    const customSend = { from: account, ...value }
    return fn
        .send(customSend)
        .once('transactionHash', (tx) => {
            hash = tx
            CustomTransaction(TransactionState.LOADING, {
                hash,
                chainId: chainId,
                message: message,
            })
        })
        .once('receipt', () => CustomTransaction(TransactionState.SUCCESS, {
            hash,
            chainId: chainId,
            message: message,
        }))
        .once('error', () => CustomTransaction(TransactionState.FAILED, {
            hash,
            chainId: chainId,
            message: message,
        }))
}

export const DeiDeposit = (depositedToken, amount, address, web3) => {
    console.log(getToWei(amount, depositedToken.decimals).toFixed(0));
    return getDeiStakingContract(web3, address)
        .methods
        .deposit(getToWei(amount, depositedToken.decimals).toFixed(0))
}

export const DeiWithdraw = (withdrawToken, amount, address, web3) => {
    return getDeiStakingContract(web3, address)
        .methods
        .withdraw(getToWei(amount, withdrawToken.decimals).toFixed(0))
}

export const buyBackDEUS = (amountIn, deus_price, expire_block, signature, pool_collateral_price = "0", account, chainId, web3) => {
    return getCollateralPoolContract(web3, chainId)
        .methods
        .buyBackDEUS(amountIn, [pool_collateral_price], deus_price, expire_block, [signature])
}

export const RecollateralizeDEI = (collateral_price, deus_price, expire_block, signature, amountIn, pool_collateral_price, account, chainId, web3) => {
    return getCollateralPoolContract(web3, chainId)
        .methods
        .recollateralizeDEI([amountIn, pool_collateral_price, [collateral_price], deus_price, expire_block, [signature]])
}

//HUSD MINT
export const mint1t1DEI = (collateral_amount, collateral_price, expire_block, signature, chainId, web3) => {
    return getCollateralPoolContract(web3, chainId)
        .methods
        .mint1t1DEI(collateral_amount, collateral_price, expire_block, [signature])
}

export const mintFractional = (collateral_amount, deus_amount, collateral_price, deus_current_price, expireBlock, signature, chainId, web3) => {
    return getCollateralPoolContract(web3, chainId)
        .methods
        .mintFractionalDEI(collateral_amount, deus_amount, collateral_price, deus_current_price, expireBlock, [signature])
}

export const mintAlgorithmic = (deus_amount_d18, deus_current_price, expire_block, signature, chainId, web3) => {
    return getCollateralPoolContract(web3, chainId)
        .methods
        .mintAlgorithmicDEI(deus_amount_d18, deus_current_price, expire_block, [signature])
}

export const redeem1to1Dei = (amountIn, collateral_price, expire_block, signature, chainId, web3) => {
    return getCollateralPoolContract(web3, chainId)
        .methods
        .redeem1t1DEI(amountIn, collateral_price, expire_block, [signature])
}

export const redeemFractionalDei = (collateral_price, deus_price, expire_block, signature, amountIn, chainId, web3) => {
    return getCollateralPoolContract(web3, chainId)
        .methods
        .redeemFractionalDEI(amountIn, collateral_price, deus_price, expire_block, [signature])
}

export const redeemAlgorithmicDei = (deus_price, expire_block, signature, amountIn, chainId, web3) => {
    return getCollateralPoolContract(web3, chainId)
        .methods
        .redeemAlgorithmicDEI(amountIn, deus_price, expire_block, [signature])
}

export const getClaimAll = async (account, web3, chainId = ChainId.ETH) => {
    return getCollateralPoolContract(web3, chainId)
        .methods
        .collectRedemption()
        .send({ from: account })
}

//READ FUNCTIONS
export const getDeiInfo = async (web3, chainId = ChainId.ETH, collat_usd_price = collatUsdPrice) => {
    const LEN = LENGTH_COLLAT[chainId] ?? 3
    let collaterals = []
    for (let i = 0; i < LEN; i++) {
        // console.log(COLLAT_PRICE[chainId], collat_usd_price);
        collaterals.push(COLLAT_PRICE[chainId] ?? collat_usd_price);
    }

    return getDeiContract(web3, chainId)
        .methods
        .dei_info(collaterals)
        .call()
}

export const makeDeiRequest = async (path, chainId = 4) => {
    return fetcher(baseUrl + path + `?chainId=${chainId}`)
}

export const isProxyMinter = (token, isPair, collatRatio, chainId) => {
    if (!token || !token.symbol || collatRatio === null) return null
    if ((collatRatio === 100 && token.symbol === collateralToken[chainId]?.symbol && !isPair) ||
        (collatRatio === 0 && token.symbol === "DEUS" && !isPair) ||
        (collatRatio > 0 && collatRatio < 100 && isPair)) return false
    return true
}


export const getAmountOutDeusSwap = async (fromCurrency, amountIn, toCurrency, deus_price, collateral_price, web3, chainId) => {
    if (!fromCurrency || !amountIn || isZero(amountIn) || deus_price === undefined) return ""
    const amountInToWei = getToWei(amountIn, fromCurrency.decimals).toFixed(0)
    const collateralPriceWei = getToWei(collateral_price, 6).toFixed(0)
    const deusPriceWei = getToWei(deus_price, 6).toFixed(0)
    let method = ""
    let params = [amountInToWei, deusPriceWei, collateralPriceWei]
    const erc20Path = MINT_PATH[chainId][fromCurrency.symbol]

    if (fromCurrency.symbol !== "DEUS") { // Buy DEUS
        if (fromCurrency.address === COLLATERAL_ADDRESS[chainId]) {
            method = "getUSDC2DEUSInputs"
        } else {
            method = "getERC202DEUSInputs"
            if (!erc20Path) {
                console.error("INVALID PATH with ", fromCurrency)
                return
            }
            params.push(erc20Path)
        }
        return getDeusSwapContract(web3, chainId).methods[method](...params).call()

    } else {  // Sell DEUS
        if (chainId === ChainId.ETH) {
            method = "getAmountOut"
            const path = SELL_PATH[chainId][toCurrency.symbol] ? SELL_PATH[chainId][toCurrency.symbol] : []
            let params = [amountInToWei, getJ(toCurrency), path]
            return getDeusSwapSellContract(web3, chainId).methods[method](...params).call()
        } else {
            method = "getAmountsOut"
            const path = SELL_PATH[chainId][toCurrency.symbol]
            let params = [amountInToWei, path]
            return getDeusSwapSellContract(web3, chainId).methods[method](...params).call()
        }
    }
}

export const getJ = (currency) => {
    let currencySymbol = currency.symbol.toUpperCase()
    if (currencySymbol === "DEI") return 0
    else if (currencySymbol === "DAI") return 1
    else if (currencySymbol === "USDC") return 2
    else if (currencySymbol === "USDT") return 3
    else return 2
}

export const getAmountDeusSwapSell = (toCurrency, amountIn, deus_price, collateral_price, web3, chainId) => {
    if (!toCurrency || !amountIn || isZero(amountIn) || deus_price === undefined) return ""
    const amountInToWei = getToWei(amountIn, toCurrency.decimals).toFixed(0)
    const collateralPriceWei = getToWei(collateral_price, 6).toFixed(0)
    const deusPriceWei = getToWei(deus_price, 6).toFixed(0)
    const erc20Path = MINT_PATH[chainId][toCurrency.symbol]
    let params = [amountInToWei, deusPriceWei, collateralPriceWei, erc20Path]
    return getDeusSwapContract(web3, chainId).methods.getAmountOut(...params).call()
}

export const getAmountOutProxy = async (fromCurrency, amountIn, deus_price, collateral_price, web3, chainId) => {
    if (!fromCurrency || !amountIn || isZero(amountIn) || deus_price === undefined) return ""
    const amountInToWei = getToWei(amountIn, fromCurrency.decimals).toFixed(0)
    const collateralPriceWei = getToWei(collateral_price, 6).toFixed(0)
    const deusPriceWei = getToWei(deus_price, 6).toFixed(0)
    let method = ""
    let params = [amountInToWei, deusPriceWei, collateralPriceWei]
    // console.log(chainId, amountInToWei);

    const erc20Path = MINT_PATH[chainId][fromCurrency.symbol]

    if (fromCurrency.address === COLLATERAL_ADDRESS[chainId]) {
        method = "getUSDC2DEIInputs"
    } else {
        method = "getERC202DEIInputs"
        if (!erc20Path) {
            console.error("INVALID PATH with ", fromCurrency)
            return
        }
        params.push(erc20Path)
    }
    // console.log(method, params);
    return getNewProxyMinterContract(web3, chainId).methods[method](...params).call()
}


export const getZapAmountsOut = async (currency, amountInToWei, zapperAddress, result, web3, chainId) => {
    let erc20Path = MINT_PATH[chainId][currency.symbol]
    let toNativePath = TO_NATIVE_PATH[chainId][currency.symbol]
    const collateral_price_toWei = getToWei(result.collateral_price, 6).toFixed(0)
    const deus_price_toWei = getToWei(result.deus_price, 6).toFixed(0)

    if (zapperAddress === DEI_COLLATERAL_ZAP[chainId]) {
        const lpAmount = await getZapContract(web3, zapperAddress, chainId)
            .methods
            .getAmountOut([amountInToWei, deus_price_toWei, collateral_price_toWei, 4, [...erc20Path], []]).call()
        return lpAmount
    }
    else if (zapperAddress === DEUS_NATIVE_ZAP[chainId]) {
        if (currency.symbol === "DEUS" && chainId === ChainId.MATIC) {
            erc20Path = MINT_PATH[chainId]["DEUS_edited"]
            toNativePath = TO_NATIVE_PATH[chainId]["DEUS_edited"]
        }

        const lpAmount = await getZapContract(web3, zapperAddress, chainId)
            .methods
            .getAmountOut([amountInToWei, deus_price_toWei, collateral_price_toWei, 20, [...erc20Path], [...toNativePath], 0]).call()
        return lpAmount
    }

    if (currency.address === DEUS_ADDRESS[chainId]) {
        return getZapContract(web3, zapperAddress, chainId)
            .methods
            .getAmountOutLPDEUS(amountInToWei).call()
    } else if (currency.address === DEI_ADDRESS[chainId]) {
        return getZapContract(web3, zapperAddress, chainId)
            .methods
            .getAmountOutLPDEI(amountInToWei).call()
    }
    return getZapContract(web3, zapperAddress, chainId)
        .methods
        .getAmountOutLPERC20ORNativecoin(amountInToWei, deus_price_toWei, collateral_price_toWei, erc20Path).call()
}


// struct ProxyInput DEI_COLLATERAL_ZAP {
// 	uint amountIn;
// 	uint minAmountOut;
// 	uint deusPriceUSD;
// 	uint colPriceUSD;
// 	uint usdcForMintAmount;
// 	uint deusNeededAmount;
// 	uint expireBlock;
// 	bytes[] sigs;
// }

export const zapIn = (currency, zapperAddress, amountIn, minLpAmount, result, amountOutParams, transferResidual, web3, chainId) => {
    let erc20Path = MINT_PATH[chainId][currency.symbol]
    let toNativePath = TO_NATIVE_PATH[chainId][currency.symbol]
    const { collateral_price, deus_price, expire_block, signature } = result

    let proxyTuple = []
    if (amountOutParams.length > 0)
        proxyTuple = [
            amountIn,
            minLpAmount,
            deus_price,
            collateral_price,
            amountOutParams[2], // usdcForMintAmount
            amountOutParams[3], // deusNeededAmount
            expire_block,
            [signature]
        ]
    if (zapperAddress === DEI_DEUS_ZAP[chainId]) {
        if (currency.address === "0x") {
            return getZapContract(web3, zapperAddress, chainId)
                .methods
                .zapInNativecoin(proxyTuple, minLpAmount, erc20Path, transferResidual)
        }
        else if (currency.address === DEUS_ADDRESS[chainId]) {
            return getZapContract(web3, zapperAddress, chainId)
                .methods
                .zapInDEUS(amountIn, minLpAmount, transferResidual)
        }
        else if (currency.address === DEI_ADDRESS[chainId]) {
            return getZapContract(web3, zapperAddress, chainId)
                .methods
                .zapInDEI(amountIn, minLpAmount, transferResidual)
        }
        return getZapContract(web3, zapperAddress, chainId)
            .methods
            .zapInERC20(proxyTuple, amountIn, minLpAmount, erc20Path, transferResidual)

    } else if (zapperAddress === DEUS_NATIVE_ZAP[chainId]) {
        proxyTuple[1] = 0;
        if (currency.symbol === "DEUS" && chainId === ChainId.MATIC) {
            erc20Path = MINT_PATH[chainId]["DEUS_edited"]
            toNativePath = TO_NATIVE_PATH[chainId]["DEUS_edited"]
        }

        if (currency.address === "0x") {
            return getZapContract(web3, zapperAddress, chainId)
                .methods
                .zapInNativecoin(minLpAmount, transferResidual, proxyTuple, toNativePath, erc20Path, amountOutParams[4])
        }
        return getZapContract(web3, zapperAddress, chainId)
            .methods
            .zapInERC20(minLpAmount, transferResidual, proxyTuple, toNativePath, erc20Path, amountOutParams[4])
    } else { // DEUS_COLLATERAL_ZAP
        if (currency.address === "0x") {
            return getZapContract(web3, zapperAddress, chainId)
                .methods
                .zapInNativecoin(minLpAmount, transferResidual, proxyTuple, erc20Path, amountOutParams[4])
        }
        return getZapContract(web3, zapperAddress, chainId)
            .methods
            .zapInERC20(amountIn, minLpAmount, transferResidual, proxyTuple, erc20Path, amountOutParams[4])
    }
}
