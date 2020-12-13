import React, { Component } from 'react'
// import * as config from '../../config';
// import CountUp from 'react-countup';
import { Link } from 'react-router-dom';
import { TransverseLoading } from 'react-loadingg';



class Stake extends Component {


    state = {
        startDea: "",
        endDea: ""
    }

    countDecimal = (number) => {
        const strnum = number.toString()

        let pointIndex = strnum.indexOf(".")

        if (strnum.charAt(pointIndex - 1) !== '0') { //if rewardRatio is bigger than 1 so we haven't decimal number for counting 
            return 0;
        }

        for (var i = pointIndex + 1; i < strnum.length; i++) {
            if (strnum.charAt(i) === '0') {
                continue
            } else {
                break
            }
        }
        return i - pointIndex + 1;
    }


    provideLiquidityButton = (token) => {
        return token.isDeusLink
            ? <Link className="provide-liquidity" to={token.liqLink}>provide Liquidity</Link>
            : <a className="provide-liquidity" href={token.liqLink} target="_blank" rel="noopener noreferrer">provide Liquidity</a>
    }

    provideMoreButton = (token, isSingle) => {
        return token.isDeusLink
            ? <Link className="box-btn" to={token.liqLink}>buy more</Link>
            : <a className="box-btn" href={token.liqLink} target="_blank" rel="noopener noreferrer">{isSingle ? "buy" : "provide"} more</a>
    }


    render() {
        const { token, shadowClass, handlePopup, handleClaim, handleWithdraw } = this.props
        const { name, amounts, rewardRatio, comming_soon } = token
        const isStaked = parseFloat(amounts.lp) > 0 ? true : false
        const isSingle = name.indexOf("_") === -1 ? true : false
        const provideWrapClasses = isSingle ? "single-asset-wrap" : "provide-liquidity-wrap"
        const stakedClass = isStaked ? "staked" : ""
        const shadowClasses = shadowClass ? shadowClass : "blue-200-shadow"
        const stakedText = isStaked ? "more" : "here"
        const decimals = this.countDecimal(rewardRatio)
        return (<div className={`triangle-wrap  ${shadowClasses}`}>
            <div className={`triangle ${stakedClass}`}>
                {!comming_soon && <div className="stake-here" onClick={() => handlePopup(name, true)}> <p>Stake <br /> {stakedText}</p> </div>}
                {comming_soon && <div className="stake-here stake-here-disabled" style={{}}>Stake <br /> {stakedText}</div>}
                <div className="title">{name.toUpperCase().replace("_", "-")} </div>
                {/* <div className="apy" style={{ opacity: 0 }}>.</div> */}
                <div className="apy" > {amounts.apy}% APY</div>
                {comming_soon && <div className="comming-soon">Will be launched on 26/10/2020 at 8 PM UTC</div>}
                {!comming_soon && !isStaked && <div className={provideWrapClasses}>
                    {isSingle && <div className="single-asset" >single asset pool</div>}
                    {!isSingle && this.provideLiquidityButton(token)}
                </div>
                }
                {isStaked &&
                    <div className="boxes">
                        <div className="box">
                            <div className="box-title-wrap">
                                <div className="box-title percentage">you own {parseFloat(token.amounts.pool).toFixed(2)}% <br /> of the pool</div>
                            </div>
                            {this.provideMoreButton(token, isSingle)}
                        </div>
                        <div className="box">
                            <div className="box-title-wrap">
                                <div className="box-title">
                                    {token.amounts.dea === "0" || token.amounts.dea === 0 ? <div className="loading-stake"><TransverseLoading color="#ffffff" size={'small'} ></TransverseLoading></div> : <div>
                                        {(token.amounts.dea).toFixed(decimals) + " "}
                                     DEA claimable</div>}
                                </div>
                            </div>
                            <div className="box-btn" onClick={() => handleClaim(name)}>
                                claim DEA</div>
                        </div>
                        <div className="box">
                            <div className="box-title-wrap" >
                                <div className="box-title lp-deposited">
                                    {amounts.lp} tokens deposited</div>
                            </div>
                            <div className="box-btn" onClick={() => handleWithdraw(name, amounts.lp)}>
                                withdraw &amp; claim
                                </div>
                        </div>
                    </div>}
            </div>
        </div >);
    }
}


export default Stake;