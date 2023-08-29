import React from "react";
import walletPay from "../crypto-wallet-pay.png";
import { Button } from "antd";
import { useNavigate } from "react-router-dom";

function Home() {

  const navigate=useNavigate();

  return (
    <>
      <div className="content">
        <img src={walletPay} className="frontPageLogo" alt="wallet pay" />
        <h2>Namskar 🙏</h2>
        <h4 className="h4">Welcome to the web3 Digi wallet of India 👋</h4>
        <Button onClick={()=>{navigate("/create")}} className="frontPageButton" type="primary">Create Wallet</Button>
        <Button className="frontPageButton" onClick={()=>{navigate("/recover")}} type="default">Add wallet using Seed Phrase</Button>
      </div>
    </>
  );
}

export default Home;
