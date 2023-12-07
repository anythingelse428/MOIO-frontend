import * as signalR from "@microsoft/signalr"


export default function useSocket (httpCtxUrl:string, autoReconnect = false) {
  const connection = new signalR.HubConnectionBuilder()
    .withUrl(httpCtxUrl)
    .build()
  async function start () {
    try {
      await connection.start()
      console.log("SignalR Connected.")
    } catch (err) {
      console.log(err)
      if (autoReconnect) {
        setTimeout(start, 5000)
      }
    }
  }
  start()

  connection.onclose(async () => {
    await start()
  })
  return {
    connection,
    start,
  }
}
