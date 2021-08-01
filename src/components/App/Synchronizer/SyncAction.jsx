import { useWeb3React } from '@web3-react/core';
import React from 'react';
import styled from 'styled-components'
import { ButtonSyncDeactivated, ButtonSyncActive } from '../Button';
import { FlexCenter } from '../Container';
// import Loader from '../Loader';



const errors = {
    NotConnected: "CONNECT WALLET",
    WrongNetwork: "WRONG NETWORK",
    EMPTY: "ENTER AMOUNT",
}


const WrapActions = styled.div`
    margin-top:${({ mt }) => mt || "33px"};
    height: 55px;
    display:flex;
    font-size:20px;
    font-family:"Monument Grotesk Semi";
    & > button {
        margin:0px 5px;
    }
`
const ButtonSwap = styled(ButtonSyncActive)`
  background: ${({ theme }) => theme.grad1};
  color: ${({ theme }) => theme.text1};
  font-size:25px;
`
const WrapStep = styled(FlexCenter)`
margin-top:10px;
`

const CycleNumber = styled(FlexCenter)`
width:20px;
height:20px;
border-radius:20px;
background: ${({ theme, active }) => active ? theme.grad1 : theme.border1};
color: ${({ theme, active }) => active ? theme.text1 : theme.text1};
z-index: 0;
font-size:12px;
margin:0 -1px;
`
const Line = styled.div`
background: ${({ theme }) => theme.grad1} ;
height: 2px;
width: 50%;
`
const SyncAction = ({ isPreApproved, validNetworks = [], fromCurrency, toCurrency, mt }) => {

    const { account, chainId } = useWeb3React()
    const [showWallets, setShowWallets] = useState(false)

    const checkError = () => {
        if (chainId && validNetworks.indexOf(chainId) === -1) return errors.WrongNetwork
        return null;
    }



    if (!account) {
        return <WrapActions>
            <Wallets showWallets={showWallets} setShowWallets={setShowWallets} />
            <ButtonSwap bgColor={bgColor} active={true} onClick={() => setShowWallets(true)}>
                CONNECT WALLET
            </ButtonSwap>
        </WrapActions>
    }


    if (checkError()) {
        return <ButtonSyncDeactivated mt={mt}>{checkError()}</ButtonSyncDeactivated>
    }




    return (<>
        {isPreApproved ? <WrapActions mt={mt}><ButtonSwap active={true} > SYNC</ButtonSwap> </WrapActions> : <>
            <WrapActions mt={mt}>
                <ButtonSwap active={true} >
                    APPROVE
                </ButtonSwap>
                <ButtonSyncDeactivated>SYNC (BUY)</ButtonSyncDeactivated>
            </WrapActions>
            <WrapStep>
                <CycleNumber active={true}>1</CycleNumber>
                <Line></Line>
                <CycleNumber active={false}>2</CycleNumber>
            </WrapStep>
        </>
        }
    </>);
}

export default SyncAction;