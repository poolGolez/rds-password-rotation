import { Construct } from "constructs";
import * as cdk from "aws-cdk-lib";
import * as nodeJs from "aws-cdk-lib/aws-lambda-nodejs";
import * as events from "aws-cdk-lib/aws-events";
import { Function } from "aws-cdk-lib/aws-lambda";
import { LambdaFunction } from "aws-cdk-lib/aws-events-targets";

export default class PasswordRotationLambdaStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: cdk.StackProps) {
    super(scope, id, props);

    const lambda = new nodeJs.NodejsFunction(this, "handler");

    const schedule = new events.Rule(this, 'RotationSchedule', {
      schedule: events.Schedule.rate(cdk.Duration.days(30))
    })
    schedule.addTarget(new LambdaFunction(lambda))
  }
}
