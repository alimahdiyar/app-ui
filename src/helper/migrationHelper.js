import React from 'react';
import { MIGRATOR_ADDRESS } from "../constant/contracts"
import { getTransactionLink, ToastTransaction } from "../utils/explorers"
import { doSignTypedData, SendWithToast } from "./web3"
import axios from "axios"
import { isZero, ZERO } from "../constant/number"
import BigNumber from "bignumber.js"
import { getMigrationContract } from "./contractHelpers"
import { ChainId } from "../constant/web3"
import { TransactionState } from "../utils/constant"
import { ExternalLink } from "../components/App/Link"

const NameChainId = {
    1: 'ETH Mainnet',
    4: 'Rinkeby',
    137: 'Polygon Mainnet'
}

export const BASE_URL = 'https://oracle5.deus.finance/migrator' //Main
export const BASE_URL2 = 'https://oracle5.deus.finance/migrator2' //Main

export const migrateTX = async (results, migrationOption, account, chainId, web3) => {
    const migrationContract = getMigrationContract(web3, chainId)
    const amounts = results[0].amount
    const expireBlocks = results.map(result => result.expireBlock)
    const signatures = results.map(result => result.signature)
    let migrationStatus = ""
    for (var i = 0; i < migrationOption.length; i++) {
        migrationStatus += migrationOption.charAt(i) === "0" ? "0" : "1"
    }
    migrationStatus = parseInt(migrationStatus, 2).toString()
    console.log(amounts.map(t => t.toString()),
        expireBlocks,
        migrationStatus,
        signatures);

    const fn = migrationContract
        .methods
        .migrate(
            amounts.map(amount => new BigNumber(amount).toFixed()),
            expireBlocks,
            migrationStatus,
            signatures
        )

    return SendWithToast(fn, { from: account }, chainId, "Migrate to " + NameChainId[chainId])
}

export const signMsg = async (requestIds, migrateOption, time, account, chainId, web3) => {
    let eip712TypedData = {
        types: {
            EIP712Domain: [
                { name: "name", type: "string" },
                { name: "chainId", type: "uint256" },
                { "name": 'version', "type": 'string' },
                { "name": "verifyingContract", "type": "address" }
            ],
            Message: [
                { name: "from", type: "address" },
                { name: "requestIds", type: "string" },
                { name: "migrateOption", type: "string" },
                { name: "contents", type: "string" },
                { name: "timeStamp", type: "uint256" }
            ]
        },
        primaryType: "Message",
        domain: {
            name: "Deus Migrate",
            chainId: chainId,
            version: "1",
            verifyingContract: MIGRATOR_ADDRESS[chainId],
        },
        message: {
            from: account,
            requestIds: requestIds,
            migrateOption: migrateOption,
            timeStamp: time,
            contents: `I'm a user with Wallet address ${account} intending to migrate to ${NameChainId[chainId]} network.`,
        },
    }

    console.log(eip712TypedData);
    let dataToSign = JSON.stringify(eip712TypedData)
    return doSignTypedData(time, dataToSign, account, web3)
}

export const getMigrationOption = (migratedList) => {
    let option = ""
    for (let i = 0; i < 6; i++) {
        option += migratedList[i] ? migratedList[i].index : "0"
    }
    return option
}


export const getRandomNumber = async (account, url) => {
    const data = { address: account }
    try {
        const output = await axios.post(url + "/getRandom", data)
        return output.data.randomNumber
    } catch (error) {
        console.log("getRandom failed ", error.response.data);
    }
}

