import moment from "moment";
import { useEffect, useRef, useState } from "react";
import { Modal } from "react-bootstrap";
import Swal from "sweetalert2";
import { MODAL_TYPES, REQUEST_STATUS } from "../../Common/constants";
import {
  approveRequest,
  completeRequest,
  delayRequest,
  getRequestsByStatus,
  rejectRequest,
} from "../../models/firebase";
import HeaderMenu from "../../views/menu/HeaderMenu";
import SideMenu from "../../views/menu/SideMenu";
import RequestInfoModal from "../RequestInfoModal/RequestInfoModal";

export default function RequestsTable({
  requestStatus,
  actionTypes,
  setShowLoader,
}) {
  const [modalType, setModalType] = useState(null);
  const [showRequestInfo, setShowRequestInfo] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [message, setMessage] = useState("");
  const [loadedSnapshots, setLoadedSnapshots] = useState([]);
  const loadedSnapshotsRef = useRef([]);
  const fetchingData = useRef(false);
  const reachedEnd = useRef(false);
  const dateDanger = moment()
    .subtract(3, "days")
    .hours(0)
    .minutes(0)
    .seconds(0);
  const dateWarning = moment()
    .subtract(2, "days")
    .hours(0)
    .minutes(0)
    .seconds(0);
  const timeWarning = moment()
    .subtract(1, "days");

  useEffect(() => {
    getUsersData();
    window.addEventListener("scroll", (e) => handleScroll(e));

    return function cleanup() {
      console.log("Removing listener");
      window.removeEventListener("scroll", (e) => handleScroll(e));
    };
  }, []);

  const handleScroll = (e) => {
    let scrollTop = e.target.documentElement.scrollTop;
    //console.log(scrollTop);
    var distLeft =
      e.target.documentElement.scrollHeight -
      e.target.documentElement.clientHeight -
      e.target.documentElement.scrollTop;
    // console.log(distLeft);
    //const bottom = e.target.documentElement.scrollHeight - e.target.documentElement.scrollTop === e.target.documentElement.clientHeight;
    if (distLeft < 10) {
      console.log("Bottom");
      getUsersData();
    }
  };

  const getUsersData = async () => {
    if (fetchingData.current) return;
    if (reachedEnd.current) return;

    try {
      var lastSnapshot = null;
      if (loadedSnapshotsRef.current.length > 0)
        lastSnapshot =
          loadedSnapshotsRef.current[loadedSnapshotsRef.current.length - 1];

      setShowLoader(true);
      fetchingData.current = true;

      let snapshots = await getRequestsByStatus(requestStatus, lastSnapshot);

      // console.log(snapshots);

      if (snapshots.length === 0) {
        console.log("No matching documents.");
        reachedEnd.current = true;
      }

      let joinedSnapshots = [...loadedSnapshotsRef.current, ...snapshots];
      // setLoadedSnapshots((freshLoadedSnapshots) => [
      //   ...freshLoadedSnapshots,
      //   ...snapshots,
      // ]);
      setLoadedSnapshots(joinedSnapshots);
      loadedSnapshotsRef.current = joinedSnapshots;
    } catch (err) {
      console.log(err);
    }

    setShowLoader(false);
    fetchingData.current = false;
  };

  const handleChange = (event) => {
    if (event) {
      event.preventDefault();
    }

    let value = event.target.value;
    let name = event.target.name;

    if (name === "message") {
      setMessage(value);
    }
  };

  const onActionButtClick = (requestData, buttonType) => {
    setModalType(buttonType);
    setSelectedRequest(requestData);
    if (buttonType === MODAL_TYPES.DELAYED) {
      setMessage(
        "The service man is unavailable Today, \nYour patience on the Request is highly appreciated, \nThanks, AOA78"
      );
    } else if (buttonType === MODAL_TYPES.COMPLETE) {
      setMessage(
        "After confirmation from the Service Man, the stated concern has been resolved.\n" +
          "In case it persists, Kindly raise another request,\nThanks, AOA78 "
      );
    } else if (buttonType === MODAL_TYPES.APPROVE) {
      setMessage(
        "We've accepted your concern, the service man should visit your place in 3 Business Days,\n" +
          "Kindly stay available from 17:00 to 19:00,\nThanks, AOA78 "
      );
    } else if (buttonType === MODAL_TYPES.REOPEN) {
      setMessage(
        "Reopening the Request after Feedback from the Resident,\nThanks, AOA78 "
      );
    } else {
      setMessage("");
    }
  };

  const hideModal = () => {
    setModalType(null);
    setSelectedRequest(null);
  };

  const submitAction = async () => {
    try {
      setShowLoader(true);
      if (modalType === MODAL_TYPES.APPROVE) {
        await approveRequest(selectedRequest.id, message);
      } else if (modalType === MODAL_TYPES.REJECT) {
        await rejectRequest(selectedRequest.id, message);
      } else if (modalType === MODAL_TYPES.DELAYED) {
        await delayRequest(selectedRequest.id, message);
      } else if (modalType === MODAL_TYPES.COMPLETE) {
        await completeRequest(selectedRequest.id, message);
      } else if (modalType === MODAL_TYPES.REOPEN) {
        await delayRequest(selectedRequest.id, message, MODAL_TYPES.REOPEN);
      }

      if (modalType !== MODAL_TYPES.DELAYED) {
        let newLoadedSnapshots = loadedSnapshots.filter(
          (val) => val.id !== selectedRequest.id
        );
        setLoadedSnapshots(newLoadedSnapshots);
      }
      setMessage("");
      hideModal();
    } catch (err) {
      console.log(err);
      Swal.fire({
        icon: "error",
        title: "Unable to submit action",
      });
    }
    setShowLoader(false);
  };

  const displayRequestInfo = (requestData) => {
    setSelectedRequest(requestData);
    setShowRequestInfo(true);
  };

  const hideRequestInfo = () => {
    setSelectedRequest(null);
    setShowRequestInfo(false);
  };

  const rowColour = (date, updatedDate) => {
    if (
      requestStatus === REQUEST_STATUS.COMPLETED ||
      requestStatus === REQUEST_STATUS.REJECTED
    ) {
      return "";
    }
    return date.isBefore(dateDanger)
      ? "table-danger"
      : date.isBefore(dateWarning) && date.isAfter(dateDanger)
      ? "table-warning"
      : updatedDate.isBefore(timeWarning) ? "table-warning" :"";
  };

  return (
    <>
      <HeaderMenu />
      <div className="container-fluid" id="main">
        <div className="row">
          <SideMenu />
          <main role="main" className="col-md-9 ml-sm-auto col-lg-10 px-4">
            <h2 className="mt-3 mb-3">{requestStatus}</h2>
            <div className="table-responsive">
              <table
                className="table table-striped table-sm"
                id="tableContainer"
              >
                <thead>
                  <tr>
                    <th>Request ID</th>
                    <th>Address</th>
                    <th>Name</th>
                    <th>Mobile No.</th>
                    <th>Service</th>
                    <th>Raised On</th>
                    <th>Last Updated</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {loadedSnapshots.map((snapshot) => {
                    var snapshotDoc = snapshot.data();
                    return (
                      <tr
                        key={snapshot.id}
                        className={rowColour(
                          moment(snapshotDoc.createdAt.toDate()),
                          moment(snapshotDoc.lastUpdatedAt.toDate())
                        )}
                      >
                        <td>
                          <a
                            href="#"
                            onClick={() => displayRequestInfo(snapshot)}
                          >
                            View
                          </a>
                        </td>
                        <td>{snapshotDoc.address}</td>
                        <td>{snapshotDoc.name}</td>
                        <td>{snapshotDoc.mobile}</td>
                        <td>{snapshotDoc.serviceType}</td>
                        <td>
                          {" "}
                          {moment(snapshotDoc.createdAt.toDate()).format(
                            "Do MMM YYYY, h:mm a"
                          )}
                        </td>
                        <td>
                          {" "}
                          {moment(snapshotDoc.lastUpdatedAt.toDate()).format(
                            "Do MMM YYYY, h:mm a"
                          )}
                        </td>
                        <td>
                          {actionTypes.map((actionType) => (
                            <button
                              key={actionType}
                              className={`btn btn-sm ${
                                (actionType === MODAL_TYPES.REJECT || actionType === MODAL_TYPES.REOPEN)
                                  ? "btn-outline-danger"
                                  : actionType === MODAL_TYPES.DELAYED
                                  ? "btn-outline-warning"
                                  : "btn-outline-success"
                              }`}
                              style={{
                                width: "5rem",
                                marginRight: "0.5rem",
                                marginBottom: "0.5rem",
                              }}
                              onClick={() =>
                                onActionButtClick(snapshot, actionType)
                              }
                            >
                              {actionType}
                            </button>
                          ))}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </main>
        </div>
      </div>

      {showRequestInfo && selectedRequest && (
        <RequestInfoModal
          requests={[selectedRequest]}
          showModal={showRequestInfo}
          closeModal={hideRequestInfo}
        />
      )}

      {selectedRequest && (
        <Modal show={modalType !== null} onHide={hideModal}>
          <Modal.Header closeButton>
            <Modal.Title>
              {modalType} {selectedRequest.id}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <label htmlFor="messageInput">Message</label>
            <textarea
              className="form-control"
              rows={6}
              id="messageInput"
              name="message"
              placeholder="Enter message..."
              value={message}
              onChange={handleChange}
              maxLength={500}
              required
            />
          </Modal.Body>
          <Modal.Footer>
            <button className="btn btn-secondary" onClick={hideModal}>
              Cancel
            </button>
            <button className="btn btn-primary" onClick={submitAction}>
              Submit
            </button>
          </Modal.Footer>
        </Modal>
      )}
    </>
  );
}
