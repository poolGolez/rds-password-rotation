import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as ssm from "aws-cdk-lib/aws-ssm";
import * as rds from "aws-cdk-lib/aws-rds";
import * as ec2 from "aws-cdk-lib/aws-ec2";

export class RdsPasswordRotationStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const rdsPasswordParameter = new ssm.StringParameter(this, "RdsPassword", {
      stringValue: "my-secret-password",
      parameterName: "/rds-password-rotation-stack/dev/rds/password",
    });

    const vpc = ec2.Vpc.fromLookup(this, "DefaultVpc", {
      vpcId: "vpc-824693e4",
      // isDefault: true,
    });
    console.log({
      publicSubnets: vpc.publicSubnets,
      privateSubnets: vpc.privateSubnets
    })

    new rds.DatabaseInstance(this, "PostgresInstance1", {
      engine: rds.DatabaseInstanceEngine.POSTGRES,
      // Generate the secret with admin username `postgres` and random password
      credentials: rds.Credentials.fromGeneratedSecret("postgres"),
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      instanceType: ec2.InstanceType.of(ec2.InstanceClass.T3, ec2.InstanceSize.MICRO),
      vpc,
      vpcSubnets: { subnetType: ec2.SubnetType.PUBLIC }
    });
  }
}
