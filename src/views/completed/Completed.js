import { MODAL_TYPES, REQUEST_STATUS } from "../../Common/constants";
import RequestsTable from "../../Components/RequestsTable/RequestsTable";

export default function Completed({ setShowLoader }) {
  return (
    <RequestsTable
      requestStatus={REQUEST_STATUS.COMPLETED}
      actionTypes={[MODAL_TYPES.REOPEN]}
      setShowLoader={setShowLoader}
    />
  );
}
