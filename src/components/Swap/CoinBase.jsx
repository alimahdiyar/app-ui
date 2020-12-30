import React, { Component } from 'react';
import PriceBox from './PriceBox';
import TokenBox from './TokenBox';
import SearchBox from './SearchBox';
import TokenMarket from './TokenMarket';
import Title from './Title';
import SwapButton from './SwapButton';
import { ToastContainer } from 'react-toastify';
import { SwapService } from '../../services/SwapService';
import { getStayledNumber, notify, formatBalance, checkLimit, setBackground } from '../../utils/utils';
import Slippage from './Slippage';
import Routes from './Routes';
import Risk from './Popups/Risk';
import './mainSwap.scss';


class CoinBase extends Component {
    state = {
        tokens: ["eth", "deus", "dea", "dai", "wbtc", "usdc", "coinbase"],
        web3: null,
        tokensMap: {},
        swap: {
            from: {
                name: "", pic_name: "", price: "", balance: "", amount: ""
            },
            to: {
                name: "", pic_name: "", price: "", balance: "", amount: ""
            }
        },
        showSearchBox: false,
        searchBoxType: "from",
        fromPerTo: false,
        showRiskPupop: false,
        claimable_amount: null,
        typingTimeout: 0,
        typeTransaction: "",
        toAmount: "",
        fromAmount: "",
        slippageAmount: 0.1
    }


    methods = {
        onStart: () => {

        },
        onSuccess: () => {
            const { swap, typeTransaction } = this.state
            if (typeTransaction === "approve") {
                this.getSingleAllowances(swap.from.name, true)
                this.setState({ typeTransaction: "" })
            } else {
                this.getSingleBalance(swap.to.name, true)
                this.getSingleBalance(swap.from.name, true)
            }

        },
        onError: () => console.log("onError"),
    }

    newService = null;

    async componentDidMount() {
        document.body.style.backgroundColor = '#2c2f36'
        document.body.style.backgroundImage = 'radial-gradient(50% 50% at 50% 50%, #5c5c5c61 0%, #000000 100%)'
        const { chainId, account } = this.props
        const { swap } = this.state
        this.handleInitToken("from", "eth")
        this.handleInitToken("to", "coinbase")

        const payload = {
            popup: this.handleRiskPopup
        }
        if (checkLimit(swap, payload)) {
            return
        }

        if (!chainId || !account) return

        await this.setState({ web3: new SwapService(account, chainId) })
        await this.handleIinitBalances()
        await this.getClaimable()
        await this.handleInitAllowances()

    }

    async componentDidUpdate(prevProps) {

        const { chainId, account } = this.props

        if (prevProps.account !== account || prevProps.chainId !== chainId) {


            if (!chainId || !account) return


            await this.setState({ web3: new SwapService(account, chainId) })
            await this.handleIinitBalances(true)
            await this.getClaimable()
            await this.handleInitAllowances(true)

            this.handleInitToken("from", "eth")
            this.handleInitToken("to", "coinbase")
        }
    }

    getClaimable = async () => {
        const { web3 } = this.state
        if (!web3) return
        try {
            const amount = await web3.getWithdrawableAmount()
            this.setState({ claimable_amount: amount })
            return amount
        } catch (error) {
            return 0
        }
    }


    handleTokensToMap = () => {
        const { tokens, tokensMap } = this.state
        for (let i = 0; i < tokens.length; i++) {
            tokensMap[tokens[i].name] = tokens[i]
        }
        this.setState({ tokensMap })
    }

    handleInitToken = (type, tokenName, amount = "") => {
        const { swap } = this.state
        const { allTokens } = this.props
        const tk = allTokens[tokenName]
        swap[type] = { ...tk, amount: amount }
        this.setState({ swap, toAmount: "", fromAmount: "" })
    }

    getToken = (tokenName) => this.state.tokens.find(t => t.name === tokenName)

    handleChangeType = () => {
        const { swap } = this.state
        const { from, to } = swap
        from.amount = ""
        to.amount = ""
        swap.from = to
        swap.to = from
        this.setState({ swap, toAmount: "", fromAmount: "" })
        this.handleSwichPerPrice()
    }

