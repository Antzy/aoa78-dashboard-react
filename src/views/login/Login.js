import { useContext, useEffect, useState } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { UserContext } from "../../Context/UserContextProvider";
import { login } from "../../models/firebase";

import "./sign-in.css";

export default function Login() {
  const { user } = useContext(UserContext);
  const history = useHistory();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      if (
        location.state &&
        location.state.from &&
        location.state.from.pathname
      ) {
        history.push(location.state.from.pathname);
      } else {
        history.push("/");
      }
    }
  }, [user]);

  const handleChange = (event) => {
    if (event) {
      event.preventDefault();
    }
    if (event.target.name === "email") {
      setEmail(event.target.value.toLowerCase().trim());
    } else if (event.target.name === "password") {
      setPassword(event.target.value.trim());
    }
    setError("");
  };

  const handleSubmit = async (event) => {
    try {
      if (event) {
        event.preventDefault();
      }

      console.log(email);
      console.log(password);

      if (password.length < 3) {
        setError("Password too short.");
        return;
      }

      setLoading(true);

      const user = await login(email, password);
      setError("");
    } catch (error) {
      if (error.code === "auth/wrong-password") {
        setError("* Incorrect email and password");
      } else {
        setError(error.code + ": " + error.message);
      }
      // setError(error.message ? "* " + error.message : error);
      console.log(error);
    }

    setLoading(false);
  };

  return (
    <div className="signin-container">
      <form className="form-signin text-center" onSubmit={handleSubmit}>
        <h1 className="h3 mb-5 text-muted">AOA-78 Dashboard</h1>
        <label htmlFor="inputEmail" className="sr-only">
          Email address
        </label>
        <input
          type="email"
          id="inputEmail"
          name="email"
          className="form-control"
          placeholder="Email address"
          value={email}
          onChange={handleChange}
          disabled={loading}
          required
          autoFocus
        />
        <label htmlFor="inputPassword" className="sr-only">
          Password
        </label>
        <input
          type="password"
          id="inputPassword"
          name="password"
          className="form-control mb-3"
          placeholder="Password"
          value={password}
          onChange={handleChange}
          disabled={loading}
          required
        />
        <div
          className="text-danger text-left w-100"
          style={{ fontSize: "0.75rem" }}
        >
          {error}
        </div>
        <button
          className="btn btn-lg btn-primary btn-block mt-3 d-flex justify-content-center align-items-center"
          type="submit"
          disabled={loading}
        >
          {loading && (
            <span
              className="spinner-border spinner-border-sm mr-2"
              role="status"
              aria-hidden="true"
            ></span>
          )}
          Sign in
        </button>
      </form>
    </div>
  );
}
