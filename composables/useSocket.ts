export default function useSocket () {
  const conn = new WebSocket("ws://192.168.1.64:7033/device/ws")
  async function t () {
    const respose = await useAsyncQuery(async ({ axios, path }) => {
      return await axios.get(path + '/device/ws')
    })
    console.log(respose)
  }
  t()
  conn.onopen = () => {
    alert('connected')
  }
  conn.onclose = () => {
    alert("Подключение окончено")
  }
  conn.onmessage = (e) => {
    console.log('from on message', JSON.parse(e.data))
  }
  return conn
  // function sendMessage (message:string) {
  //   conn.send(JSON.stringify({ event: "chat-message", payload: message }))
  // }
}
