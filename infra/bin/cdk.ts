#!/usr/bin/env node
import { AthenaStack } from '../lib/athena-stack'
import * as cdk from 'aws-cdk-lib'

const app = new cdk.App()
new AthenaStack(app, 'AthenaStack', {
  env: {
    account: '636706115197',
    region: 'us-west-1',
  },
})
