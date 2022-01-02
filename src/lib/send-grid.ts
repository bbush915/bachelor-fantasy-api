import SendGrid from "@sendgrid/mail";

import configuration from "configuration";

SendGrid.setApiKey(configuration.sendGrid.apiKey!);

export enum EmailTemplates {
  ResetPassword = "d-a706efd5305e4c84ac41b4d5e3b5f501",
  VerifyEmail = "d-b4d5adead0f34887b970c3396b74ce0c",
}

export async function sendEmail(
  template: EmailTemplates,
  templateData: { to: string } & Record<string, string>
) {
  try {
    return SendGrid.send({
      to: templateData.to,
      from: configuration.sendGrid.sender!,
      templateId: template,
      dynamicTemplateData: templateData,
    });
  } catch (error) {
    return console.error(error);
  }
}
