import { MODAL_TYPES, REQUEST_STATUS } from "../../Common/constants";
import RequestsTable from "../../Components/RequestsTable/RequestsTable";

export default function InProgress({ setShowLoader }) {
  return (
    <RequestsTable
      requestStatus={REQUEST_STATUS.IN_PROGRESS}
      actionTypes={[MODAL_TYPES.DELAYED, MODAL_TYPES.COMPLETE, MODAL_TYPES.REJECT]}
      setShowLoader={setShowLoader}
    />
  );
}
