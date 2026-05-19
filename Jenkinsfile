pipeline {
  agent any

  options {
    skipDefaultCheckout(true)
    timestamps()
  }

  parameters {
    string(name: 'RUNNER_BRANCH', defaultValue: 'main', description: 'Git branch to execute for the generated test suite')
    string(name: 'RUNNER_PROFILE', defaultValue: 'gherkin-playwright', description: 'Execution profile preset sent by Testing Hive')
    string(name: 'RUNNER_MODE', defaultValue: 'feature-spec-ts', description: 'Runner mode sent by Testing Hive')
    string(name: 'RUNNER_SPEC', defaultValue: '', description: 'Optional Playwright spec path for targeted reruns')
    string(name: 'RUNNER_GREP', defaultValue: '', description: 'Optional Playwright grep filter for targeted reruns')
  }

  environment {
    CI = 'true'
    PLAYWRIGHT_JUNIT_OUTPUT_NAME = 'junit.xml'
    PLAYWRIGHT_EXIT = '0'
    JAVA_EXIT = '0'
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
        script {
          def profile = (params.RUNNER_PROFILE ?: 'gherkin-playwright').trim()
          if (profile == 'excel-selenium-java') {
            sh 'mvn -B -DskipTests dependency:go-offline'
          } else {
            sh 'npm ci'
            sh 'npx playwright install chromium'
          }
        }
      }
    }

    stage('Validate Structure') {
      steps {
        script {
          def profile = (params.RUNNER_PROFILE ?: 'gherkin-playwright').trim()
          if (profile == 'excel-selenium-java') {
            sh 'test -f pom.xml'
            sh 'test -d src/test/java/generated'
          } else {
            sh 'npm run lint:structure'
          }
        }
      }
    }

    stage('Run Generated Tests') {
      steps {
        script {
          def profile = (params.RUNNER_PROFILE ?: 'gherkin-playwright').trim()
          if (profile == 'excel-selenium-java') {
            def testExit = sh(script: 'mvn -B test', returnStatus: true)
            env.JAVA_EXIT = "${testExit}"
            if (testExit != 0 && !fileExists('target/surefire-reports')) {
              error("Maven/Selenium execution failed before Surefire results were produced.")
            }
            if (testExit != 0) {
              echo "Java/Selenium reported failing tests, but Surefire output is available for post-run analysis."
            }
          } else {
            def specPath = (params.RUNNER_SPEC ?: '').trim()
            def grepFilter = (params.RUNNER_GREP ?: '').trim()
            def escapedSpec = specPath.replace("'", "'\"'\"'")
            def escapedGrep = grepFilter.replace("'", "'\"'\"'")
            def testCmd = 'npx playwright test'
            if (escapedSpec) {
              testCmd += " '${escapedSpec}'"
            }
            if (escapedGrep) {
              testCmd += " --grep '${escapedGrep}'"
            }
            def testExit = sh(script: testCmd, returnStatus: true)
            env.PLAYWRIGHT_EXIT = "${testExit}"
            if (testExit != 0 && !fileExists('test-results/junit.xml')) {
              error("Playwright execution failed before JUnit results were produced.")
            }
            if (testExit != 0) {
              echo "Playwright reported failing tests, but JUnit output is available for post-run analysis."
            }
          }
        }
      }
    }
  }

  post {
    always {
      archiveArtifacts artifacts: 'playwright-report/**, test-results/**, tests/generated/**, tests/gherkin/**, tests/testcases/**, src/test/java/generated/**, target/surefire-reports/**', allowEmptyArchive: true
      junit testResults: 'test-results/junit.xml, target/surefire-reports/*.xml', allowEmptyResults: true
      script {
        if ((env.PLAYWRIGHT_EXIT ?: '0') != '0' && fileExists('test-results/junit.xml')) {
          currentBuild.result = 'SUCCESS'
        }
        if ((env.JAVA_EXIT ?: '0') != '0' && fileExists('target/surefire-reports')) {
          currentBuild.result = 'SUCCESS'
        }
      }
    }
  }
}
