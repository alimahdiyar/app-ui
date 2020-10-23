import React, { Component } from 'react'
import './conductr.scss'
import { Link } from 'react-router-dom';


class ConductrContainer extends Component {
    state = {}


    componentDidMount() {
        document.title = 'DEUS conductr';
    }

    render() {
        return (<div className="conductr-wrap">
            <div className="bg-conductr-wrap">
                <div className="bg-conductr ">
                    <div className="bg-left">
                        <img className="" src="img/right-conductr.svg" alt="" />
                    </div>
                    <div className="bg-right">
                        <img className="" src="img/right-conductr.svg" alt="" />
                    </div>
                </div>

                <div className="contr-btns">
                    <div className="connect">
                        Connected Wallet
                    </div>
                    <div className="learn-more-wrap">
                        <div className="learn-more">
                            Learn more
                        </div>
                    </div>
                </div>

                <div className="container">
                    <div className="pilot-wrap">
                        <div className="pilot">
                            <div className="title">
                                conduct<svg width="46" height="51" viewBox="0 0 46 51" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M1.08398 1.68756H32.7203C39.3478 1.68756 44.7203 7.06014 44.7203 13.6876V49.5001H1.08398V1.68756Z" stroke="url(#paint0_linear)" stroke-width="2" />
                                    <g clip-path="url(#clip0)">
                                        <path d="M29.8346 28.1417H10.1172V42.9861H13.4313V31.425H27.8433L34.1234 43L36.9919 41.3584L29.8346 28.1417Z" fill="white" />
                                        <path d="M34.9731 17.4987C34.9731 13.3668 31.5616 10 27.3841 10H9.99219V24.9418H27.3702C31.4919 24.9418 34.9731 21.5333 34.9731 17.4987ZM13.3063 21.6585V13.2833H27.3702C29.7235 13.2833 31.6451 15.1754 31.6451 17.4987C31.6451 19.7525 29.6817 21.6585 27.3702 21.6585H13.3063Z" fill="white" />
                                    </g>
                                    <defs>
                                        <linearGradient id="paint0_linear" x1="22.933" y1="-21.7956" x2="-24.5223" y2="21.9041" gradientUnits="userSpaceOnUse">
                                            <stop stop-color="#5EC4D6" />
                                            <stop offset="1" stop-color="#F1FC68" />
                                        </linearGradient>
                                        <clipPath id="clip0">
                                            <rect width="27" height="33" fill="white" transform="translate(9.99219 10)" />
                                        </clipPath>
                                    </defs>
                                </svg>

                            </div>
                            <div className="title-pilot">pilot</div>
                            <div className="btn-wrap">
                                <Link to="conductr/buy" className="buy"> <div className="btn-txt">Buy mirrored asset</div></Link>
                                <Link to="conductr/build" className="mirror"><div className="btn-txt" >Mirror an asset</div></Link>
                            </div>
                            <div className="create-text">Create your own Registrar with a few clicks</div>
                        </div>
                    </div>
                </div>

            </div>

        </div>);
    }
}

export default ConductrContainer;