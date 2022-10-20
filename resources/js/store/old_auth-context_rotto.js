// import { createContext, useState } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";
// // import {
// //   NOT_LOGGED_IN,
// //   LOG_IN_FORM,
// //   SIGN_UP_FORM,
// //   LOGGED_IN,
// // } from "../constants/AuthStatus";

// // Documentazione= https://gitlab.com/Bob_Humphrey/react-auth/-/blob/master/src/components/AuthLogin.js

// const AuthContext = createContext({
//     userEmail: "",
//     userPassword: "",
//     authStatus: false,
//     login: (event) => {},
//     //logout: () => {},
//     errorMessage: "",
// });

// export const AuthContextProvider = (props) => {
//     const [authStatus, setAuthStatus] = useState();
//     const [errorMessage, setErrorMessage] = useState();
//     // const [userNameInput, setUserNameInput] = useState("");
//     const [userEmail, setUserEmail] = useState();
//     const [userPassword, setUserPassword] = useState();

//     const navigate = useNavigate();

//     // function changeAuthStatusLogin() {
//     //   setAuthStatus(LOG_IN_FORM);
//     // }

//     // function changeAuthStatusSignup() {
//     //   setAuthStatus(SIGN_UP_FORM);
//     // }

//     // function handleUserNameInput(changeEvent) {
//     //   let updatedUserName = changeEvent.target.value;
//     //   setUserNameInput(updatedUserName);
//     // }
    

//     function handleUserEmail(changeEvent) {
//         let updatedUserEmail = changeEvent.target.value;
//         console.log(updatedUserEmail);
//         setUserEmail(updatedUserEmail);
//     }

//     function handleUserPassword(changeEvent) {
//         let updatedUserPassword = changeEvent.target.value;
//         setUserPassword(updatedUserPassword);
//     }

//     // const signup = () => {
//     //   axios.defaults.withCredentials = true;
//     //   // CSRF COOKIE
//     //   axios.get(hostName + "sanctum/csrf-cookie").then(
//     //     (response) => {
//     //       //console.log(response);
//     //       // SIGNUP / REGISTER
//     //       axios
//     //         .post(hostName + "api/register", {
//     //           name: userNameInput,
//     //           email: userEmail,
//     //           password: userPassword,
//     //         })
//     //         .then(
//     //           (response) => {
//     //             //console.log(response);
//     //             // GET USER
//     //             axios.get(hostName + "api/user").then(
//     //               (response) => {
//     //                 //console.log(response);
//     //                 setUserId(response.data.id);
//     //                 setUserName(response.data.name);
//     //                 setErrorMessage("");
//     //                 setAuthStatus(LOGGED_IN);
//     //               },
//     //               // GET USER ERROR
//     //               (error) => {
//     //                 setErrorMessage("Could not complete the sign up");
//     //               }
//     //             );
//     //           },
//     //           // SIGNUP ERROR
//     //           (error) => {
//     //             if (error.response.data.errors.name) {
//     //               setErrorMessage(error.response.data.errors.name[0]);
//     //             } else if (error.response.data.errors.email) {
//     //               setErrorMessage(error.response.data.errors.email[0]);
//     //             } else if (error.response.data.errors.password) {
//     //               setErrorMessage(error.response.data.errors.password[0]);
//     //             } else if (error.response.data.message) {
//     //               setErrorMessage(error.response.data.message);
//     //             } else {
//     //               setErrorMessage("Could not complete the sign up");
//     //             }
//     //           }
//     //         );
//     //     },
//     //     // COOKIE ERROR
//     //     (error) => {
//     //       setErrorMessage("Could not complete the sign up");
//     //     }
//     //   );
//     // };

//     const login = (event) => {
//       event.preventDefault();
//       console.log('loggin in');
//         axios.defaults.withCredentials = true;
//         // CSRF COOKIE
//         axios.get("/sanctum/csrf-cookie").then(
//             (response) => {
//                 //console.log(response);
//                 // LOGIN
//                 axios
//                     .post("/api/SignIn", {
//                         email: userEmail,
//                         password: userPassword,
//                     })
//                     .then(
//                         (response) => {
//                             console.log(response);
//                             // GET USER
//                             setErrorMessage("");
//                             setAuthStatus(true);
//                             navigate("/");
//                         },
//                         // LOGIN ERROR
//                         (error) => {
//                             if (error.response) {
//                                 setErrorMessage(error.response.data.message);
//                             } else {
//                                 setErrorMessage("Could not complete the login");
//                             }
//                         }
//                     );
//             },
//             // COOKIE ERROR
//             (error) => {
//                 setErrorMessage("Could not complete the login");
//             }
//         );
//     };

//     // function logout() {
//     //   axios.defaults.withCredentials = true;
//     //   axios.get(hostName + "api/logout");
//     //   setUserId(0);
//     //   setUserName("");
//     //   setUserNameInput("");
//     //   setUserEmail("");
//     //   setUserPassword("");
//     //   setAuthStatus(NOT_LOGGED_IN);
//     // }

//     const contextValue = {
//         authStatus: authStatus,
//         userEmail: userEmail,
//         userPassword: userPassword,
//         handleUserEmail: handleUserEmail,
//         handleUserPassword: handleUserPassword,
//         login: login,
//         errorMessage: errorMessage,
//     };

//     return (
//         <AuthContext.Provider
//             value={{
//                 contextValue,
//             }}
//         >
//             {props.children}
//         </AuthContext.Provider>
//     );
// };

// export default AuthContext;
