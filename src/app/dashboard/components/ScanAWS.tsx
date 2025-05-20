'use client'

import React, { useState } from 'react';
import axios from 'axios';

const ScanAWS = () => {
  const [template, setTemplate] = useState('');
  const [result, setResult] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleScan = async () => {
    if (!template) return alert("Please select a template");

    // Map template to backend path
    let path = '';
    if (template === 'cis' || template === 'hipaa' || template === 'nist') {
      path = 'config';
    } else if (template === 'pci') {
      path = 'inspector';
    } else {
      path = 'securityhub';
    }

    const apiUrl = `http://localhost:5000/scan/aws/${path}`;
    console.log("📡 Calling:", apiUrl);

    setLoading(true);
    setResult([]);

    try {
      const response = await axios.get(apiUrl);
      setResult(response.data);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        alert('isAxiosError')
        console.log(error.response?.data?.error)
        // setResult(`Error: ${error.response?.data?.error || error.message}`);
      } else {
        console.log(`Error: ${(error as Error).message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (!result) {
      alert("No result to download!");
      return;
    }

    const blob = new Blob([JSON.stringify(result)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `compliance-report-${template}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div style={{ padding: '1em' }}>
      <h2>Scan AWS Compliance</h2>
      <div style={{ marginBottom: '1em' }}>
        <select onChange={(e) => setTemplate(e.target.value)} value={template}>
          <option value="">-- Select Template --</option>
          <option value="cis">CIS</option>
          <option value="pci">PCI DSS</option>
          <option value="hipaa">HIPAA</option>
          <option value="nist">NIST</option>
          <option value="gdpr">GDPR</option>
        </select>

        <button onClick={handleScan} disabled={loading} style={{ marginLeft: '1em' }}>
          {loading ? 'Scanning...' : 'Run Scan'}
        </button>

        <button onClick={handleDownload} disabled={!result} style={{ marginLeft: '1em' }}>
          Download Report
        </button>
      </div>

      <pre style={{
        background: '#f4f4f4',
        padding: '1em',
        border: '1px solid #ccc',
        borderRadius: '5px',
        maxHeight: '400px',
        overflowY: 'auto'
      }}>
        {result}
      </pre>
      {result && result.length > 0 ?
        result.map((item, index) => (
          <div key={index}>{JSON.stringify(item)}</div>
        ))
        :
        <div>
          No results found
        </div>
      }
    </div>
  );
};

export default ScanAWS;
