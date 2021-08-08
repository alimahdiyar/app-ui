import SwapCard from '../../../components/App/Swap/SwapCard';
import LinkBox from '../../../components/App/Dei/LinkBox'
import { CostBoxBuyBack } from '../../../components/App/Dei/CostBoxBuyBack'
import { Type } from '../../../components/App/Text';
import styled from 'styled-components';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Image } from 'rebass/styled-components';
import { SwapWrapper } from '../../../components/App/Swap';
import TokenBox from '../../../components/App/Swap/TokenBox';
import SwapAction from '../../../components/App/Swap/SwapAction';
import RateBox from '../../../components/App/Swap/RateBox';
import { useWeb3React } from '@web3-react/core';
import BigNumber from 'bignumber.js';
import { useApprove } from '../../../hooks/useApprove';
import { useAllowance } from '../../../hooks/useAllowance';
import useChain from '../../../hooks/useChain';
import { getContractAddr } from '../../../utils/contracts';
import { useDebounce } from '../../../hooks/useDebounce';
import { DEITokens } from '../../../constant/token';
import { useBuyBack, useRecollat } from '../../../hooks/useDei';
import { useRecoilValue } from 'recoil';
import InfoBox from '../../../components/App/Dei/InfoBox';
import { RemoveTrailingZero } from '../../../helper/formatBalance';
import { ContentWrapper } from '../Mint'
import { useRecollateralizePaused, useBuyBackPaused, useDeiUpdateBuyBack, useBonusRate } from '../../../hooks/useDei';
import {
    availableBuybackState, availableRecollatState, deiPricesState, recollatFeeState, 
    buyBackFeeState } from '../../../store/dei';

const TopWrap = styled.div`
    display: flex;
    justify-content: center;
    flex-direction: row;
    ${({ theme }) => theme.mediaWidth.upToExtraLarge`
        flex-direction: column;
    `}
`

const FakeWrapper = styled.div`
    flex: 0.75;
`

const MainWrapper = styled.div`
    flex: 1;
    padding-top: 60px;
    padding-bottom: 30px;
    text-align: center;
`

const msg = "There is currently no excess value to conduct buybacks."
const msg2 = "The protocol is properly collateralized."

