import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as ssm from "aws-cdk-lib/aws-ssm";
import * as rds from "aws-cdk-lib/aws-rds";
import * as ec2 from "aws-cdk-lib/aws-ec2";
import PostgresRds from "./constructs/postgres-rds";

export class RdsPasswordRotationStack extends cdk.Stack {
  passwordParameter: ssm.StringParameter;
  dbInstance: rds.DatabaseInstance

  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

     this.passwordParameter = new ssm.StringParameter(this, "RdsPassword", {
      stringValue: "change-me-now",
      parameterName: "/rds-password-rotation-stack/dev/rds/password",
    });

    const vpc = ec2.Vpc.fromLookup(this, "DefaultVpc", {
      vpcId: "vpc-824693e4",
    });

    const rds = new PostgresRds(this, "Database", {
      password: this.passwordParameter.stringValue,
      vpc: vpc,
    });
    this.dbInstance = rds.dbInstance
  }
}
