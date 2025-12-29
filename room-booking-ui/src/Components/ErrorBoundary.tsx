import React, { Component } from "react";
import type { ReactNode } from "react";
import { Alert, AlertTitle, Typography, Button, Box } from "@mui/material";
import ErrorIcon from "@mui/icons-material/Error";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Error logged for debugging; remove in production if not needed
  }

  render() {
    if (this.state.hasError) {
      return (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight="100vh"
          sx={{ backgroundColor: "#f5f5f5", padding: 2 }}
        >
          <Alert
            severity="error"
            icon={<ErrorIcon />}
            sx={{ maxWidth: 600, width: "100%" }}
          >
            <AlertTitle sx={{ fontSize: "1.5rem", fontWeight: "bold" }}>
              Something went wrong.
            </AlertTitle>
            <Typography variant="body1" sx={{ marginBottom: 2 }}>
              Please try refreshing the page or contact support if the problem persists.
            </Typography>
            <Button
              variant="contained"
              color="primary"
              onClick={() => window.location.reload()}
              sx={{ marginRight: 1 }}
            >
              Refresh Page
            </Button>
            {process.env.NODE_ENV === "development" && this.state.error && (
              <details style={{ marginTop: 2, whiteSpace: "pre-wrap", fontSize: "0.875rem" }}>
                {this.state.error.toString()}
              </details>
            )}
          </Alert>
        </Box>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
