import { useState } from "react";
import { pingApi } from "./api";

export default function App() {
  const [msg, setMsg] = useState("—");

  async function testApi() {
    try {
      const txt = await pingApi();
      setMsg(txt);
    } catch (e) {
      setMsg("Error: " + e.message);
    }
  }

  return (
    <div style={{padding:24,fontFamily:"sans-serif"}}>
      <h1>Dexly ✅</h1>
      <p>Frontend on Fly.io</p>
      <button onClick={testApi}>Probar API</button>
      <pre style={{background:"#f5f5f5",padding:12,marginTop:12}}>{msg}</pre>
    </div>
  );
}