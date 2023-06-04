import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { Connection, PublicKey, clusterApiUrl, LAMPORTS_PER_SOL } from '@solana/web3.js';

const SOLANA_NETWORK = 'testnet';

const Home = () => {
  const [publicKey, setPublicKey] = useState(null);
  const [balance, setBalance] = useState(null);
  const [usdBalance, setUsdBalance] = useState(null);
  const [portfolio, setPortfolio] = useState([]);

  useEffect(() => {
    const storedPublicKey = window.localStorage.getItem('publicKey');
    if (storedPublicKey) {
      setPublicKey(storedPublicKey);
      getBalance(storedPublicKey);
      obtenerPortfolio(storedPublicKey);
    }
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();
    const walletKey = event.target.wallet.value;
    setPublicKey(walletKey);
    getBalance(walletKey);
    obtenerPortfolio(walletKey);
  };

  const handleConnect = async () => {
    const provider = window?.phantom?.solana;
    const { solana } = window;

    if (!provider?.isPhantom || !solana?.isPhantom) {
      toast.error('Phantom no está instalado');
      setTimeout(() => {
        window.open('https://phantom.app/', '_blank');
      }, 2000);
      return;
    }

    let phantom;
    if (provider?.isPhantom) phantom = provider;

    try {
      const { publicKey } = await phantom.connect();
      setPublicKey(publicKey.toString());
      window.localStorage.setItem('publicKey', publicKey.toString());
      toast.success('Tu wallet está conectada');
      getBalance(publicKey.toString());
      obtenerPortfolio(publicKey.toString());
    } catch (error) {
      console.error('ERROR AL CONECTAR WALLET', error);
      toast.error('No se pudo conectar a tu wallet');
    }
  };

  const obtenerPortfolio = async (walletKey) => {
    try {
      // Aquí debes utilizar la biblioteca o API correspondiente para obtener el portfolio
      // Por ejemplo:
      const portfolio = await obtenerPortfolioAPI(walletKey);
      setPortfolio(portfolio);
      console.log('Portfolio:', portfolio);
      // Procesar y utilizar los datos del portfolio según tus necesidades
    } catch (error) {
      console.error('Error al obtener el portfolio:', error);
    }
  };

  const obtenerPortfolioAPI = async (walletKey) => {
    // Aquí realiza la lógica para obtener el portfolio utilizando una API externa o biblioteca correspondiente
    // Retorna el resultado del portfolio obtenido
    return []; // Ejemplo: Retornando una lista vacía por defecto
  };

  const getBalance = async (walletKey) => {
    try {
      const connection = new Connection(clusterApiUrl(SOLANA_NETWORK), 'confirmed');
      const walletPublicKey = new PublicKey(walletKey);
      const balance = await connection.getBalance(walletPublicKey);
      const balanceInSol = balance / LAMPORTS_PER_SOL;
      setBalance(balanceInSol);

      const response = await fetch(
        'https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd'
      );
      const data = await response.json();
      const solUsdPrice = data?.solana?.usd;
      const balanceInUsd = balanceInSol * solUsdPrice;
      setUsdBalance(balanceInUsd);
    } catch (error) {
      console.error('ERROR AL OBTENER BALANCE', error);
      toast.error('Ocurrió un error al obtener el balance');
    }
  };

  const disconnectWallet = () => {
    setPublicKey(null);
    setBalance(null);
    setUsdBalance(null);
    setPortfolio([]);
    window.localStorage.removeItem('publicKey');
    toast.success('Tu wallet ha sido desconectada');
  };

  return (
    <>
      <h1>Buscar balance de wallet</h1>

      {publicKey ? (
        <div className="container">
          <h2>Resultado: {publicKey.length > 10 ? publicKey.substring(0, 10) + '...' : publicKey}</h2>
          <p>
            Balance: {balance} SOL (${usdBalance})
          </p>

          <h3>Portafolio:</h3>
          {portfolio.length > 0 ? (
            <table className="portfolio-table">
              <thead>
                <tr>
                  <th>Token</th>
                  <th>Amount</th>
                </tr>
              </thead>
              <tbody>
                {portfolio.map((item, index) => (
                  <tr key={index}>
                    <td>{item.token}</td>
                    <td>{item.amount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No se encontró ningún token en el portafolio</p>
          )}

          <button onClick={disconnectWallet}>Desconectar Wallet</button>
        </div>
      ) : (
        <div className="container">
          <form id="verificacion-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="wallet">Wallet Key:</label>
              <input type="text" id="wallet" name="wallet" required />
            </div>

            <div className="form-group">
              <input className="w-full bg-gray-500" type="submit" value="Buscar / Conectar Wallet" />
            </div>
          </form>
        </div>
      )}
    </>
  );
};

export default Home;
