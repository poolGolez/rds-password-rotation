import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as ssm from "aws-cdk-lib/aws-ssm";

export class RdsPasswordRotationStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const rdsPasswordParameter = new ssm.StringParameter(this, "RdsPassword", {
      stringValue: "my-secret-password",
      parameterName: "/rds-password-rotation-stack/dev/rds/password",
    });
  }
}
