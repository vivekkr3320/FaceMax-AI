// Structured Logger Utility matching Vercel/AWS CloudWatch log systems

export type LogEventCode = 
  | "USER_REGISTERED"
  | "PAYMENT_SUCCESS"
  | "REPORT_GENERATED"
  | "LATENCY_GEMINI"
  | "UPLOAD_FAILED"
  | "PAYMENT_FAILED"
  | "RATE_LIMIT_EXCEEDED"
  | "IMAGE_VALIDATION_FAILED";

interface LogPayload {
  event: LogEventCode;
  userId?: string;
  orderId?: string;
  latencyMs?: number;
  message?: string;
  error?: string;
}

export const logger = {
  info: (payload: LogPayload) => {
    console.log(
      JSON.stringify({
        level: "INFO",
        timestamp: new Date().toISOString(),
        ...payload,
      })
    );
  },

  warn: (payload: LogPayload) => {
    console.warn(
      JSON.stringify({
        level: "WARN",
        timestamp: new Date().toISOString(),
        ...payload,
      })
    );
  },

  error: (payload: LogPayload) => {
    // Sentry Mock trigger alert warning
    console.error(
      JSON.stringify({
        level: "ERROR",
        timestamp: new Date().toISOString(),
        sentry_alert: true, // Tag to trigger Sentry alert logs
        ...payload,
      })
    );
  }
};
