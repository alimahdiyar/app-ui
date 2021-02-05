import React, { useState, useEffect, useMemo } from 'react';
import { getStayledNumber } from '../../utils/utils';
import { TokenType } from '../../config';
import { CopyToClipboard } from 'react-copy-to-clipboard';

const SearchAssets = (props) => {
    const [typingTimeout, setTypeout] = useState(0)
    const [currTokens, setCurrToken] = useState([])
    const [sortedList, setSortedList] = useState([])
    const { nAllStocks } = props

    const [query, setQuery] = useState("")
    const height = useState("500px")

    const { searchBoxType, showSearchBox, handleSearchBox, choosedToken, handleChangeToken } = props

    const arrToken = useMemo(() => {
        const tokens = nAllStocks && Object.entries(nAllStocks).map(obj => {
            const nObj = obj[1]
            nObj["id"] = obj[0]
            nObj["type"] = TokenType.Wrapped
            return nObj
        })
        return tokens
    }, [nAllStocks])

    useEffect(() => {
        if (searchBoxType === "to") {
            setSortedList(arrToken)
            setCurrToken(arrToken)
            setQuery("")
        } else {
            setSortedList(arrToken && arrToken.filter(t => t.conducted))
            setCurrToken(arrToken && arrToken.filter(t => t.conducted))
            setQuery("")
        }
    }, [searchBoxType, showSearchBox, nAllStocks])



    const handleTyping = (query) => {
        setQuery(query)
        if (typingTimeout) {
            clearTimeout(typingTimeout);
        }
        setTypeout(setTimeout(() => handleFilterToken(query), 1000))
    }

    const handleFilterToken = (query) => {
        const newTokens = sortedList.filter(token => {
            return token.symbol.toLowerCase().indexOf(query.toLowerCase()) !== -1 ||
                (token?.name && token?.name.toLowerCase().indexOf(query.toLowerCase()) !== -1)
        })
        setCurrToken(newTokens)
    }

    return (<>
        { showSearchBox && <div className="search-box-wrap" style={{ top: "50%" }}>
            <div className="search-box">
                <div className="label">
                    <p> </p>
                    <div onClick={() => handleSearchBox(false)}>close</div>
                </div>
                <input type="text" placeholder="Search symbol and name" spellCheck="false" autoComplete="off" value={query} onChange={(e) => handleTyping(e.currentTarget.value)} />
                <div className="token-items-wrap">
                    <div className="titles">
                        <p>Asset Name</p>
                        <p>Balance</p>
                    </div>
                    <div className="token-items" style={{ height: height }}  >
                        {
                            currTokens.map((token, i) => {
                                if (token.symbol === choosedToken) return <></>
                                return <div key={i} className="token-item" onClick={() => handleChangeToken(token)}>
                                    <div>
                                        {token.type !== TokenType.Wrapped && <img src={process.env.PUBLIC_URL + `${token?.logo}`} alt={token?.name} />}
                                        {token.type === TokenType.Wrapped && <div className={`wrap-stock-${token.conducted ? "" : "none-"}conduct`}><img src={process.env.PUBLIC_URL + `${token?.logo}`} style={{ marginLeft: "0px", marginRight: "0px" }} alt={token?.name} /></div>}
                                        <p>{token?.symbol}</p>
                                        <p style={{ marginLeft: "10px", fontSize: "11px", opacity: "0.5" }}>{token.name}</p>
                                    </div>
                                    {token.type !== TokenType.Main ? token.conducted ? <p>{getStayledNumber(token.short?.balance)}S
                                        <CopyToClipboard text={token.short?.address}
                                            onCopy={() => console.log("copied")}>
                                            <img className="copy-icon" src={process.env.PUBLIC_URL + "/img/copy.svg"} alt="" />

                                        </CopyToClipboard>
                                         / {getStayledNumber(token.long?.balance)}L
                                    <CopyToClipboard text={token.long?.address}
                                            onCopy={() => console.log("copied")}>
                                            <img className="copy-icon" src={process.env.PUBLIC_URL + "/img/copy.svg"} alt="" />

                                        </CopyToClipboard>
                                    </p> : <p>not conducted</p> :
                                        <p> {getStayledNumber(token?.balance)}</p>}
                                </div>
                            })
                        }
                    </div>
                </div>
            </div>

        </div>}
    </>);
}

export default SearchAssets;