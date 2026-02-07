import axios from "axios";

const NOTIFY_URL = process.env.NOTIFY_URL!;
const SERVICE_TOKEN = process.env.NOTIFY_SERVICE_TOKEN!;

export const NotificationClient = {
  async sendWelcomeEmail(email: string, name: string) {
    try {
      await axios.post(
        `${NOTIFY_URL}/internal/notify/email/template`,
        {
          to: email,
          template: "welcome",
          data: { name }
        },
        {
          headers: {
            "x-service-token": SERVICE_TOKEN
          }
        }
      );
    } catch (err: Error | any) {
      console.error("Error sending welcome email:", err.message);
    }
  }
};
