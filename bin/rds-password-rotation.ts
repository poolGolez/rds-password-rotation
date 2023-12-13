#!/usr/bin/env node
import "source-map-support/register";
import * as cdk from "aws-cdk-lib";
import { RdsPasswordRotationStack } from "../lib/rds-password-rotation-stack";
import PasswordRotationLambdaStack from "../lib/password-rotation-lambda-stack";

const app = new cdk.App();
const env = {
  account: process.env.CDK_DEFAULT_ACCOUNT,
  region: process.env.CDK_DEFAULT_REGION,
};

const dataStack = new RdsPasswordRotationStack(
  app,
  "RdsPasswordRotationStack",
  {
    env,
  }
);

new PasswordRotationLambdaStack(app, "PasswordRotationStack", {
  env,
  passwordParameter: dataStack.passwordParameter,
  dbInstance: dataStack.dbInstance,
});
