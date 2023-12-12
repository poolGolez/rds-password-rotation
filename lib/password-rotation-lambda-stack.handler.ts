import { Handler } from "aws-lambda";
import { SSMClient, PutParameterCommand } from "@aws-sdk/client-ssm";

const client = new SSMClient({ region: "ap-southeast-1" });

export const handler: Handler = async (event, context) => {
  console.debug("EVENT: \n" + JSON.stringify(event, null, 2));
  const password = generatePassword();
  const parameterName = process.env["PASSWORD_SSM_PARAM_NAME"];

  const command = new PutParameterCommand({
    Name: parameterName,
    Value: password,
    Overwrite: true,
  });
  const response = await client.send(command);
  console.debug("New Parameter Version:", response.Version);
};

function generatePassword(): string {
  return new Date().getTime().toString();
}
