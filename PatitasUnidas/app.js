import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import loginRouter from "./routes/login.js";
import dashboardRoutes from "./routes/dashboard.js";
import adopcionRoutes from "./routes/adopcion.js"
import voluntariadoRoutes from "./routes/voluntariado.js"

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.use("/login", loginRouter);
app.use('/dashboard', dashboardRoutes);
app.use('/adopcion', adopcionRoutes);
app.use('/voluntariado', voluntariadoRoutes);


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor corriendo en http://localhost:${PORT}`));

