import React from "react";
import { BulbOutlined } from "@ant-design/icons";
import { Button, Input } from "antd";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { ethers } from "ethers";

const { TextArea } = Input;
function RecoverAccount({ setWallet, setSeedPhrase }) {
  const navigate = useNavigate();
  const [typedSeed, setTypedSeed] = useState("");
  const [isInvalid, setIsInvalid] = useState(false);
  const recoverWallet = () => {
    let recoveredWallet;
    try {
      recoveredWallet = ethers.Wallet.fromPhrase(typedSeed);
    }
    catch(err) {
      setIsInvalid(true);
      return
    }
    setSeedPhrase(typedSeed);
    setWallet(recoveredWallet.address);
    // localStorage.setItem('mnemonic', typedSeed);
    // localStorage.setItem("Wallet Address", recoveredWallet.address);
    navigate("/wallet");
  }
  const invalidSeed =
    typedSeed.split(" ").length !== 12 || typedSeed.slice(-1) === " ";
  return (
    <>
      <div className="content">
        <div className="mnemonic">
          <BulbOutlined style={{ fontSize: "18px" }} />
          <div>
            Type your seed phrase in the field below, it should consist of 12
            words with spaces in between them
          </div>
        </div>
        <TextArea
          rows={3}
          className="seedPhraseContainer"
          placeholder="Enter your seed phrase"
          onChange={(e) => {
            setTypedSeed(e.target.value);
            setIsInvalid(false);
          }}
        />
        {console.log(typedSeed)}
        <Button
          className="frontPageButton"
          type="primary"
          disabled={invalidSeed}
          onClick={recoverWallet}
          style={{
            background: invalidSeed ? "darkgray" : "",
            borderColor: invalidSeed ? "darkgray" : "",
            color: invalidSeed ? "#fff" : "",
          }}
        >
          Recover Wallet
        </Button>
        {isInvalid && <p style={{color: "red"}}> Please enter correct seed</p>}
      </div>
    </>
  );
}

export default RecoverAccount;
