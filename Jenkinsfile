pipeline {
  agent any

  options {
    skipDefaultCheckout(true)
    timestamps()
  }

  parameters {
    string(name: 'RUNNER_BRANCH', defaultValue: 'main', description: 'Git branch to execute for the generated test suite')
  }

  environment {
    CI = 'true'
    PLAYWRIGHT_JUNIT_OUTPUT_NAME = 'junit.xml'
  }

  stages {
    stage('Checkout Target Branch') {
      steps {
        script {
          def branchName = (params.RUNNER_BRANCH ?: 'main').trim()
          def remoteConfig = scm.userRemoteConfigs[0]
          checkout([
            $class: 'GitSCM',
            branches: [[name: "*/${branchName}"]],
            doGenerateSubmoduleConfigurations: false,
            extensions: [[$class: 'CleanBeforeCheckout']],
            userRemoteConfigs: [[
              url: remoteConfig.url,
              credentialsId: remoteConfig.credentialsId
            ]]
          ])
          env.EXECUTED_BRANCH = branchName
        }
      }
    }

    stage('Install') {
      steps {
        sh 'npm ci'
        sh 'npx playwright install chromium'
      }
    }

    stage('Validate Structure') {
      steps {
        sh 'npm run lint:structure'
      }
    }

    stage('Run Generated Tests') {
      steps {
        sh 'npm test'
      }
    }
  }

  post {
    always {
      archiveArtifacts artifacts: 'playwright-report/**, test-results/**, tests/generated/**, tests/gherkin/**', allowEmptyArchive: true
      junit testResults: 'test-results/junit.xml', allowEmptyResults: true
    }
  }
}