    handleSwichPerPrice = () => {
        const { fromPerTo } = this.state
        this.setState({ fromPerTo: !fromPerTo })
    }

    handleTokenInputChange = (stype, amount) => {
        this.handleTyping()

        const { swap } = this.state

        if (amount === "") {
            swap.from.amount = ""
            swap.to.amount = ""
            this.setState({ swap, toAmount: "", fromAmount: "" })
            return
        }
        if (amount === "00") {
            swap.from.amount = "0"
            swap.to.amount = "0"
            this.setState({ swap })
            return
        }

        swap[stype].amount = amount

        this.setState({
            typingTimeout: setTimeout(() => {
                this.handleCalcPairPrice(stype, amount)

                this.setState({ swap })
            }, 500)
        })

        this.setState({ swap })
    }


    handleSlippage = (amount) => {
        this.setState({ slippageAmount: amount })
    }


    handleTyping = () => {
        if (this.state.typingTimeout) {
            clearTimeout(this.state.typingTimeout);
        }
    }

    handleCalcPairPrice = async (searchBoxType, amount) => {
        const { swap, web3 } = this.state
        if (!web3) return

        const vstype = searchBoxType === "from" ? "to" : "from"

        if (parseFloat(swap[searchBoxType].amount) === 0) {
            swap[vstype].amount = "0"
            this.setState({ swap })
            return
        }


        try {
            const data = searchBoxType === "from" ? await web3.getAmountsOut(swap.from.name, swap.to.name, amount) : await web3.getAmountsIn(swap.from.name, swap.to.name, amount)
            swap[vstype].amount = getStayledNumber(data, 9)
            this.setState({
                swap,
                fromAmount: swap.from.amount,
                toAmount: swap.to.amount
            })
        } catch (error) {
            console.log(error);
            this.setState({ swap })
        }
    }

    handleSearchBox = (flag, type = "from") => {
        this.setState({ showSearchBox: flag, searchBoxType: type })
    }

    handleIinitBalances = async (foceUpdate) => {
        const { tokens } = this.state

        tokens.map(async (t) => {
            try {
                this.getSingleBalance(t, foceUpdate)
            } catch (error) {
                console.log(error);
            }
        })

    }


    getSingleBalance = async (tokenName, force = false) => {
        const { swap, web3 } = this.state
        if (!web3) return
        const { allTokens, setAllTokens } = this.props

        if (force || !allTokens[tokenName].lastFetchBalance) {
            try {
                const data = await web3.getTokenBalance(tokenName)
                const balance = formatBalance(data)
                allTokens[tokenName].balance = parseFloat(balance)
                allTokens[tokenName].lastFetchBalance = true
                if (tokenName === swap.to.name || tokenName === swap.from.name) {
                    this.handleInitToken("from", swap.from.name)
                    this.handleInitToken("to", swap.to.name)
                }
            } catch (error) {
                console.log(error);
            }
            setAllTokens(allTokens)
        } else {
            // console.log("fetched balance");
        }
    }



    handleInitAllowances = async (foceUpdate) => {
        const { tokens } = this.state

        tokens.map(async (t) => {
            try {
                this.getSingleAllowances(t, foceUpdate)
            } catch (error) {
                console.log(error);
            }
        })
    }


    getSingleAllowances = async (tokenName, force = false) => {
        const { swap, web3 } = this.state

        if (!web3) return

        const { allTokens, setAllTokens } = this.props

        if (force || !allTokens[tokenName].lastFechAllowance) {
            try {
                const allowances = await web3.getAllowances(tokenName)
                allTokens[tokenName].allowances = parseInt(allowances)
                allTokens[tokenName].lastFechAllowance = true
                if (tokenName === swap.from.name || tokenName === swap.to.name) {
                    this.handleInitToken("from", swap.from.name, swap.from.amount)
                    this.handleInitToken("to", swap.to.name, swap.to.amount)
                }
                setAllTokens(allTokens)

            } catch (error) {
                console.log(error);
            }
        }

    }


