import jwt from "jsonwebtoken";

const isAuth = async (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(400).json({ message: "Token not found" });
    }

    const verifyToken = jwt.verify(token, process.env.JWT_SECRET);

    req.userId = verifyToken.userId;
    next();
  } catch (error) {
    console.log("Auth Error:", error.message);
    return res.status(401).json({ message: "Invalid token" });
  }
};

export default isAuth;



/////
// import jwt from "jsonwebtoken";

// const isAuth = async (req, res, next) => {
//   try {
//     const token = req.cookies.token;

//     if (!token) {
//       return res.status(400).json({ message: "Token not found" });
//     }

//     const verifyToken = jwt.verify(token, process.env.JWT_SECRET);

//     req.userId = verifyToken.userId;
//     next();
//   } catch (error) {
//     console.log(error);
//     return res.status(401).json({ message: "Invalid token" });
//   }
// };

// export default isAuth;

