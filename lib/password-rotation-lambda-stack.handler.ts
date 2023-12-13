import { Handler } from "aws-lambda";
import { SSMClient, PutParameterCommand } from "@aws-sdk/client-ssm";
import {
  RDSClient,
  ModifyTenantDatabaseCommand,
  ModifyDBInstanceCommand,
} from "@aws-sdk/client-rds";
import { randomUUID } from "crypto";

const clientConfig = { region: "ap-southeast-1" };
const ssmClient = new SSMClient(clientConfig);
const rdsClient = new RDSClient(clientConfig);

export const handler: Handler = async (event, context) => {
  console.debug("EVENT: \n" + JSON.stringify(event, null, 2));
  const password = generatePassword();
  const parameterName = process.env["PASSWORD_SSM_PARAM_NAME"];

  const command = new PutParameterCommand({
    Name: parameterName,
    Value: password,
    Overwrite: true,
  });
  const response = await ssmClient.send(command);
  console.debug("New Parameter Version:", response.Version);

  // TODO: Parameterize
  const dbIdentifier = "rdspasswordrotationstack-databasee85e1d09-lwuudefjmgvs";
  const setDbPasswordCommand = new ModifyDBInstanceCommand({
    DBInstanceIdentifier: dbIdentifier,
    MasterUserPassword: password,
  });
  const rdsResponse = await rdsClient.send(setDbPasswordCommand);

  console.log({ rdsResponse });
};

function generatePassword(): string {
  return randomUUID();
}
