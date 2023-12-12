import { Handler } from "aws-lambda";
import { SSMClient, PutParameterCommand } from "@aws-sdk/client-ssm";

const client = new SSMClient({ region: "ap-southeast-1" });

export const handler: Handler = async (event, context) => {
  console.log("EVENT: \n" + JSON.stringify(event, null, 2));
  const password = generatePassword();
  const parameterName = process.env["PASSWORD_SSM_PARAM_NAME"];

  const command = new PutParameterCommand({
    Name: parameterName,
    Value: password,
    Overwrite: true,
  });
  const response = await client.send(command);
  console.log("Parameter Store Version:", response.Version);

  return context.logStreamName;
};

function generatePassword(): string {
  return new Date().getTime().toString();
}
