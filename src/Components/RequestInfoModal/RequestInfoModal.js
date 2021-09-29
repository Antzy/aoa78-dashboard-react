import moment from "moment";
import { Accordion, Button, Card, Modal } from "react-bootstrap";

export default function RequestInfoModal({ requests, showModal, closeModal }) {
  const getLogDate = (requestData, logIndex) => {
    let logDate = null;
    if (
      requestData.logs &&
      requestData.logs[logIndex] &&
      requestData.logs[logIndex].timestamp
    ) {
      logDate = requestData.logs[logIndex].timestamp.toDate();
    } else {
      if (requestData.lastLoggedAt) {
        logDate = requestData.lastLoggedAt.toDate();
      } else return "-";
    }

    if (logDate != null) {
      return moment(logDate).format("DD/MM/YYYY");
    }
  };

  return (
    <Modal show={showModal} onHide={closeModal} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Requests Info</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Accordion defaultActiveKey="0">
          {requests.map((request, index) => (
            <Card key={request.id}>
              <Card.Header style={{ padding: 0 }}>
                <Accordion.Toggle
                  as={Button}
                  variant="light"
                  eventKey={index.toString()}
                  className="pb-3 pl-4 pr-4 pt-3 w-100"
                  // style={{ padding: "0.75rem 1.25rem" }}
                >
                  <div className="row w-100">
                    <div className="col-md-5 text-left">
                      Request ID:{" "}
                      <b style={{ userSelect: "text" }}>{request.id}</b>
                    </div>
                    <div className="col-md-3 text-left">
                      Type: <b>{request.data().serviceType}</b>
                    </div>
                    <div className="col-md-4 text-left">
                      Status: <b>{request.data().status}</b>
                    </div>
                  </div>
                </Accordion.Toggle>
              </Card.Header>
              <Accordion.Collapse eventKey={index.toString()}>
                <Card.Body style={{ padding: 0 }}>
                  <table className="table">
                    <thead className="text-secondary">
                      <tr>
                        <th scope="col">Date</th>
                        <th scope="col">Event</th>
                        <th scope="col">Message</th>
                        <th scope="col">Action By</th>
                      </tr>
                    </thead>
                    <tbody>
                      {request.data().logs.map((log, index) => (
                        <tr style={{ width: "100%" }} key={index}>
                          <td scope="row" style={{ width: "15%" }}>
                            {getLogDate(request.data(), index)}
                          </td>
                          <td style={{ width: "15%" }}>{log.event}</td>
                          <td style={{ width: "55%", whiteSpace: "pre-wrap" }}>
                            {log.message}
                          </td>
                          <td style={{ width: "15%" }}>{log.user}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </Card.Body>
              </Accordion.Collapse>
            </Card>
          ))}
        </Accordion>
      </Modal.Body>
    </Modal>
  );
}
