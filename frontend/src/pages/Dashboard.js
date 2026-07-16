import React, { useState, useEffect } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";

const Dashboard = ({ user, setUser }) => {
  const [receiverEmail, setReceiverEmail] = useState("");
  const [amount, setAmount] = useState("");
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

      setUser({
        ...user,
        balance: res.data.newBalance,
      });

      setReceiverEmail("");
      setAmount("");

      await fetchTransactions();
    } catch (err) {
      setError(err.response?.data?.message || "Transaction failed");
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

      <div className="transactions-list">
        <h3>Transaction History</h3>

        {loadingTransactions ? (
          <p>Loading transactions...</p>
        ) : transactions.length === 0 ? (
          <p>No transactions yet. Make your first transfer!</p>
        ) : (
          <ul>
            {transactions.map((tx) => {
              const sent = tx.sender.id === user.id;

              return (
                <li key={tx.id}>
                  <p>
                    <strong>{sent ? "To" : "From"}:</strong>{" "}
                    {sent ? tx.receiver.email : tx.sender.email}
                  </p>

                  <p>
                    <strong>Amount:</strong> {sent ? "-" : "+"}$
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
