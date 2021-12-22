import { ethers } from "ethers"
import { useState, useEffect } from "react"
import Todos from "./artifacts/contracts/Todos.sol/Todos.json"

function App() {
  const [Todoz, setTodoz] = useState([])
  const [count, setcount] = useState(0)
  const [task_name, settask_name] = useState("")

  const contract_address = "0x5FbDB2315678afecb367f032d93F642f64180aa3"

  async function requestAccount() {
    // await window.ethereum.request({ method: 'eth_requestAccounts' });
    await window.ethereum.enable()
  }

  const fetch_count = async () => {
    if (typeof window.ethereum !== "undefined") {
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const contract = new ethers.Contract(contract_address, Todos.abi, provider)
      try {
        const data = await contract.count()
        setcount(parseInt(data?._hex, 16))
      } catch (err) {
        console.log(err)
      }
    }
  }

  const Add_task = async () => {
    if (task_name !== "") return

    if (typeof window.ethereum !== "undefined") {
      await requestAccount()
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const signer = await provider.getSigner()
      const contract = new ethers.Contract(contract_address, Todos.abi, signer)
      const transaction = await contract.create_task(task_name)
      await transaction.wait()
    }
  }

  useEffect(() => {
    if (count === 0) fetch_count()
  }, [])

  return (
    <div>
      <h1>Todo : {count}</h1>

      <input
        type="text"
        placeholder="Task"
        onChange={e => settask_name(e.target.value)} />

      <button onClick={Add_task}>Add</button>
      <button onClick={requestAccount}>login</button>
    </div>
  );
}

export default App;
