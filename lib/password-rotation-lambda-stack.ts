import { Construct } from "constructs";
import * as cdk from "aws-cdk-lib";
import * as nodeJs from "aws-cdk-lib/aws-lambda-nodejs";
import * as events from "aws-cdk-lib/aws-events";
import * as ssm from "aws-cdk-lib/aws-ssm";
import { LambdaFunction } from "aws-cdk-lib/aws-events-targets";

export default class PasswordRotationLambdaStack extends cdk.Stack {
  constructor(
    scope: Construct,
    id: string,
    props: PasswordRotationLambdaStackProps
  ) {
    super(scope, id, props);
    const { passwordParameter } = props;

    const lambda = new nodeJs.NodejsFunction(this, "handler", {environment: {
      PASSWORD_SSM_PARAM_NAME: passwordParameter.parameterName 
    }});
    passwordParameter.grantWrite(lambda);

    const schedule = new events.Rule(this, "RotationSchedule", {
      schedule: events.Schedule.rate(cdk.Duration.days(30)),
    });
    schedule.addTarget(new LambdaFunction(lambda));
  }
}

interface PasswordRotationLambdaStackProps extends cdk.StackProps {
  passwordParameter: ssm.StringParameter;
}
