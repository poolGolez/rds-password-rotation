import {
  InstanceType,
  InstanceClass,
  InstanceSize,
  SubnetType,
  IVpc,
  SecurityGroup,
  Peer,
  Port,
} from "aws-cdk-lib/aws-ec2";
import { Construct } from "constructs";
import { SecretValue, RemovalPolicy } from "aws-cdk-lib";
import {
  Credentials,
  DatabaseInstance,
  DatabaseInstanceEngine,
} from "aws-cdk-lib/aws-rds";

export default class PostgresRds extends Construct {
  constructor(scope: Construct, id: string, props: PostgresRdsProps) {
    super(scope, id);

    const credentials = Credentials.fromPassword(
      "root",
      new SecretValue(props.password)
    );

    const dbAccessSecGroup = new SecurityGroup(this, "DbAccess", { vpc: props.vpc });
    dbAccessSecGroup.addIngressRule(Peer.anyIpv4(), Port.tcp(5432), "Allow Postgress access");
    const securityGroups = [dbAccessSecGroup];

    new DatabaseInstance(this, id, {
      engine: DatabaseInstanceEngine.POSTGRES,
      databaseName: "app",
      securityGroups,
      credentials,
      removalPolicy: RemovalPolicy.DESTROY,
      instanceType: InstanceType.of(InstanceClass.T3, InstanceSize.MICRO),
      vpc: props.vpc,
      vpcSubnets: { subnetType: SubnetType.PUBLIC },
    });
  }
}

export interface PostgresRdsProps {
  password: string;
  vpc: IVpc;
}
