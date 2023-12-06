export default function useSocket () {
  const conn = new WebSocket("ws://95.68.244.175:7033/")
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
