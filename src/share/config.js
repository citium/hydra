export const ENV = process.env.NODE_ENV || "DEV";
export const PORT = process.env.PORT || 3001
export const DEV = ENV === "DEV"
export const PRO = ENV !== "DEV"
export const DEV_RESTART_CODE = 250
export const DEV_SOCKET_CODE = 251
