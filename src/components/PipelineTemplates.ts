export const TEAMCITY_TEMPLATE = `project {
    vcsRoot(UnrealVcsRoot)
    buildType(UnrealBuild)
}

buildType UnrealBuild {
    name = "Unreal Build and Cook"
    description = "Automated Unreal Engine build pipeline"

    vcs {
        root(UnrealVcsRoot)
    }

    steps {
        script {
            name = "Run UAT BuildCookRun"
            scriptContent = """
                RunUAT.bat BuildCookRun -project="%system.teamcity.build.checkoutDir%\\\\MyGame.uproject" -platform=Win64 -cook -stage -archive -pak -clientconfig=Development
            """
        }
    }

    artifactRules = "Saved/Archives => Builds"
}`;

export const PERFORCE_TEMPLATE = `// Perforce-based Build Automation Script
# Sync latest from depot
p4 sync //depot/MyGame/main/...#head

# Clean workspace
rmdir /s /q Build
rmdir /s /q Intermediate

# Execute UBT
UnrealBuildTool.exe MyGame Win64 Development "%CD%\\\\MyGame.uproject" -waitmutex

# Cook and Stage via UAT
RunUAT.bat BuildCookRun -project="%CD%\\\\MyGame.uproject" -platform=Win64 -cook -stage -pak -archive -archivedirectory="%CD%\\\\Build"
`;

export const GITLAB_TEMPLATE_UNREAL = `stages:
  - build

build_job:
  stage: build
  image: epicgames/unreal-engine:5.3.2-dev
  script:
    - echo "Starting Unreal automated build..."
    - RunUAT.bat BuildCookRun -project="MyGame.uproject" -platform=Win64 -cook -stage -package -archive -nocompile -unattended
  artifacts:
    name: "unreal-build-artifacts"
    paths:
      - ArchivedBuilds/
    expire_in: 1 week`;

export const BITBUCKET_TEMPLATE_UNREAL = `image: epicgames/unreal-engine:5.3.2-dev

pipelines:
  branches:
    main:
      - step:
          name: Build and Package Unreal
          script:
            - echo "Starting Unreal BuildCookRun step..."
            - RunUAT.bat BuildCookRun -project="MyGame.uproject" -platform=Win64 -cook -stage -package -archive
          artifacts:
            - ArchivedBuilds/**`;

export const CIRCLECI_TEMPLATE_UNREAL = `version: 2.1

jobs:
  build_unreal:
    docker:
      - image: epicgames/unreal-engine:5.3.2-dev
    steps:
      - checkout
      - run:
          name: Run Automated BuildCookRun
          command: |
            RunUAT.bat BuildCookRun -project="MyGame.uproject" -platform=Win64 -cook -stage -package -archive -nocompile -unattended
      - store_artifacts:
          path: ArchivedBuilds/
          destination: binaries`;

export const GITHUB_TEMPLATE_UNREAL = `name: Unreal Auto Builder
on: [push]
jobs:
  build:
    runs-on: windows-latest
    steps:
      - uses: actions/checkout@v3
      - name: Build Cook Run
        run: |
          RunUAT.bat BuildCookRun -project="MyGame.uproject" -platform=Win64 -cook -stage -package -archive -nocompile -unattended`;

export const GITLAB_TEMPLATE = `stages:
  - build
  - test
  - deploy

variables:
  UNITY_VERSION: "2022.3.0f1"
  IMAGE_NAME: "unityci/editor:2022.3.0f1-ubuntu-3"

build_job:
  stage: build
  image: $IMAGE_NAME
  variables:
    UNITY_LICENSE: $UNITY_LICENSE_KEY
  script:
    - echo "Activating Unity license..."
    - echo "$UNITY_LICENSE" > /usr/share/unity/license.ulf
    - echo "Starting automated build..."
    - unity-editor -batchmode -quit -projectPath . -executeMethod UnityBuilder.BuildGame -logFile build.log
  artifacts:
    name: "unity-build-artifacts"
    paths:
      - Build/
    expire_in: 1 week`;

export const BITBUCKET_TEMPLATE = `image: unityci/editor:2022.3.0f1-ubuntu-3

pipelines:
  branches:
    main:
      - step:
          name: Build and Deploy Unity Player
          caches:
            - bundler
          script:
            - export UNITY_LICENSE=$(cat /opt/unity-license.ulf)
            - echo "Starting DevOps Hub Studio build step..."
            - unity-editor -batchmode -quit -projectPath . -executeMethod UnityBuilder.BuildGame -buildTarget Android -logFile -
          artifacts:
            - Build/**`;

export const CIRCLECI_TEMPLATE = `version: 2.1

jobs:
  build_unity:
    docker:
      - image: unityci/editor:2022.3.0f1-ubuntu-3
    steps:
      - checkout
      - restore_cache:
          keys:
            - unity-library-v1-{{ .Branch }}
      - run:
          name: Run Automated Build
          command: |
            mkdir -p Build/
            unity-editor -batchmode -quit -projectPath . -executeMethod UnityBuilder.BuildGame -logFile -
      - save_cache:
          key: unity-library-v1-{{ .Branch }}
          paths:
            - Library/
      - store_artifacts:
          path: Build/
          destination: binaries`;

export const COMPARE_PRESETS: Record<string, Record<string, any>> = {
  unity: {
    "engine": "Unity",
    "version": "2022.3.10f1",
    "buildSystem": "Gradle / Xcode",
    "scriptingBackend": "IL2CPP",
    "apiCompatibility": ".NET Standard 2.1",
    "managedStripping": "Medium",
    "addressables": true,
    "burstCompilation": true,
    "renderPipeline": "URP"
  },
  unreal: {
    "engine": "Unreal Engine",
    "version": "5.3.2",
    "buildSystem": "UBT (Unreal Build Tool)",
    "scriptingBackend": "C++ / Blueprints",
    "apiCompatibility": "C++20",
    "managedStripping": "N/A",
    "addressables": false,
    "burstCompilation": false,
    "renderPipeline": "Lumen / Nanite"
  },
  android: {
    "platform": "Android",
    "unityVersion": "2022.3.0f1",
    "buildTarget": "Android",
    "targetArchitectures": ["ARMv7", "ARM64"],
    "keystoreName": "user.keystore",
    "keystoreAlias": "release-alias",
    "minifyWithProguard": true,
    "bundleVersionCode": 104,
    "exportAsAab": true
  },
  ios: {
    "platform": "iOS",
    "unityVersion": "2022.3.0f1",
    "buildTarget": "iOS",
    "targetArchitectures": ["ARM64"],
    "keystoreName": "none",
    "keystoreAlias": "none",
    "minifyWithProguard": false,
    "bundleVersionCode": 104,
    "exportAsAab": false
  },
  webgl: {
    "platform": "WebGL",
    "unityVersion": "2022.3.0f1",
    "buildTarget": "WebGL",
    "targetArchitectures": ["WASM"],
    "keystoreName": "none",
    "keystoreAlias": "none",
    "minifyWithProguard": false,
    "bundleVersionCode": 104,
    "exportAsAab": false
  },
  standalone: {
    "platform": "Standalone",
    "unityVersion": "2022.3.0f1",
    "buildTarget": "StandaloneWindows64",
    "targetArchitectures": ["x86_64"],
    "keystoreName": "none",
    "keystoreAlias": "none",
    "minifyWithProguard": false,
    "bundleVersionCode": 104,
    "exportAsAab": false
  }
};
