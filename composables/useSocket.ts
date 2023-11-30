export default function useSocket () {
  const conn = new WebSocket("ws://127.0.1.1:9000/")
  conn.onopen = () => {
    console.log('connected')
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