export const doMigration = async (requestIds, migrateOption, timeStamp, account, chainId, validChainId = 1, web3, callback) => {

    // if (validChainId !== chainId) return


    const signature = await signMsg(requestIds, migrateOption, timeStamp, account, validChainId, web3)

    if (!signature) {
        ToastTransaction("warn", "Failed to sign", "", { autoClose: true })
        return
    } else {
        console.log("signature is ", signature);
    }

    let data = {
        requestIds,
        address: account,
        signature,
        chainId: `${validChainId}`,
        migrateOption,
        timeStamp
    }

    try {
        console.log(data);
        const output = await axios.post(BASE_URL + "/migrate", data)
        const oracleResult = output.data
        console.log(oracleResult);

        if (oracleResult.message) {
            ToastTransaction("warn", "Migration Failed", oracleResult.message, { autoClose: true })
            return
        }

        const output2 = await axios.post(BASE_URL2 + "/migrate", data)
        const oracleResult2 = output2.data
        console.log(oracleResult2);


        if (validChainId === ChainId.MATIC) {
            ToastTransaction(TransactionState.SUCCESS, "Migration started", <div>Please allow a few minutes for your new tokens to reflect on the destination chain <ExternalLink href={getTransactionLink(ChainId.MATIC, oracleResult2, "transaction")}> View on explorer</ExternalLink> </div>, { autoClose: true })
            return
            // web3.getTransactionReceipt(oracleResult2).then(receipt => {
            //     console.log(receipt);
            //     console.log(receipt.status);
            // })
            // return
        }
        const tx = await migrateTX([oracleResult, oracleResult2], migrateOption, account, chainId, web3)
        console.log(tx);
        // if (!oracleResult.success) {
        //     const errorMessage = oracleResult.error.message ? oracleResult.error.message : oracleResult.error ? oracleResult.error : ""
        //     ToastTransaction("warn", "MIGRATION FAILED", errorMessage, { autoClose: true })
        //     return
        // }

        // const { result } = oracleResult
        // console.log(result);

        // const tx = await deposit(
        //     fromCurrency,
        //     toCurrency,
        //     amountIn,
        //     amountOut,
        //     result.data.result,
        //     result.cid,
        //     result.signatures,
        //     account,
        //     validChainId,
        //     web3
        // )
        // callback(tx)
    } catch (error) {
        // callback({ status: false })
        console.log(error);
        if (error.response.data.message) {
            ToastTransaction("warn", "Migration Failed", error.response.data.message, { autoClose: true })
        }
        console.log("getTx failed ", error.response.data);
    }
}

// DD_TO_DEUS = Decimal(2)
// DU_TO_DEUS = Decimal(10 / 27)
// DE_TO_DEUS = Decimal(10 / 48)
// DEUS_TO_DEUS_DEI_LP = Decimal(1 / 2)
// OLD_DEUS_TO_DEUS = Decimal(20)
// SDU_TO_DU = Decimal(1 / 1e5)

export const convertRate = (tokens) => {
    let { from, to } = tokens

    const V1_PER_DEUS_RATE = {
        "DEA": 1,
        "sDEA": 1,
        "DEUS": 0.05,
        "sDEUS": 0.05,
        "sUNI-DD": 0.5,
        "sUNI-DE": 4.8,
        "sUNI-DU": 0.000027,
        "BPT": 0,
        "Uni-DEUS/DEA": 0.5,
        "Uni-DEA/USDC": 2.7,
        "Uni-DEUS/ETH": 4.8,
    }

    const V2_PER_DEUS_RATE = {
        "DEUS": 1,
        "DEUS/DEI LP": 2,
    }

    // let totalBalanceInDEA = ZERO

    // for (let i = 0; i < from.length; i++) {
    //     const adder = new BigNumber(from[i].balance).times(V1_PER_DEUS_RATE[from[i].symbol])
    //     totalBalanceInDEA = totalBalanceInDEA.plus(adder)
    // }

    // if (from.length === 4 && !isZero(from[3].balance)) {
    //     const DEA_balance_from_BPT_to_DEA = new BigNumber(from[3].DEA_balance_from_BPT).times(V1_PER_DEUS_RATE["DEA"])
    //     const DEA_balance_from_BPT_to_SDEA = new BigNumber(from[3].SDEA_balance_from_BPT).times(V1_PER_DEUS_RATE["sDEA"])
    //     const sUniDD_balance_from_BPT_to_DEA = new BigNumber(from[3].sUniDD_balance_from_BPT).times(V1_PER_DEUS_RATE["sUNI-DD"])
    //     const sUniDE_balance_from_BPT_to_DEA = new BigNumber(from[3].sUniDE_balance_from_BPT).times(V1_PER_DEUS_RATE["sUNI-DE"])
    //     const sUniDU_balance_from_BPT_to_DEA = new BigNumber(from[3].sUniDU_balance_from_BPT).times(V1_PER_DEUS_RATE["sUNI-DU"])
    //     const SDEUS_balance_from_BPT_to_DEA = new BigNumber(from[3].SDEUS_balance_from_BPT).times(V1_PER_DEUS_RATE["sDEUS"])

    //     totalBalanceInDEA = totalBalanceInDEA
    //         .plus(DEA_balance_from_BPT_to_DEA)
    //         .plus(DEA_balance_from_BPT_to_SDEA)
    //         .plus(sUniDD_balance_from_BPT_to_DEA)
    //         .plus(sUniDE_balance_from_BPT_to_DEA)
    //         .plus(sUniDU_balance_from_BPT_to_DEA)
    //         .plus(SDEUS_balance_from_BPT_to_DEA)
    // }

    // for (let i = 0; i < to.length; i++) {
    //     to[i].amount = totalBalanceInDEA.div(V2_PER_DEUS_RATE[to[i].symbol]).toFixed()
    // }

    return { from, to }
}