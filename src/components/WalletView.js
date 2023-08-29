import React, { useState, useEffect } from "react";
import {
  Divider,
  Tooltip,
  List,
  Avatar,
  Spin,
  Tabs,
  Input,
  Button,
} from "antd";
import { LogoutOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import logo from "../noImg.png";
import axios from "axios";
import { CHAINS_CONFIG } from "../chains";
import {ethers} from "ethers";


function WalletView({
  wallet,
  setWallet,
  seedPhrase,
  setSeedPhrase,
  selectedChain,
}) {
  const navigate = useNavigate();
  const [tokens, setTokens] = useState(null);
  const [nfts, setNfts] = useState(null);
  const [balance, setBalance] = useState(0);
  const [fetching, setFetching] = useState(false);
  const [toAddress, setToAddress] = useState(null);
  const [amountToSend, setAmountToSend] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [hash,setHash] = useState(null);

  useEffect(() => {
    if (!wallet && !selectedChain)
      return;
    console.log("all");
    setTokens(null);
    setNfts(null);
    setBalance(0);
    getWalletHoldings();
  }, [])
  useEffect(() => {
    if (!wallet)
      return;

    console.log("chain");
    setTokens(null);
    setNfts(null);
    setBalance(0);
    getWalletHoldings();
  }, [selectedChain])


  const getWalletHoldings = async () => {
    setFetching(true);

    const response = await axios.get("http://localhost:3002/getWalletHoldings", {
      params: {
        userAddress: wallet,
        chain: selectedChain
      }
    })

    const resp = response.data;

    if (resp.tokens.length > 0) {
      setTokens(resp.tokens);
    }

    if (resp.nfts.length > 0) {
      setNfts(resp.nfts);
    }

    if (resp.walletBalance > 0) {
      setBalance(resp.walletBalance);
    }
    setFetching(false);
  }

  const items = [
    {
      key: "3",
      label: `Tokens`,
      children: <>{tokens ?
        (<>
          <List bordered itemLayout="horizontal" dataSource={tokens}
            style={{ color: " rgb(213, 230, 247)" }}
            overflow="auto"
            renderItem={(item, index) =>
              <List.Item style={{ textAlign: "left", color: " rgb(213, 230, 247)", borderBlockColor: "rgb(213, 230, 247)" }}>
                <List.Item.Meta
                  avatar={<Avatar style={{ background: "#fff" }} src={item.logo || logo} />}
                  description={<span style={{ color: " rgb(213, 230, 247)" }}>{item.name}</span>}
                  title={<span style={{ color: " rgb(213, 230, 247)" }}>{item.symbol}</span>}
                />
                <div>
                  {(Number(item.balance) / 10 ** Number(item.decimals)).toFixed(2)}{""} Tokens
                </div>
              </List.Item>
            }
          />
        </>)
        : (<>
          <span>No Tokens</span>
        </>)
      }</>,
    },
    {
      key: "2",
      label: `NFTs`,
      children: (<>{nfts ? (<>{nfts.map((image, index) => {
        return (
          <>
            {
              image && <img src={image} key={index} className="nftIamge" alt="nftIamge" />
            }
          </>
        )
      })}</>) : (<><span>You seem to have no NFTs</span></>)}</>),
    },
    {
      key: "1",
      label: `Transfer`,
      children: (<><h3>Native Balance</h3>
        <h1>{balance.toFixed(6)} {CHAINS_CONFIG[selectedChain].ticker}</h1>
        <div className="sendRow">
          <p style={{ width: "90px", textAlign: "left", color: "white" }}>To:</p >
          <Input
          value={toAddress}
           onChange={(e) => setToAddress (e.target.value)} 
            placeholder="0x..." />
        </ div>
        <div className="sendRow">
          <p style={{ width: "90px", textAlign: "left", color: "white" }}> Amount:</p >
          <Input
          value={amountToSend} 
          onChange={(e) => setAmountToSend (e.target.value)}
            placeholder="Amount you want to send" />
        </ div>
        <Button
          style={{ width: "100%", marginTop: "20px", marginBottom: "20px" }}
          type="primary"
          onClick={() =>sendTransaction(toAddress,amountToSend)}
        >
         Send Tokens 
        </Button>
        {
          processing && (
            <>
            <Spin />
            {
                hash && (
                  <Tooltip title={hash}>
                    <p>  Hover to check the transaction hash </p>
                  </Tooltip>
             )
            }
              </>
          )

        }
      </>),
    },
  ];

  const sendTransaction = async (toAddress, amountToSend) => {
    const chain = CHAINS_CONFIG[selectedChain];
    const provider = new ethers.JsonRpcProvider(chain.rpcUrl);
    const privateKey = ethers.Wallet.fromPhrase(seedPhrase).privateKey;
    const wallet = new ethers.Wallet(privateKey, provider);

    const tx = {
      to: toAddress,
      value: ethers.parseEther(amountToSend.toString())
    };
  
    setProcessing(true);

    try {
      
      const transaction = wallet.sendTransaction(tx);
      setHash(transaction.hash);
      const receipt = await transaction.wait();
      
      setHash(null);
      setAmountToSend(null);
      setToAddress(null);
      setProcessing(false);

      if (receipt.status == 1) {
        getWalletHoldings();
      }
      else {
        console.log("Error doing the Transaction")
      }

    } catch (error) {
      setHash(null);
      setProcessing(false);
      setAmountToSend(null);
      setToAddress(null);
    }

  }

  const logout = () => {
    setSeedPhrase(null);
    setWallet(null);
    setTokens(null);
    setNfts(null);
    setBalance(0);
    // localStorage.removeItem('mnemonic');
    // localStorage.removeItem('Wallet Address');
    navigate("/");
  };

  return (
    <>
      <div className="content">
        <div className="logoutButton" onClick={logout}>
          <LogoutOutlined />
        </div>
        <div className="walletName">Wallet</div>
        <Tooltip trigger={"hover"} title={wallet}>
          <div>
            {wallet.slice(0, 4)}...{wallet.slice(38)}
          </div>
        </Tooltip>
        <Divider style={{ backgroundColor: "#fff" }} />

        {
          fetching ?
            <Spin />
            :
            <Tabs
              defaultActiveKey="1" items={items}
              tabBarStyle={{ background: "#333", borderBlockColor: "#333", borderRadius: "20px" }}
              className="walletView"
            />
        }
      </div>
      <Button type="link" onClick={() => getWalletHoldings()}>Refresh List</Button>
    </>
  );
}

export default WalletView;
//near pink zoo junior genius hover couch lady thing exile mask afraid