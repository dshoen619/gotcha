import { io } from "socket.io-client";

require('dotenv').config();
const app = express()
const port = process.env.BACKEND_PORT

const socket = io.connect(`http://localhost:${port}`);
export default socket;