import { useState } from "react";
import "./App.css";
import logo from "./ewallet.png";
import { Select } from "antd";
import Home from "./components/Home";
import CreateAccount from "./components/CreateAccount";
import WalletView from "./components/WalletView";
import RecoverAccount from "./components/RecoverAccount";
import { Routes, Route, useNavigate } from "react-router-dom";

function App() {
  const [selectedChain, setSelectedChain] = useState("0x1");
  const [wallet, setWallet] = useState(null);
  const [seedPhrase, setSeedPhrase] = useState("0x1");
  const navigate = useNavigate();
  const goToHome = () => {
    navigate("/");
  };

  return (
    <div className="App">
      <header>
        <img src={logo} onClick={goToHome} className="headerLogo" alt="logo" />
        <Select
          className="dropdown custom-select"
          value={selectedChain}
          onChange={(value) => setSelectedChain(value)}
          dropdownStyle={{ backgroundColor: "#fff", borderRadius: "20px" }}
          // selectorStyle={{ color: "#b8b8b8", borderRadius: "20px" }}
          options={[
            {
              label: "Ethereum Mainnet",
              value: "0x1",
            },
            {
              label: "Polygon Mainnet",
              value: "0x89",
            },
            {
              label: "Sepolia",
              value: "0xaa36a7",
            },
            {
              label: "Avalanche",
              value: "0xa86a",
            },
            {
              label: "Mumbai Testnet",
              value: "0x13881",
            },
            {
              label: "Arbitrum",
              value: "0xa4b1",
            },
          ]}
        ></Select>
      </header>
      {wallet && seedPhrase ? (
        <Routes>
          <Route
            path="/wallet"
            element={
              <WalletView
                wallet={wallet}
                setWallet={setWallet}
                seedPhrase={seedPhrase}
                setSeedPhrase={setSeedPhrase}
                selectedChain={selectedChain}
              />
            }
          />
        </Routes>
      ) : (
        <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path="/create"
            element={
              <CreateAccount
                setSeedPhrase={setSeedPhrase}
                setWallet={setWallet}
              />
            }
          />
          <Route
            path="/recover"
            element={
              <RecoverAccount
                setSeedPhrase={setSeedPhrase}
                setWallet={setWallet}
              />
            }
          />
        </Routes>
      )}
    </div>
    // </Resizeable>
  );
}

export default App;
