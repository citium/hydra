import request from "request"
import { PORT, DEV_SOCKET_CODE, DEV_RESTART_CODE } from "share/config"

export function handleServerError(err) {
  if (err.errno === 'EADDRINUSE') {
    if (__DEV__) {
      let addresss = `http://localhost:${PORT}/ERROR_ADDRESS_IN_USE`
      request(addresss, function(error, response, body) {
        console.log("SERVER", body);
        process.exit(DEV_RESTART_CODE)
      })
      console.log(`Port In Use ${PORT}, sending killswitch ${addresss}`)
    } else {
      console.log(`Port In Use ${PORT}`)
    }
  } else {
    console.log(err)
  }
}

export default function handle(req, res) {
  res.end()
  if (__DEV__) {
    process.exit(DEV_SOCKET_CODE)
  }
}
