import { ethers } from "ethers"
import { useState, useEffect } from "react"
import Todos from "./artifacts/contracts/Todos.sol/Todos.json"

function App() {
  const [Todoz, setTodoz] = useState([])
  const [count, setcount] = useState(0)
  const [task_name, settask_name] = useState("")

  const contract_address = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512"

  async function requestAccount() {
    await window.ethereum.request({ method: 'eth_requestAccounts' });
  }

  const fetch_count = async () => {
    if (typeof window.ethereum !== "undefined") {
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const contract = new ethers.Contract(contract_address, Todos.abi, provider)
      try {
        const data = await contract.count()
        setcount(parseInt(data?._hex, 16))
        get_task(parseInt(data?._hex, 16))
      } catch (err) {
        console.log(err)
      }
    }
  }

  const Add_task = async () => {
    if (task_name === "") return

    if (typeof window.ethereum !== "undefined") {
      await requestAccount()
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const signer = await provider.getSigner()
      const contract = new ethers.Contract(contract_address, Todos.abi, signer)
      const transaction = await contract.create_task(task_name)
      transaction.wait().then(() => { settask_name("") }).catch(err => console.log(err))
    }
  }

  const get_task = async () => {
    if (count === 0) return
    if (typeof window.ethereum !== "undefined") {
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const contract = new ethers.Contract(contract_address, Todos.abi, provider)
      try {
        const todo = [...Todoz]
        for (let i = 1; i <= count; i++) {
          const data = await contract.get_task(i)
          todo.push({ name: data[0], id: i })
          setTodoz(todo)
        }
      }
      catch (err) {
        console.log("get_task err:", err)
      }
    }
  }

  useEffect(() => {
    fetch_count()
  }, [])

  useEffect(() => {
    get_task()
  }, [count])

  console.log(Todoz)
  return (
    <div>
      <h1>Todo : {count}</h1>

      <input
        type="text"
        placeholder="Task"
        onChange={e => settask_name(e.target.value)} />

      <button onClick={Add_task}>Add</button>
      <button onClick={requestAccount}>login</button>
      <ul>
        {
          Todoz?.map(v => {
            return <li key={Math.random()}>{v?.name}</li>
          })
        }

      </ul>
    </div>
  );
}

export default App;
