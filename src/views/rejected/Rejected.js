import { MODAL_TYPES, REQUEST_STATUS } from "../../Common/constants";
import RequestsTable from "../../Components/RequestsTable/RequestsTable";

export default function Rejected({ setShowLoader }) {
  return (
    <RequestsTable
      requestStatus={REQUEST_STATUS.REJECTED}
      actionTypes={[MODAL_TYPES.APPROVE]}
      setShowLoader={setShowLoader}
    />
  );
}
