const express = require("express")
const app = express()
const mongoose = require("mongoose")
const dotenv = require("dotenv")
const pdfRouter = require("./routers/pdfRouter")
const authRouter = require("./routers/authRouter")

const cookieParser = require('cookie-parser');
const path = require('path')
dotenv.config()

mongoose.connect(
    process.env.MONGODB
).then(()=>console.log("Database connected"))
.catch((err) => {
    console.log(err);
})
const __dirname = path.resolve();

app.use(express.json()) 
app.use(cookieParser());

app.listen(3000,()=>{
    console.log('server is running');
})


app.use("/api/files", express.static("files"));
app.use("/api/pdf", pdfRouter)
app.use("/api/auth", authRouter)

app.use(express.static(path.join(__dirname, '/client/dist')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client', 'dist', 'index.html'));
})
  
app.use((err, req, res, next)=>{
const statusCode = err.statusCode || 500
const message = err.message || 'internal server error'

return res.status(statusCode).json({
    success:false,
    statusCode,
    message,
})
})

