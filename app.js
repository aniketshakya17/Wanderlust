if (process.env.NODE_ENV !== "production") {
    require("dotenv").config();
}

/* ======================
   IMPORTS
====================== */
const express = require("express");
const app = express();
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");

const mongoose = require("mongoose");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");

const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

const ExpressError = require("./utils/ExpressError.js");

/* ======================
   ROUTES
====================== */
const listingsRoute = require("./routes/listing.js");
const reviewsRoute = require("./routes/reviews.js");
const userRoute = require("./routes/user.js");

/* ======================
   APP CONFIG
====================== */
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.engine("ejs", ejsMate);

app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride("_method"));

/* ======================
   DATABASE
====================== */
const dbUrl = process.env.MONGO_URI;

mongoose
    .connect(dbUrl)
    .then(() => {
        console.log("MongoDB connected");
    })
    .catch((err) => {
        console.error("MongoDB connection error:", err);
        process.exit(1);
    });

/* ======================
   SESSION STORE
====================== */


// ✅ ALWAYS define dbUrl explicitly here
const dbUrl = process.env.MONGO_URI;

// ❌ Fail fast if env vars are missing
if (!dbUrl) {
    console.error("❌ ERROR: MONGO_URI is missing");
    process.exit(1);
}

if (!process.env.SECRET) {
    console.error("❌ ERROR: SESSION SECRET is missing");
    process.exit(1);
}

// ✅ Create session store
const store = MongoStore.create({
    mongoUrl: dbUrl,
    collectionName: "sessions",
    crypto: {
        secret: process.env.SECRET,
    },
    touchAfter: 24 * 3600, // 1 day
});

// ✅ Handle store errors safely
store.on("error", (err) => {
    console.error("❌ SESSION STORE ERROR:", err);
});

// ✅ Session configuration
const sessionOptions = {
    store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    },
};

// ✅ Use session + flash
app.use(session(sessionOptions));
app.use(flash());


/* ======================
   PASSPORT CONFIG
====================== */
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

/* ======================
   GLOBAL MIDDLEWARE
====================== */
app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
});

/* ======================
   ROUTES (ORDER MATTERS)
====================== */
app.use("/listings", listingsRoute);
app.use("/listings/:id/reviews", reviewsRoute);
app.use("/", userRoute);

/* ROOT ROUTE — KEEP THIS AFTER ALL ROUTES */
app.get("/", (req, res) => {
    return res.redirect(302, "/listings");
});

/* ======================
   ERROR HANDLING
====================== */
app.all("*", (req, res, next) => {
    next(new ExpressError(404, "Page Not Found"));
});

app.use((err, req, res, next) => {
    const { statusCode = 500, message = "Something went wrong" } = err;
    res.status(statusCode).render("error.ejs", { message });
});

/* ======================
   SERVER
====================== */
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
