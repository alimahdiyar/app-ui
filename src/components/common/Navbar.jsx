import MetaMaskOnboarding from '@metamask/onboarding';
import { useWeb3React } from '@web3-react/core';
import { injected } from '../../connectors';
import React, { useState, useEffect } from 'react'
import { NavLink } from 'react-router-dom';
import { dappLink, navbarItems } from '../../config';
import SubNavbar from './SubNavbar';
import { formatAddress, getStayledNumber, notify } from '../../utils/utils';
import { SwapService } from '../../services/SwapService';
import '../../styles/scss/navbar.scss';

const Navs = navbarItems.reverse()

const Navbar = () => {

    const web3React = useWeb3React()
    const { account, activate, chainId } = web3React
    const [menuMobileClass, setMenuMobileClass] = useState("close-menu");
    const [claimAmount, setClaim] = useState(0)
    const [web3, setWeb3] = useState(null)
    const [isMetamask, setIsMetamask] = useState(null)

    const methods = {
        onStart: () => {
            console.log("onStart")
        },
        onSuccess: () => {
            console.log("onSuccess")
            setClaim(0)
        },
        onError: () => console.log("onError"),
    }

    const handleClaim = async()=>{
      try {
            await web3.withdrawPayment(notify(methods))
      } catch (error) {
          console.log("claim eth error");
      }
    }


    const claimButton = claimAmount > 0 ? <li className="grad-wrap claimable-btn" onClick={handleClaim}>
        <div className={`grad `}>
            <div> {getStayledNumber(claimAmount)} ETH</div>
            <div>claim</div>
        </div>
    </li> : null


    useEffect(() => {
        if (MetaMaskOnboarding.isMetaMaskInstalled()) {
            setIsMetamask(true)
        } else {
            // console.log("MetaMask didnt  Installed");
            setIsMetamask(false)
        }
    }, [account]);


    useEffect(() => {
        const getClaimable = async (swapServie) => {
            try {
                const amount = await swapServie.getWithdrawableAmount()
                return amount
            } catch (error) {
                return 0
            }
        }

        if (account && chainId) {
            const swapServie = new SwapService(account, chainId)
            setWeb3(swapServie)
            setClaim(getClaimable(swapServie))

        }
    }, [account, chainId])

    const handleConnect = async () => {
        try {
            const data = await activate(injected)
            console.log(data);
        } catch (error) {
            console.log(error);
        }
    }

    const toggleNav = () => {
        if (menuMobileClass === "close-menu") {
            setMenuMobileClass("open-menu")
            return
        }
        setMenuMobileClass("close-menu")
    }


    const connectCalass = account ? "connected" : "connect"
    //DEUS staking
    return (<><nav id="nav">
        {<div className="left-nav-wrap">
            <ul className="left-nav">
                <li><span className="deus">DEUS <span className="finance">finance</span></span></li>
                {isMetamask && <li className="grad-wrap connect-wrap" onClick={handleConnect}>
                    <div className={`grad ${connectCalass}`}>{formatAddress(account)}</div>
                </li>}

                {!isMetamask && <li className="grad-wrap connect-wrap install">
                    <a href={dappLink} className={`grad`}>Install Metamask</a>
                </li>}
                {claimButton}
                {chainId === 4 && <li className="rinkeby">Rinkeby 😎</li>}
            </ul>
        </div>}
        <div className="menu-mobile-icon" onClick={toggleNav}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                <path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z" />
            </svg>
        </div>
        <div className="right-nav">
            <ul id="right-ul">
                {
                    Navs.map(nav => {
                        const classes = nav.linkDisabled ? "disabled-link" : ""
                        if (nav.out) return <li key={nav.id}><a className={classes} href={nav.path}><div className="nav-title">{nav.text}</div></a></li>

                        return <li key={nav.id} className="nav-item">
                            <NavLink className={classes} exact={nav.exact} to={nav.path}>
                                <div className="nav-title"> {nav.text} {nav.children && <img className="arrow-nav" src={process.env.PUBLIC_URL + "/img/arrow-nav.svg"} />}</div>
                            </NavLink>
                            {nav.children && <SubNavbar key={nav.id} items={nav.children} />}</li>
                    })
                }
            </ul>
        </div>
    </nav >
        <div className={menuMobileClass} id="mobile-menu">
            <ul id="mobile-menu-ul">

                {
                    Navs.map(nav => {
                        if (nav.children) return <SubNavbar key={nav.id} items={nav.children} />
                        if (nav.out) return <li key={nav.id}><a href={nav.path}> {nav.text} </a></li>
                        return <li key={nav.id}><NavLink onClick={toggleNav} exact={nav.exact} to={nav.path}> {nav.text} </NavLink></li>
                    })
                }
                <li className="icon-close" onClick={toggleNav}>
                    <div className="menu-title">Menu</div>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                        <path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z" />
                    </svg>
                </li>
            </ul>
        </div>
    </>);
}



export default Navbar;