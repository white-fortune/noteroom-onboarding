export default class EmailService {
    private static BREVO_API_URL = "https://api.brevo.com/v3/smtp/email"
    private static BREVO_API = process.env.BREVO_API!

    static async sendEmail(templateID: string, email: string, params: Record<string, string>) {
        try {
            const response = await fetch(this.BREVO_API_URL, {
                method: "POST",
                headers: {
                    "api-key": this.BREVO_API,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    to: [{ email }],
                    templateId: parseInt(templateID),
                    params,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error("Brevo API Error:", errorData);
                return { ok: false, error: new Error("Failed to send email") };
            }

            const data = await response.json() as { messageId: string };
            return { ok: true, messageId: data.messageId };
        } catch (error) {
            console.error(error)
            return { ok: false, error };
        }
    }
}