    handleChangeToken = (tokenName) => {
        const { searchBoxType, swap } = this.state
        const vstype = searchBoxType === "from" ? "to" : "from"

        if (swap[vstype].name === tokenName) {
            const tmp = swap[searchBoxType].name
            this.handleInitToken(vstype, tmp)
        } else {
            const tmp = swap[vstype].name
            this.handleInitToken(vstype, tmp)
        }
        this.handleInitToken(searchBoxType, tokenName)
        this.handleSearchBox(false)
    }

    handleFilterToken = () => {
        const { searchBoxType, tokens, swap } = this.state
        return tokens.filter(t => swap[searchBoxType].name !== t.name)
    }

    isApproved = () => {
        const { swap } = this.state
        return swap.from.allowances > 0
    }

    handleSwap = async () => {
        const { swap, web3 } = this.state
        if (!web3) return


        const { from, to } = swap
        try {
            !(swap.from.allowances > 0) ?
                this.handleApprove(swap) :
                await web3.swapTokens(from.name, to.name, from.amount, notify(this.methods))
        } catch (error) {

        }
    }


    handleApprove = async (swap) => {
        const { web3 } = this.state

        try {
            this.setState({ typeTransaction: "approve" })
            const data = await web3.approve(swap.from.name, swap.from.amount, notify(this.methods))
            return data
        } catch (error) {
            console.log(error);
        }
        return 0
    }

    handleRiskPopup = (flag) => {
        if (flag) {
            setBackground("dark")
        } else {
            setBackground("light")
        }
        this.setState({ showRiskPupop: flag })
    }




    render() {

        const { showSearchBox, showRiskPupop, slippageAmount, swap, fromPerTo, toAmount, fromAmount, searchBoxType, tokens, web3, claimable_amount } = this.state
        const { allTokens } = this.props
        const from_token = swap.from
        const to_token = swap.to
        const approved = this.isApproved()
        const isMobile = window.innerWidth < 670
        const { chainId } = this.props

        return (<div className="deus-swap-wrap">
            {showRiskPupop && < Risk handleRiskPopup={this.handleRiskPopup} />}
            {!isMobile && <ToastContainer style={{ width: "450px" }} />}
            <Title web3={web3} claimable_amount={claimable_amount} isCoinbase={true} />


            <div className="swap-container-wrap">
                <div className="swap-container">
                    <div className="swap-box-wrap">
                        <div className="swap-box">

                            <TokenBox type="from" token={from_token}
                                estimated=" "

                                handleSearchBox={this.handleSearchBox}
                                handleTokenInputChange={this.handleTokenInputChange}
                            />

                            <img
                                onClick={this.handleChangeType}
                                src={process.env.PUBLIC_URL + "/img/arrow.svg"}
                                alt="arrow"
                                className="arrow" />

                            <TokenBox type="to" token={to_token}
                                estimated=" (estimated)"

                                handleSearchBox={this.handleSearchBox}
                                handleTokenInputChange={this.handleTokenInputChange}
                            />


                            <TokenMarket
                                handleSwich={this.handleSwichPerPrice}
                                swap={swap}
                                toAmount={toAmount}
                                fromAmount={fromAmount}
                                fromPerTo={fromPerTo}
                                perPrice={""}
                                tvl={""}
                                tradeVol={""} />

                            <SwapButton handleSwap={this.handleSwap} token={swap.from} approved={approved} web3={web3} isMobile={isMobile} />
                        </div>

                        {/* <PriceBox impact={""} vaultsFee={""} /> */}

                        <SearchBox
                            showSearchBox={showSearchBox}
                            choosedToken={swap[searchBoxType].name}
                            handleSearchBox={this.handleSearchBox}
                            allTokens={allTokens}
                            tokens={tokens}
                            handleFilterToken={this.state.tokensMap}
                            handleChangeToken={this.handleChangeToken}
                        />
                        {from_token.name &&
                            to_token &&
                            <Routes from={from_token} to={to_token} chainId={chainId}
                            />}


                        {/*    {(from_token.name === "coinbase" ||
                            to_token.name === "coinbase") &&
                            <Slippage
                                slippage={slippageAmount}
                                setSlippage={this.handleSlippage}
                            />} */}

                        <p className="ipo"> trade the IPO before anyone else</p>
                    </div>
                </div>
            </div>
        </div>);
    }
}


export default CoinBase;