import { MODAL_TYPES, REQUEST_STATUS } from "../../Common/constants";
import RequestsTable from "../../Components/RequestsTable/RequestsTable";

export default function PendingApproval({ setShowLoader }) {
  return (
    <RequestsTable
      requestStatus={REQUEST_STATUS.PENDING_APPROVAL}
      actionTypes={[MODAL_TYPES.APPROVE, MODAL_TYPES.REJECT]}
      setShowLoader={setShowLoader}
    />
  );
}