const Dei = () => {
    useDeiUpdateBuyBack();
    const buyBackFee = useRecoilValue(buyBackFeeState)
    const recollatFee = useRecoilValue(recollatFeeState)
    const buyBackPaused = useBuyBackPaused();
    const recollateralizePaused = useRecollateralizePaused();
    let availableBuyback = Math.max(useRecoilValue(availableBuybackState), 0)
    let availableRecollat = Math.max(useRecoilValue(availableRecollatState), 0)
    const deiPrices = useRecoilValue(deiPricesState)
    const bonusRate = useBonusRate()
    // console.log(`bonusRate: ${bonusRate}`);

    const [invert, setInvert] = useState(false)
    const [fastUpdate, setFastUpdate] = useState(0)
    const [isApproved, setIsApproved] = useState(null)
    const [isPreApproved, setIsPreApproved] = useState(null)
    const [approveLoading, setApproveLoading] = useState(false)
    const { account } = useWeb3React()
    const validNetworks = [1, 4]
    const chainId = useChain(validNetworks)

    const contractAddress = getContractAddr("multi_swap_contract", chainId)
    const tokens = useMemo(() => DEITokens.filter((token) => !token.chainId || token.chainId === chainId), [chainId])

    const tokensMap = {}
    const pairedTokens = []
    for (let i = 0; i < DEITokens.length; i++) {
        const t = DEITokens[i]
        if (t.pairID) {
            let j = i + 1
            for (; j < DEITokens.length; j++) {
                const tt = DEITokens[j]
                if (tt.pairID && t.pairID === tt.pairID) {
                    j++
                } else {
                    break
                }
            }
            pairedTokens.push(DEITokens.slice(i, j))
            i = j
        } else {
            pairedTokens.push([DEITokens[i]])
        }
    }

    for (let i = 0; i < tokens.length; i++) {
        const currToken = tokens[i]
        const { address, pairID } = currToken
        if (tokensMap[address]) tokensMap[address + pairID] = currToken
        else tokensMap[address] = currToken
    }

    const tokenBalances = tokensMap
    const [TokensMap, setTokensMap] = useState(tokenBalances)

    let primaryToken = DEITokens.filter(token => token.symbol === "DEUS")[0]
    let secondaryToken = DEITokens.filter(token => token.symbol === "HUSD")[0]
    const [swapState, setSwapState] = useState({
        from: secondaryToken,
        to: primaryToken,
    })

    const [hotIn, setHotIn] = useState("")
    const [amountIn1, setAmountIn1] = useState("")
    const [amountIn2, setAmountIn2] = useState("")
    const debouncedAmountIn = useDebounce(amountIn1, 500, hotIn);
    const [amountOut1, setAmountOut1] = useState("")
    const [amountOut2, setAmountOut2] = useState("")
    const allowance = useAllowance(swapState.from, contractAddress, chainId)

    useEffect(() => {
        if (amountIn1 === "" || debouncedAmountIn === "") setAmountOut1("")
    }, [amountIn1, debouncedAmountIn]);

    useEffect(() => {
        if (amountIn2 === "" || debouncedAmountIn === "") setAmountOut2("")
    }, [amountIn2, debouncedAmountIn]);

    useEffect(() => {
        setIsPreApproved(null)
        setIsApproved(null)
    }, [chainId, account, swapState.from]);

    useEffect(() => {
        if (deiPrices) {
            const { collateral_price, dei_price, deus_price } = deiPrices
            const amount = new BigNumber(amountIn1).times(deus_price).div(collateral_price).times(1 - (buyBackFee / 1e6)).toFixed(18)
            setAmountOut1(RemoveTrailingZero(amount))
        }
    }, [amountIn1, buyBackFee, deiPrices]);

    useEffect(() => {
        if (deiPrices) {
            const { collateral_price, dei_price, deus_price } = deiPrices
            const amount = new BigNumber(amountIn2).div(deus_price).times(collateral_price).times(1 - (recollatFee / 1e6)).plus(bonusRate).toFixed(18)
            setAmountOut2(RemoveTrailingZero(amount))
        }
    }, [amountIn2, recollatFee, deiPrices]);

    // useEffect(() => {
    //     setIsPreApproved(null)
    //     setIsApproved(false)
    // }, [swapState.from])

    // useEffect(() => { //TODO balances
    //     setTokensMap(tokenBalances)
    // }, [tokenBalances])

    useEffect(() => {
        if (isPreApproved == null) {
            if (allowance.toString() === "-1") {
                setIsPreApproved(null) //doNothing
            } else {
                if (allowance.gt(0)) {
                    setIsPreApproved(true)
                } else {
                    setIsPreApproved(false)
                }
            }
        } else {
            if (allowance.gt(0)) {
                setIsApproved(true)
            }
        }
        //eslint-disable-next-line 
    }, [allowance]) //isPreApproved ?

    let targetToken = useMemo(() => {
        if (availableBuyback !== null) return availableBuyback > 0 ? swapState.from : swapState.to
    }, [availableBuyback])
    const { onApprove } = useApprove(targetToken, contractAddress, chainId)
    const { onBuyBack } = useBuyBack(swapState.from, swapState.to, amountIn1, amountOut1, chainId)
    const { onRecollat } = useRecollat(swapState.to, swapState.from, amountIn2, amountOut2, chainId)

    const handleApprove = useCallback(async () => {
        try {
            setApproveLoading(true)
            const tx = await onApprove()
            if (tx.status) {
                setIsApproved(new BigNumber(tx.events.Approval.raw.data, 16).gt(0))
            } else {
                console.log("Approved Failed");
            }
            setApproveLoading(false)

        } catch (e) {
            setApproveLoading(false)
            console.error(e)
        }
    }, [onApprove])

    const handleSwap1 = useCallback(async () => {
        try {
            const tx = await onBuyBack()
            if (tx.status) {
                console.log("BuyBack did");
                setAmountIn1("")
                setFastUpdate(fastUpdate => fastUpdate + 1)
            } else {
                console.log("BuyBack Failed");
            }
        } catch (e) {
            console.error(e)
        }
    }, [onBuyBack])

    const handleSwap2 = useCallback(async () => {
        try {
            const tx = await onRecollat()
            if (tx.status) {
                console.log("Recollat did");
                setAmountIn2("")
                setFastUpdate(fastUpdate => fastUpdate + 1)
            } else {
                console.log("Swap Recollat");
            }
        } catch (e) {
            console.error(e)
        }
    }, [onRecollat])

    return (<>
        <TopWrap>
            <FakeWrapper></FakeWrapper>

            <MainWrapper>
                <ContentWrapper deactivated={buyBackPaused || !availableBuyback}>
                    <Type.XL fontWeight="300">Buyback</Type.XL>
                    <SwapWrapper style={{ marginTop: "25px" }}>
                        <TokenBox
                            type="from"
                            hasMax={true}
                            inputAmount={amountIn1}
                            setInputAmount={setAmountIn1}
                            setActive={null}
                            currency={swapState.to}
                            TokensMap={TokensMap}
                            fastUpdate={fastUpdate}
                        />

                        <Image src="/img/swap/single-arrow.svg" size="20px" my="15px" />

                        <TokenBox
                            type="to"
                            title="To (estimated)"
                            inputAmount={amountOut1}
                            setInputAmount={setAmountOut1}
                            setActive={null}
                            TokensMap={TokensMap}
                            currency={swapState.from}
                            fastUpdate={fastUpdate}
                        />

                        <RateBox state={swapState} amountIn={debouncedAmountIn} amountOut={amountOut1} invert={invert} setInvert={setInvert} />

                        <SwapAction
                            bgColor={"grad_dei"}
                            text="BUYBACK"
                            isPreApproved={isPreApproved}
                            validNetworks={[1, 4]}
                            isApproved={isApproved}
                            loading={approveLoading}
                            handleApprove={handleApprove}
                            handleSwap={handleSwap1}
                            TokensMap={TokensMap}
                            swapState={swapState}
                            amountIn={amountIn1}
                            amountOut={amountOut1}
                        />

                    </SwapWrapper>

                    <SwapCard title="Swap Fee" value={buyBackFee ? `${buyBackFee / 10000} %` : null} />
                </ContentWrapper>

                {!availableBuyback && <InfoBox title={msg}/>}
            </MainWrapper>

            <MainWrapper>
                <ContentWrapper deactivated={recollateralizePaused || !availableRecollat}>
                    <Type.XL fontWeight="300">Recollateralize</Type.XL>
                    <SwapWrapper style={{ marginTop: "25px", }}>
                        <TokenBox
                            type="from"
                            hasMax={true}
                            inputAmount={amountIn2}
                            setInputAmount={setAmountIn2}
                            setActive={null}
                            currency={swapState.from}
                            TokensMap={TokensMap}
                            fastUpdate={fastUpdate}
                        />

                        <Image src="/img/swap/single-arrow.svg" size="20px" my="15px" />

                        <TokenBox
                            type="to"
                            title="To (estimated)"
                            inputAmount={amountOut2}
                            setInputAmount={setAmountOut2}
                            setActive={null}
                            TokensMap={TokensMap}
                            currency={swapState.to}
                            fastUpdate={fastUpdate}
                        />

                        <RateBox state={swapState} amountIn={debouncedAmountIn} amountOut={amountOut2} invert={invert} setInvert={setInvert} />

                        <SwapAction
                            bgColor={"grad_dei"}
                            text="RECOLLATERALIZE"
                            isPreApproved={isPreApproved}
                            validNetworks={[1, 4]}
                            isApproved={isApproved}
                            loading={approveLoading}
                            handleApprove={handleApprove}
                            handleSwap={handleSwap2}
                            TokensMap={TokensMap}
                            swapState={swapState}
                            amountIn={amountIn2}
                            amountOut={amountOut2}
                        />

                    </SwapWrapper>

                    <SwapCard title="Swap Fee" value={recollatFee ? `${recollatFee / 10000} %` : null} />
                </ContentWrapper>

                {!availableRecollat && <InfoBox title={msg2} />}
            </MainWrapper>
            <FakeWrapper></FakeWrapper>
        </TopWrap>

        <div className='tut-left-wrap'>
            <LinkBox />
            <CostBoxBuyBack />
        </div>
    </>);
}

export default Dei;