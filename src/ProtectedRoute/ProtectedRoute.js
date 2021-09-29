import { useContext } from "react";
import { Redirect, Route } from "react-router-dom";
import { UserContext } from "../Context/UserContextProvider";

export default function ProtectedRoute({
  component: Component,
  componentProps,
  ...rest
}) {
  const { user } = useContext(UserContext);

  return (
    <Route
      {...rest}
      render={(props) =>
        user ? (
          <Component {...props} {...componentProps} />
        ) : (
          <Redirect
            to={{ pathname: "/login", state: { from: props.location } }}
          />
        )
      }
    />
  );
}
