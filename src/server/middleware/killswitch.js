import request from "request"
import { SERVER_PORT, DEV_SOCKET_CODE, DEV_RESTART_CODE } from "config"

export function handleServerError(err) {
  if (err.errno === 'EADDRINUSE') {
    if (__DEV__) {
      let addresss = `http://localhost:${SERVER_PORT}/ERROR_ADDRESS_IN_USE`
      request(addresss, function(error, response, body) {
        console.log("SERVER", body);
        process.exit(DEV_RESTART_CODE)
      })
      console.log(`Port In Use ${SERVER_PORT}, sending killswitch ${addresss}`)
    } else {
      console.log(`Port In Use ${SERVER_PORT}`)
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
