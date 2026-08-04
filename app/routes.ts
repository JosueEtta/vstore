import { type RouteConfig, index, route } from "@react-router/dev/routes";


export default [
    index("routes/home.jsx"),
    route("/signup","routes/signup.jsx"),
    route("/login","routes/login.jsx"),
    route("/products","routes/productlist.jsx"),
    route("/clientdashboard","routes/clientdashboard.jsx"),
    route("/admindashboard","routes/admindashboard.jsx"),
    route("/payment","routes/payment.jsx")

] satisfies RouteConfig;
