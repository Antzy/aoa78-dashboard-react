import {
  Route,
  BrowserRouter as Router,
  Switch,
  Redirect,
} from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute/ProtectedRoute";
import Login from "./views/login/Login";
import PendingApproval from "./views/pending-approval/PendingApproval";
import InProgress from "./views/in-progress/InProgress";
import Completed from "./views/completed/Completed";
import Rejected from "./views/rejected/Rejected";
import { useState } from "react";
import RequestsSearch from "./views/request-search/RequestSearch";

// import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  const [showLoader, setShowLoader] = useState(false);

  return (
    <>
      <Router>
        <Switch>
          <Route path="/login" component={Login} />
          <ProtectedRoute
            path="/pending-approval"
            component={PendingApproval}
            componentProps={{ setShowLoader }}
          />
          <ProtectedRoute
            path="/in-progress"
            component={InProgress}
            componentProps={{ setShowLoader }}
          />
          <ProtectedRoute
            path="/completed"
            component={Completed}
            componentProps={{ setShowLoader }}
          />
          <ProtectedRoute
            path="/rejected"
            component={Rejected}
            componentProps={{ setShowLoader }}
          />
          <ProtectedRoute
            path="/requests-search"
            component={RequestsSearch}
            componentProps={{ setShowLoader }}
          />
          <Route exact path="/">
            <Redirect to="/pending-approval" />
          </Route>
        </Switch>
      </Router>

      <div
        className="loader-container"
        style={{ display: showLoader ? "block" : "none", zIndex: "2000" }}
        id="loader"
      >
        <div className="loader"></div>
      </div>
    </>
  );
}

export default App;
