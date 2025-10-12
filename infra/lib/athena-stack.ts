import * as cdk from 'aws-cdk-lib'
import * as ec2 from 'aws-cdk-lib/aws-ec2'
import * as iam from 'aws-cdk-lib/aws-iam'
import { Construct } from 'constructs'

export class AthenaStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props)

    const vpc = ec2.Vpc.fromLookup(this, 'Vpc', {
      isDefault: true,
    })

    const ec2Role = new iam.Role(this, 'Ec2Role', {
      assumedBy: new iam.ServicePrincipal('ec2.amazonaws.com'),
    })

    const instanceProfile = new iam.InstanceProfile(this, 'InstanceProfile', {
      role: ec2Role,
    })

    const securityGroup = new ec2.SecurityGroup(this, 'SecurityGroup', {
      vpc,
    })

    securityGroup.addIngressRule(ec2.Peer.anyIpv4(), ec2.Port.SSH)
    securityGroup.addIngressRule(ec2.Peer.anyIpv4(), ec2.Port.HTTP)
    securityGroup.addIngressRule(ec2.Peer.anyIpv4(), ec2.Port.HTTPS)

    const keyPair = new ec2.KeyPair(this, 'KeyPair')

    const userData = ec2.UserData.forLinux()
    userData.addCommands(
      'yum update -y',
      'yum install -y git docker',

      'DOCKER_CONFIG=${DOCKER_CONFIG:-/usr/local/lib/docker}',
      'mkdir -p $DOCKER_CONFIG/cli-plugins',
      'curl -SL https://github.com/docker/compose/releases/download/v2.40.0/docker-compose-linux-aarch64 -o $DOCKER_CONFIG/cli-plugins/docker-compose',
      'chmod +x $DOCKER_CONFIG/cli-plugins/docker-compose',

      'service docker start',

      'git clone https://github.com/abhithube/athena /opt/athena',

      'docker network create athena',
      'cd /opt/athena/services/caddy && docker compose up -d',
      'cd /opt/athena/services/authelia && docker compose up -d',
      'cd /opt/athena/services/portainer && docker compose up -d',
      'cd /opt/athena/services/glance && docker compose up -d',
    )

    new ec2.LaunchTemplate(this, 'LaunchTemplate', {
      associatePublicIpAddress: false,
      instanceProfile,
      instanceType: ec2.InstanceType.of(
        ec2.InstanceClass.T4G,
        ec2.InstanceSize.NANO,
      ),
      keyPair,
      machineImage: ec2.MachineImage.latestAmazonLinux2023({
        cpuType: ec2.AmazonLinuxCpuType.ARM_64,
      }),
      securityGroup,
      userData,
    })

    new ec2.CfnEIP(this, 'EIP')
  }
}
