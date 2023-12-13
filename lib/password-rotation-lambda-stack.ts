import { Construct } from "constructs";
import * as cdk from "aws-cdk-lib";
import * as nodeJs from "aws-cdk-lib/aws-lambda-nodejs";
import * as events from "aws-cdk-lib/aws-events";
import * as ssm from "aws-cdk-lib/aws-ssm";
import * as rds from "aws-cdk-lib/aws-rds";
import { LambdaFunction } from "aws-cdk-lib/aws-events-targets";
import { PolicyStatement } from "aws-cdk-lib/aws-iam";

export default class PasswordRotationLambdaStack extends cdk.Stack {
  constructor(
    scope: Construct,
    id: string,
    props: PasswordRotationLambdaStackProps
  ) {
    super(scope, id, props);
    const { passwordParameter, dbInstance } = props;

    const lambda = new nodeJs.NodejsFunction(this, "handler", {
      environment: {
        PASSWORD_SSM_PARAM_NAME: passwordParameter.parameterName,
      },
    });
    
    const ps = new  PolicyStatement()
    ps.addActions('rds:ModifyDBInstance');
    ps.addResources(dbInstance.instanceArn)
    lambda.addToRolePolicy(ps);

    passwordParameter.grantWrite(lambda);

    const schedule = new events.Rule(this, "RotationSchedule", {
      schedule: events.Schedule.rate(cdk.Duration.days(30)),
    });
    schedule.addTarget(new LambdaFunction(lambda));
  }
}

interface PasswordRotationLambdaStackProps extends cdk.StackProps {
  passwordParameter: ssm.StringParameter;
  dbInstance: rds.DatabaseInstance;
}
