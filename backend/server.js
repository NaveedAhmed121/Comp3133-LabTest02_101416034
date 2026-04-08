require("dotenv").config({ path: __dirname + "/.env" });

const express = require("express");
const cors = require("cors");
const path = require("path");
const multer = require("multer");
const mongoose = require("mongoose");
const { ApolloServer } = require("apollo-server-express");

const typeDefs = require("./schema");
const employeeResolvers = require("./employeeResolver");
const userResolvers = require("./userResolver");

// Multer storage: saves files to ./uploads/ with original extension
const storage = multer.diskStorage({
    destination: path.join(__dirname, "uploads"),
    filename: (_req, file, cb) => {
        const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
        const ext = path.extname(file.originalname);
        cb(null, unique + ext);
    },
});
const upload = multer({
    storage,
    fileFilter: (_req, file, cb) => {
        if (!file.mimetype.startsWith("image/")) {
            return cb(new Error("Only image files are allowed"));
        }
        cb(null, true);
    },
    limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
});

async function startServer() {
    await mongoose.connect(process.env.MONGODB_URI);

    console.log("MongoDB Connected ✅");

    const server = new ApolloServer({
        typeDefs,
        resolvers: [employeeResolvers, userResolvers],
    });

    await server.start();

    const app = express();
    const allowedOrigins = (process.env.CORS_ORIGIN || 'http://localhost:4200').split(',');
    app.use(cors({ origin: allowedOrigins, credentials: true }));

    // Serve uploaded files as static assets
    app.use("/uploads", express.static(path.join(__dirname, "uploads")));

    // REST endpoint: POST /upload  → returns { url }
    app.post("/upload", upload.single("file"), (req, res) => {
        if (!req.file) {
            return res.status(400).json({ error: "No file uploaded" });
        }
        const url = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;
        res.json({ url });
    });

    server.applyMiddleware({ app });

    const PORT = process.env.PORT || 4000;
    app.listen(PORT, () => {
        console.log(`Server is running at http://localhost:${PORT}${server.graphqlPath}`);
    });
}

startServer().catch((err) => {
    console.error(err);
    process.exit(1);
});