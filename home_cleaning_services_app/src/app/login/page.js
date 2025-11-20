"use client";
import NavBarForms from "../../components/NavBar-Forms";
import Link from "next/link";
import "../../styles/Login.css";
import { useState } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { useRouter } from "next/navigation";
import LoadingSmall from "../../components/LoadingSmall";
//login page for bee/nectar
const Login = () => {
  const router = useRouter();
  const initialLogin = {
    email: "",
    password: "",
    role: "",
  };
  const [isLoading, setIsLoading] = useState(false);
  const [loginInfo, setLoginInfo] = useState(initialLogin);
  const [loginErrors, setLoginErrors] = useState({});

  //check form data entered is valid
  const isValid = () => {
    let loginErr = {};
    if (!loginInfo.email) {
      loginErr.email = "Please enter your email.";
    }
    if (!loginInfo.password) {
      loginErr.password = "Please enter your password.";
    }
    if (!loginInfo.role) {
      loginErr.role = "Please enter your role.";
    }
    setLoginErrors(loginErr);
    return Object.keys(loginErr).length == 0;
  };
  //logs bee/nectar in via backend api call
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      //user data is valid
      setIsLoading(true);
      if (isValid()) {
        //api call
        const res = await axios.post("/api/users/login", loginInfo);
        setTimeout(() => {
          setIsLoading(false);
        }, 2000);
        //user successfully logged in
        toast.success(`${res.data.message}`, {
          position: "top-right",
        });
        //if bee redirect them to their bee profile
        if (loginInfo.role === "bee") {
          await setTimeout(() => {
            router.push("/bee-profile");
          }, 3000);
        }
        //if nectar redirect them to their nectar profile
        else if (loginInfo.role === "nectar") {
          await setTimeout(() => {
            router.push("/nectar-profile");
          }, 3000);
        }
        //reset login data and errors
        setLoginInfo(initialLogin);
        setLoginErrors("");
      } else {
        setTimeout(() => {
          setIsLoading(false);
        }, 1000);
      }
    } catch (err) {
      //send user an err response
      setTimeout(() => {
        setIsLoading(false);
      }, 1000);
      if (err.response && err.response.data.message) {
        toast.error(`${err.response.data.message}`);
      }
    }
  };
  return (
    <>
      <NavBarForms />
      <section className="Login">
        <div>
          <div>
            <Toaster />
          </div>
          <form className="Login-Form" onSubmit={handleLogin}>
            <div>
              <img
                className="Login-HomeImage"
                src="/hive.png"
                alt="hive image"
              />
            </div>
            <div className="Login-Label">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="Enter email here..."
                className="Login-Input"
                value={loginInfo.email}
                onChange={(e) => {
                  setLoginInfo({ ...loginInfo, email: e.target.value });
                }}
              />
              <div className="Login-Errors">{loginErrors.email}</div>
            </div>
            <div className="Login-Label">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                className="Login-Input"
                placeholder="Enter password here..."
                value={loginInfo.password}
                onChange={(e) => {
                  setLoginInfo({ ...loginInfo, password: e.target.value });
                }}
              />
              <div className="Login-Errors">{loginErrors.password}</div>
            </div>
            <div className="Login-Label">
              <label htmlFor="role">Role</label>
              <select
                className="Select-Input"
                name="role"
                id="role"
                value={loginInfo.role}
                onChange={(e) => {
                  setLoginInfo({ ...loginInfo, role: e.target.value });
                }}
              >
                <option>--Please choose your role--</option>
                <option value="bee">Bee</option>
                <option value="nectar">Nectar</option>
              </select>
              <div className="Login-Errors">{loginErrors.role}</div>
            </div>
            {isLoading ? (
              <LoadingSmall />
            ) : (
              <button className="Login-Button">Login</button>
            )}
            <div className="Login-Ref">
              <p className="Login-LoginRef">Don't have an account?</p>
              <div className="Login-Ref-Links">
                <Link href="/register-bee">Bees</Link>
                <Link href="/register-nectar">Nectars</Link>
              </div>
            </div>
          </form>
        </div>
      </section>
    </>
  );
};
export default Login;
