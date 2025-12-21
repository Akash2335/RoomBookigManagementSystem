import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import { useDispatch, useSelector } from "react-redux";
import { hideSnackbar } from "../app/snackbarSlice";
import type { RootState } from "../app/store";

export default function AppSnackbar() {
  const dispatch = useDispatch();
  const { open, message, severity } = useSelector(
    (state: RootState) => state.snackbar
  );

  return (
    <Snackbar
      open={open}
      autoHideDuration={3000}
      onClose={(event, reason) => dispatch(hideSnackbar())}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
    >
      <Alert
        onClose={(_event) => dispatch(hideSnackbar())}
        severity={severity}
        variant="filled"
      >
        {message}
      </Alert>
    </Snackbar>
  );
}
