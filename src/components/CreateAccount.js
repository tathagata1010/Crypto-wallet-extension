import React, { useState } from "react";
import { Button, Card } from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { ethers } from "ethers";

function CreateAccount({setSeedPhrase,setWallet}) {
  const navigate = useNavigate();
  const [newSeedPhrase, setNewSeedPhrase] = useState(null);

  const generateWallet = () => {
    const mnemonic = ethers.Wallet.createRandom().mnemonic.phrase;
    console.log(mnemonic);
    setNewSeedPhrase(mnemonic);
  };

  const setWalletAndMnemonic = () => {
    setSeedPhrase(newSeedPhrase)
    localStorage.setItem('mnemonic', newSeedPhrase);
    console.log(ethers.Wallet.fromPhrase(newSeedPhrase).address);
    setWallet(ethers.Wallet.fromPhrase(newSeedPhrase).address);
    localStorage.setItem("Wallet Address", ethers.Wallet.fromPhrase(newSeedPhrase).address);
    navigate("/wallet");
  }

  return (
    <>
      <div className="content">
        <div className="mnemonic">
          <ExclamationCircleOutlined style={{ fontSize: "25px" }} />
          <div>
            Once you generate the seed phrase, save it securely in order to
            recover your wallet in the future.
          </div>
        </div>
        Create
        <Button
          className="frontPageButton"
          type="primary"
          onClick={() => generateWallet()}
        >
          Generate Seed phrase
        </Button>
        <Card className="seedPhraseContainer">
          {newSeedPhrase && (
            <pre style={{ whiteSpace: "pre-wrap" }}>{newSeedPhrase}</pre>
          )}
        </Card>
        <Button
          className="frontPageButton"
          type="default"
          onClick={() => setWalletAndMnemonic()}
        >
          Open your newly created wallet
        </Button>
      </div>
    </>
  );
}

export default CreateAccount;









// cargo lobster snack random pact faculty canal victory hybrid fun coral believe
// 0xbc6EADFAF7ad6FeB83A9dFE210849085C1B924D4
//9d8fb5f4af84e10f9fa269f89cac624bc094f1df53433fe1afb16ce3c77a67d2
