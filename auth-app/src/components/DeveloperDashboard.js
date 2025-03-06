import React, { useState, useEffect, useContext } from "react";
import "./DeveloperDashboard.css";
import { Shield, CheckCircle, XCircle, Settings } from "lucide-react";
import { Web3Context } from '../contexts/Web3Context';
import { getContractInstance } from '../utils/contracts';

const DeveloperDashboard = () => {
  const { web3, account } = useContext(Web3Context);
  const [contract, setContract] = useState(null);
  const [logisticsCompanies, setLogisticsCompanies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [registryData, setRegistryData] = useState({
    totalLogistics: 0,
    verifiedLogistics: 0,
    pendingLogistics: 0
  });
  const [logisticsProviders, setLogisticsProviders] = useState([]);
  const [newProvider, setNewProvider] = useState({
    name: '',
    licenseId: '',
    address: ''
  });

  useEffect(() => {
    const initContract = async () => {
      try {
        if (web3 && account) {
          const logisticsContract = getContractInstance(web3, 'LogisticsRegistry');
          setContract(logisticsContract);
          await loadCompanies(logisticsContract);
          await loadRegistryData();
        }
      } catch (error) {
        console.error("Error initializing contract:", error);
      }
    };

    initContract();
  }, [web3, account]);

  const loadCompanies = async (contractInstance) => {
    try {
      setLoading(true);
      const companiesCount = await contractInstance.methods.getCompaniesCount().call();
      const companies = [];

      for (let i = 0; i < companiesCount; i++) {
        const company = await contractInstance.methods.companies(i).call();
        companies.push({
          id: i,
          name: company.name,
          status: company.status === '0' ? 'Pending' : 
                 company.status === '1' ? 'Approved' : 'Rejected',
          applications: parseInt(company.applications)
        });
      }

      setLogisticsCompanies(companies);
    } catch (error) {
      console.error("Error loading companies:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleApproveCompany = async (companyId) => {
    try {
      setLoading(true);
      await contract.methods.approveCompany(companyId)
        .send({ from: account });
      
      // Update local state after blockchain confirmation
      setLogisticsCompanies((prevCompanies) =>
        prevCompanies.map((company) =>
          company.id === companyId ? { ...company, status: "Approved" } : company
        )
      );
    } catch (error) {
      console.error("Error approving company:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRejectCompany = async (companyId) => {
    try {
      setLoading(true);
      await contract.methods.rejectCompany(companyId)
        .send({ from: account });
      
      // Update local state after blockchain confirmation
      setLogisticsCompanies((prevCompanies) =>
        prevCompanies.map((company) =>
          company.id === companyId ? { ...company, status: "Rejected" } : company
        )
      );
    } catch (error) {
      console.error("Error rejecting company:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Approved":
        return "text-emerald-500";
      case "Rejected":
        return "text-red-500";
      default:
        return "text-yellow-500";
    }
  };

  const loadRegistryData = async () => {
    try {
      setLoading(true);
      const contract = getContractInstance(web3, 'LogisticsRegistry');
      
      // Get total logistics providers
      const totalLogistics = await contract.methods.getTotalLogisticsProviders().call();
      
      // Get all logistics providers
      const providers = [];
      for (let i = 0; i < totalLogistics; i++) {
        const providerAddress = await contract.methods.logisticsProviders(i).call();
        const providerData = await contract.methods.getLogisticsProviderDetails(providerAddress).call();
        
        providers.push({
          walletAddress: providerAddress,
          name: providerData.name,
          licenseId: providerData.licenseId,
          isVerified: providerData.isVerified,
          registrationDate: new Date(providerData.registrationTimestamp * 1000).toLocaleDateString()
        });
      }
      
      setLogisticsProviders(providers);
      
      // Calculate verified and pending counts
      const verifiedCount = providers.filter(p => p.isVerified).length;
      
      setRegistryData({
        totalLogistics: totalLogistics,
        verifiedLogistics: verifiedCount,
        pendingLogistics: totalLogistics - verifiedCount
      });
    } catch (error) {
      console.error("Error loading registry data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProvider({
      ...newProvider,
      [name]: value
    });
  };

  const handleRegisterProvider = async (e) => {
    e.preventDefault();
    
    if (!newProvider.name || !newProvider.licenseId || !newProvider.address) {
      alert("Please fill in all fields");
      return;
    }
    
    try {
      setLoading(true);
      const contract = getContractInstance(web3, 'LogisticsRegistry');
      
      await contract.methods.registerLogisticsProvider(
        newProvider.address,
        newProvider.name,
        newProvider.licenseId
      ).send({ from: account });
      
      // Reset form and reload data
      setNewProvider({
        name: '',
        licenseId: '',
        address: ''
      });
      
      loadRegistryData();
    } catch (error) {
      console.error("Error registering provider:", error);
      alert("Failed to register provider. See console for details.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyProvider = async (providerAddress) => {
    try {
      setLoading(true);
      const contract = getContractInstance(web3, 'LogisticsRegistry');
      
      await contract.methods.verifyLogisticsProvider(providerAddress)
        .send({ from: account });
      
      loadRegistryData();
    } catch (error) {
      console.error("Error verifying provider:", error);
      alert("Failed to verify provider. See console for details.");
    } finally {
      setLoading(false);
    }
  };

  if (!web3 || !account) {
    return (
      <div className="connect-wallet-message">
        Please connect your wallet to continue
      </div>
    );
  }

  return (
    <div className="developer-dashboard">
      <div className="dashboard-header">
        <div className="header-content">
          <Shield className="header-icon" />
          <h1>Developer Dashboard</h1>
        </div>
        <div className="wallet-info">
          Connected: {account ? `${account.substring(0, 6)}...${account.substring(38)}` : 'Not connected'}
        </div>
      </div>

      {loading && (
        <div className="loading-overlay">
          <div className="loading-spinner">Processing...</div>
        </div>
      )}

      <div className="dashboard-grid">
        {/* Stats Overview */}
        <div className="stats-card">
          <h3>Overview</h3>
          <div className="stats-grid">
            <div className="stat-item">
              <span className="stat-value">{logisticsCompanies.length}</span>
              <span className="stat-label">Total Companies</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">
                {logisticsCompanies.filter((c) => c.status === "Pending").length}
              </span>
              <span className="stat-label">Pending Approval</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">
                {logisticsCompanies.filter((c) => c.status === "Approved").length}
              </span>
              <span className="stat-label">Approved</span>
            </div>
          </div>
        </div>

        {/* Approve Companies Section */}
        <div className="companies-card">
          <div className="card-header">
            <h2>Logistics Companies</h2>
            <Settings className="settings-icon" />
          </div>
          <div className="companies-list">
            {logisticsCompanies.map((company) => (
              <div key={company.id} className="company-item">
                <div className="company-info">
                  <h3>{company.name}</h3>
                  <div className="company-meta">
                    <span className={`status ${getStatusColor(company.status)}`}>
                      {company.status}
                    </span>
                    <span className="applications">
                      {company.applications} applications
                    </span>
                  </div>
                </div>
                {company.status === "Pending" && (
                  <div className="action-buttons">
                    <button
                      onClick={() => handleApproveCompany(company.id)}
                      className="approve-btn"
                      disabled={loading}
                    >
                      <CheckCircle size={18} />
                      Approve
                    </button>
                    <button
                      onClick={() => handleRejectCompany(company.id)}
                      className="reject-btn"
                      disabled={loading}
                    >
                      <XCircle size={18} />
                      Reject
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Registry Overview */}
        <div className="stats-card">
          <h3>Registry Overview</h3>
          <div className="stats-grid">
            <div className="stat-item">
              <span className="stat-value">{registryData.totalLogistics}</span>
              <span className="stat-label">Total Providers</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">{registryData.verifiedLogistics}</span>
              <span className="stat-label">Verified</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">{registryData.pendingLogistics}</span>
              <span className="stat-label">Pending</span>
            </div>
          </div>
        </div>

        {/* Add Provider Form */}
        <div className="add-provider-card">
          <h3>Add New Logistics Provider</h3>
          <form onSubmit={handleRegisterProvider}>
            <input
              type="text"
              placeholder="Provider Name"
              name="name"
              value={newProvider.name}
              onChange={handleInputChange}
              required
            />
            <input
              type="text"
              placeholder="License ID"
              name="licenseId"
              value={newProvider.licenseId}
              onChange={handleInputChange}
              required
            />
            <input
              type="text"
              placeholder="Wallet Address"
              name="address"
              value={newProvider.address}
              onChange={handleInputChange}
              required
            />
            <button type="submit" disabled={loading}>
              {loading ? 'Processing...' : 'Add Provider'}
            </button>
          </form>
        </div>

        {/* Providers List */}
        <div className="providers-card">
          <h3>Logistics Providers</h3>
          <div className="providers-list">
            {logisticsProviders.map((provider, index) => (
              <div key={index} className="provider-item">
                <div className="provider-info">
                  <h4>{provider.name}</h4>
                  <p>License: {provider.licenseId}</p>
                  <p>Address: {provider.walletAddress.substring(0, 6)}...{provider.walletAddress.substring(38)}</p>
                  <p>Registered: {provider.registrationDate}</p>
                </div>
                {!provider.isVerified && (
                  <button
                    onClick={() => handleVerifyProvider(provider.walletAddress)}
                    className="verify-button"
                  >
                    Verify
                  </button>
                )}
                <span className={`status ${provider.isVerified ? 'verified' : 'pending'}`}>
                  {provider.isVerified ? 'Verified' : 'Pending'}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeveloperDashboard;