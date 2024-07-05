'use client'
import { useState, useEffect } from 'react';

interface Barcode {
  _id: string;
  barcode: string;
}

export default function Page() {
  const [barcode, setBarcode] = useState('');
  const [result, setResult] = useState('');
  const [barcodes, setBarcodes] = useState<Barcode[]>([]);

  // 페이지 로드시 한번만 실행되는 useEffect
  useEffect(() => {
    fetchBarcodes(); // 페이지 로드시 한번 데이터 가져오기

    // 3초 마다 데이터 업데이트
    const interval = setInterval(() => {
      fetchBarcodes();
    }, 5000); // 3초마다 업데이트

    return () => clearInterval(interval); // 컴포넌트가 언마운트될 때 interval 정리
  }, []);


  // 함수를 따로 빼서 바코드 리스트를 업데이트하는 부분
  const fetchBarcodes = async () => {
    try {
      const response = await fetch('/api/get-barcodes');
      if (response.ok) {
        const data = await response.json();
        setBarcodes(data.barcodes);
      } else {
        console.error('Failed to fetch barcodes:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching barcodes:', error);
    }
  };

  const handleInputChange = (e: any) => {
    setBarcode(e.target.value);
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/save-barcode', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ barcode }),
      });

      if (response.ok) {
        const data = await response.json();
        setResult(data.message);
        setBarcode(''); // 입력칸 초기화
        fetchBarcodes();
      } else {
        const error = await response.json();
        setResult(`Error: ${error.message}`);
      }
    } catch (err: any) {
      setResult(`Error: ${err.message}`);
    }
  };

  async function copyToClipboard(text: any) {
    try {
      await navigator.clipboard.writeText(text);
      alert('Copied to clipboard!');
    } catch (err) {
      alert('Failed to copy!');
    }
  }
  

  const handleCopy = async (value: any) => {
    try {
      await navigator.clipboard.writeText(value);
      alert('Copied to clipboard!');
    } catch (err) {
      alert('Failed to copy!');
    }
  };

  return (
    <div>
      <h1>Barcode Tester</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={barcode}
          onChange={handleInputChange}
          placeholder="Enter barcode"
        />
        <button type="submit">Submit</button>
      </form>
      {result && (
        <div>
          <p>{result}</p>
          <button onClick={() => handleCopy(result)}>Copy to Clipboard</button>
        </div>
      )}
      <h2>Barcode List</h2>
      <ul>
        {barcodes.map(barcode => (
          <li key={barcode._id}>
            <div>
              <p>Barcode: {barcode.barcode}</p>
              <button onClick={() => copyToClipboard(barcode.barcode)}>Copy to Clipboard</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
