import React from 'react';
import { getStayledNumber, notify } from '../../utils/utils';

const Title = ({ claimable_amount, web3 }) => {
    const isClaimBtn = web3 && claimable_amount && claimable_amount !== "" && claimable_amount !== "0" && claimable_amount !== 0
    const isMobile = window.innerWidth < 670

    console.log(claimable_amount);
    return (<>
        {isClaimBtn && isMobile && <div className="grad-wrap claimable-btn" onClick={() => web3.withdrawPayment(notify())}>
            <div className={`grad `}>
                <div> {getStayledNumber(claimable_amount)} ETH</div>
                <div>claim</div>
            </div>
        </div>
        }
        <div className="title">
            <img src={process.env.PUBLIC_URL + "/img/DEUSName.svg"} alt="DEUS" />
            <div className="swap-wrap">
                <div className="swap">
                    Swap
                            </div>
            </div>
        </div>
    </>);
}

export default Title;