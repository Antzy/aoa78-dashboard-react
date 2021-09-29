import { useState } from "react";
import Swal from "sweetalert2";
import { ADDRESSES, SEARCH_TYPES } from "../../Common/constants";
import RequestInfoModal from "../../Components/RequestInfoModal/RequestInfoModal";
import {
  getServiceRequestById,
  getServiceRequestsByAddress,
} from "../../models/firebase";
import HeaderMenu from "../menu/HeaderMenu";
import SideMenu from "../menu/SideMenu";

export default function RequestsSearch({ setShowLoader }) {
  const [requestId, setRequestId] = useState("");
  const [address, setAddress] = useState({
    block: "",
    building: "",
    flat: "",
  });
  const [requests, setRequests] = useState(null);

  const handleChange = (event) => {
    if (event) {
      event.preventDefault();
    }

    let value = event.target.value;
    let name = event.target.name;
    let newAddress = { ...address };

    switch (name) {
      case "referenceIdInput":
        setRequestId(value);
        break;
      case "blockInput":
        newAddress.block = value;
        if (
          !ADDRESSES[newAddress.block] ||
          !ADDRESSES[newAddress.block][newAddress.building]
        ) {
          newAddress.building = "";
          newAddress.flat = "";
        } else {
          if (
            !ADDRESSES[newAddress.block][newAddress.building].includes(
              newAddress.flat
            )
          ) {
            newAddress.flat = "";
          }
        }
        setAddress(newAddress);
        // setAddress({ ...address, block: value, building: "", flat: "" });
        break;
      case "buildingInput":
        newAddress.building = value;
        if (
          !ADDRESSES[newAddress.block] ||
          !ADDRESSES[newAddress.block][newAddress.building] ||
          !ADDRESSES[newAddress.block][newAddress.building].includes(
            newAddress.flat
          )
        ) {
          newAddress.flat = "";
        }
        setAddress(newAddress);
        // setAddress({ ...address, building: value, flat: "" });
        break;
      case "flatInput":
        setAddress({ ...address, flat: value });
        break;
    }
  };

  const onReferenceIdFormSubmit = (event) => {
    if (event) event.preventDefault();
    if (requestId === "") return;
    // history.push({
    //   pathname: "/view-requests",
    //   search: `?${SEARCH_TYPES.REQUEST_ID}=${requestId}`,
    // });
    fetchRequests(SEARCH_TYPES.REQUEST_ID);
  };

  const onAddressFormSubmit = (event) => {
    if (event) event.preventDefault();
    if (address.block === "" || address.building === "" || address.flat === "")
      return;
    // history.push({
    //   pathname: "/view-requests",
    //   search: `?${SEARCH_TYPES.ADDRESS}=${address.block}-${address.building}-${address.flat}`,
    // });
    fetchRequests(SEARCH_TYPES.ADDRESS);
  };

  const fetchRequests = async (searchType) => {
    let requestsData = null;
    // let params = new URLSearchParams(location.search);
    setShowLoader(true);
    if (searchType === SEARCH_TYPES.REQUEST_ID) {
      try {
        requestsData = await getServiceRequestById(requestId);
        setRequests(requestsData);
      } catch (err) {
        Swal.fire({
          icon: "error",
          title: "Invalid Request ID",
        });
      }
    } else if (searchType === SEARCH_TYPES.ADDRESS) {
      try {
        requestsData = await getServiceRequestsByAddress(
          `${address.block}-${address.building}-${address.flat}`
        );
        setRequests(requestsData);
      } catch (err) {
        Swal.fire({
          icon: "error",
          title: "No requests found for provided address",
        });
      }
    }
    setShowLoader(false);
  };

  const hideRequestInfo = () => {
    setRequests(null);
  };

  return (
    <>
      <HeaderMenu />
      <div className="container-fluid" id="main">
        <div className="row">
          <SideMenu />
          <main role="main" className="col-md-9 ml-sm-auto col-lg-10 px-4">
            <h2 className="mt-3 mb-3">Search Requests</h2>

            <div className="card">
              <div className="card-body">
                <div className="mb-3 row">
                  <div className="col-md-12">
                    <h4>Find By Request ID</h4>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-9 col-xl-8 ml-auto mr-auto">
                    <form onSubmit={onReferenceIdFormSubmit}>
                      <div className="align-items-center form-row">
                        <div className="col-sm form-group">
                          <input
                            type="text"
                            name="referenceIdInput"
                            className="form-control pl-4 pr-4"
                            placeholder="Enter Request ID..."
                            value={requestId}
                            onChange={handleChange}
                            required
                          />
                        </div>
                        <div className="col-sm-auto form-group text-right">
                          <button
                            type="submit"
                            className="btn btn-primary pl-4 pr-4 rounded-pill"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 24 24"
                              fill="currentColor"
                              width="1.25em"
                              height="1.25em"
                              className="mr-1"
                            >
                              <g>
                                <path fill="none" d="M0 0h24v24H0z" />
                                <path d="M18.031 16.617l4.283 4.282-1.415 1.415-4.282-4.283A8.96 8.96 0 0 1 11 20c-4.968 0-9-4.032-9-9s4.032-9 9-9 9 4.032 9 9a8.96 8.96 0 0 1-1.969 5.617zm-2.006-.742A6.977 6.977 0 0 0 18 11c0-3.868-3.133-7-7-7-3.868 0-7 3.132-7 7 0 3.867 3.132 7 7 7a6.977 6.977 0 0 0 4.875-1.975l.15-.15z" />
                              </g>
                            </svg>
                            <span className="align-middle">Search</span>
                          </button>
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
            <div className="align-items-center mb-4 mt-4 row">
              <div className="col">
                <hr className="border-secondary mb-0 mt-0" />
              </div>
              <div className="col-auto">
                <h2 className="font-weight-bold h4 mb-0 text-uppercase">OR</h2>
              </div>
              <div className="col">
                <hr className="border-secondary mb-0 mt-0" />
              </div>
            </div>
            <div className="card">
              <div className="card-body">
                <div className="mb-3 row">
                  <div className="col-md-12">
                    <h4>Find Open Requests By Address</h4>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-9 col-xl-8 ml-auto mr-auto">
                    <form onSubmit={onAddressFormSubmit}>
                      <div className="form-row row">
                        <div className="col-md-4">
                          <div className="form-group">
                            <label htmlFor="blockInput">Block</label>
                            <select
                              className="form-control"
                              id="blockInput"
                              name="blockInput"
                              value={address.block}
                              onChange={handleChange}
                              required
                            >
                              <option value="" disabled>
                                -- Block --
                              </option>
                              {Object.keys(ADDRESSES).map((block) => (
                                <option key={block} value={block}>
                                  {block}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>
                        <div className="col-md-4">
                          <div className="form-group">
                            <label htmlFor="buildingInput">Building No.</label>
                            <select
                              className="form-control"
                              id="buildingInput"
                              name="buildingInput"
                              value={address.building}
                              onChange={handleChange}
                              required
                            >
                              <option value="" disabled>
                                -- Building No. --
                              </option>
                              {address.block &&
                                ADDRESSES[address.block] &&
                                Object.keys(ADDRESSES[address.block]).map(
                                  (building) => (
                                    <option key={building} value={building}>
                                      {building}
                                    </option>
                                  )
                                )}
                            </select>
                          </div>
                        </div>
                        <div className="col-md-4">
                          <div className="form-group">
                            <label htmlFor="flatInput">Flat</label>
                            <select
                              className="form-control"
                              id="flatInput"
                              name="flatInput"
                              value={address.flat}
                              onChange={handleChange}
                              required
                            >
                              <option value="" disabled>
                                -- Flat --
                              </option>
                              {address.block &&
                                ADDRESSES[address.block] &&
                                ADDRESSES[address.block][address.building] &&
                                ADDRESSES[address.block][address.building].map(
                                  (flat) => (
                                    <option key={flat} value={flat}>
                                      {flat}
                                    </option>
                                  )
                                )}
                            </select>
                          </div>
                        </div>
                      </div>
                      <div className="align-items-center form-row">
                        <div className="col-sm-12 form-group text-right">
                          <button
                            type="submit"
                            className="btn btn-primary pl-4 pr-4 rounded-pill"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 24 24"
                              fill="currentColor"
                              width="1.25em"
                              height="1.25em"
                              className="mr-1"
                            >
                              <g>
                                <path fill="none" d="M0 0h24v24H0z" />
                                <path d="M18.031 16.617l4.283 4.282-1.415 1.415-4.282-4.283A8.96 8.96 0 0 1 11 20c-4.968 0-9-4.032-9-9s4.032-9 9-9 9 4.032 9 9a8.96 8.96 0 0 1-1.969 5.617zm-2.006-.742A6.977 6.977 0 0 0 18 11c0-3.868-3.133-7-7-7-3.868 0-7 3.132-7 7 0 3.867 3.132 7 7 7a6.977 6.977 0 0 0 4.875-1.975l.15-.15z" />
                              </g>
                            </svg>
                            <span className="align-middle">Search</span>
                          </button>
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>

      {requests && (
        <RequestInfoModal
          requests={requests}
          showModal={requests !== null}
          closeModal={hideRequestInfo}
        />
      )}
    </>
  );
}
