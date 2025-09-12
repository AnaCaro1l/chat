import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import userRoutes from "./routes/UserRoutes";
import { sequelize } from "./database";
import { ValidationError } from "yup";
import { AppError } from "./errors/AppError";

const app = express();
const port = 3333;

app.use(cors());
app.use(express.json());

app.use('/', userRoutes);

app.use((err: Error, req: Request, res: Response, _: NextFunction) => {
    if (err instanceof ValidationError) {
        return res.status(400).json({ status: 'validation error', errors: err.errors });
    }

    if (err instanceof AppError) {
        return res.status(err.statusCode || 400).json({ status: 'error', message: err.message });
    }

    console.error(err);
    return res.status(500).json({ status: 'error', message: 'Internal server error' });
});

app.listen(port, () => console.log(`Server is running on port ${port}`));

async function syncDb() {
    try {
        await sequelize.authenticate();
        console.log("Database connected and synced");
    } catch (err) {
        console.error(err);
    }
}

syncDb();
