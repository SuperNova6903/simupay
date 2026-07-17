import React, { useState, useEffect } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";

const Dashboard = ({ user, setUser }) => {
  const [receiverEmail, setReceiverEmail] = useState("");
  const [amount, setAmount] = useState("");
  const [depositAmount, setDepositAmount] = useState("");
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [transactions, setTransactions] = useState([]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loadingTransactions, setLoadingTransactions] = useState(true);

  const navigate = useNavigate();

  const fetchTransactions = async () => {
    try {
      setLoadingTransactions(true);

      const res = await api.get("/api/transactions/history");

      setTransactions(res.data);
    } finally {
      setLoadingTransactions(false);
    }
  };

  const refreshCurrentUser = async () => {
    const res = await api.get("/api/auth/user");
    setUser(res.data);
  };

  const refreshDashboardData = async () => {
    await Promise.all([refreshCurrentUser(), fetchTransactions()]);
  };

  useEffect(() => {
    const loadTransactions = async () => {
      await fetchTransactions();
    };

    if (user) {
      loadTransactions();
    }
  }, [user]);

  const handleTransfer = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");

    try {
      const res = await api.post("/api/simulate/transfer", {
        receiverEmail,
        amount,
      });

      setMessage(res.data.message);

      setReceiverEmail("");
      setAmount("");

      await refreshDashboardData();
    } catch (err) {
      setError(err.response?.data?.message || "Transaction failed");
    }
  };

  const handleAccountOperation = async (e, endpoint, value, clearValue) => {
    e.preventDefault();
    setMessage("");
    setError("");

    try {
      const res = await api.post(endpoint, { amount: value });
      setMessage(res.data.message);
      clearValue("");
      await refreshDashboardData();
    } catch (err) {
      setError(err.response?.data?.message || "Account operation failed");
    }
  };

  const handleLogout = async () => {
    try {
      await api.post("/api/auth/logout");
    } finally {
      setUser(null);
      navigate("/");
    }
  };

  return (
    <div className="dashboard-container">
      <div className="header">
        <h2>SimuPay - P2P Transfer</h2>

        <button onClick={handleLogout} className="logout-btn">
          Logout
        </button>
      </div>

      <div className="balance-card">
        <h3>Current Balance: ${Number(user.balance).toFixed(2)}</h3>
      </div>

      <form onSubmit={handleTransfer} className="transfer-form">
        <h3>Transfer Simulation</h3>

        {error && <p className="error">{error}</p>}

        {message && <p className="success">{message}</p>}

        <input
          type="email"
          placeholder="Receiver's Email"
          value={receiverEmail}
          onChange={(e) => setReceiverEmail(e.target.value)}
          required
        />

        <input
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          min="0.01"
          step="0.01"
          required
        />

        <button type="submit">Transfer (2% Fee)</button>
      </form>

      <form
        onSubmit={(e) => handleAccountOperation(
          e,
          "/api/account/deposit",
          depositAmount,
          setDepositAmount,
        )}
        className="transfer-form"
      >
        <h3>Deposit</h3>

        <input
          type="number"
          placeholder="Amount"
          value={depositAmount}
          onChange={(e) => setDepositAmount(e.target.value)}
          min="0.01"
          step="0.01"
          required
        />

        <button type="submit">Deposit</button>
      </form>

      <form
        onSubmit={(e) => handleAccountOperation(
          e,
          "/api/account/withdraw",
          withdrawAmount,
          setWithdrawAmount,
        )}
        className="transfer-form"
      >
        <h3>Withdraw</h3>

        <input
          type="number"
          placeholder="Amount"
          value={withdrawAmount}
          onChange={(e) => setWithdrawAmount(e.target.value)}
          min="0.01"
          step="0.01"
          required
        />

        <button type="submit">Withdraw</button>
      </form>

      <div className="transactions-list">
        <h3>Transaction History</h3>

        {loadingTransactions ? (
          <p>Loading transactions...</p>
        ) : transactions.length === 0 ? (
          <p>No transactions yet. Make your first transfer!</p>
        ) : (
          <ul>
            {transactions.map((tx) => {
              const isDeposit = tx.type === "DEPOSIT";
              const isWithdrawal = tx.type === "WITHDRAWAL";
              const sent = tx.sender?.id === user.id;
              const counterparty = sent ? tx.receiver?.email : tx.sender?.email;

              return (
                <li key={tx.id}>
                  {isDeposit ? (
                    <p><strong>Deposit</strong></p>
                  ) : isWithdrawal ? (
                    <p><strong>Withdrawal</strong></p>
                  ) : (
                    <p>
                      <strong>{sent ? "To" : "From"}:</strong>{" "}
                      {counterparty}
                    </p>
                  )}

                  <p>
                    <strong>Amount:</strong>{" "}
                    {isWithdrawal || sent ? "-" : "+"}$
                    {Number(tx.amount).toFixed(2)}
                  </p>

                  <p>
                    <strong>Fee:</strong> ${Number(tx.fee).toFixed(2)}
                  </p>

                  <p>
                    <strong>Date:</strong>{" "}
                    {new Date(tx.createdAt).toLocaleString()}
                  </p>

                  <span className={`status ${tx.status.toLowerCase()}`}>
                    {tx.status}
                  </span>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
