import { Construct } from "constructs";
import * as cdk from "aws-cdk-lib";
import * as nodeJs from "aws-cdk-lib/aws-lambda-nodejs";

export default class PasswordRotationLambdaStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: cdk.StackProps) {
    super(scope, id, props);

    const lambda = new nodeJs.NodejsFunction(this, "handler");
  }
}
