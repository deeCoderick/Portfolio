# Portfolio Project Structure

## Frontend (Next.js + TypeScript) - Netlify Hosted

```
portfolio-frontend/
├── .github/                      # GitHub Actions workflows
│   └── workflows/
│       ├── deploy-preview.yml    # PR preview deployment
│       └── deploy-production.yml # Production deployment
├── public/                       # Static assets
│   ├── favicon.ico
│   ├── assets/                   # Images, fonts, etc.
│   └── ...
├── src/
│   ├── components/               # Reusable UI components
│   │   ├── layout/               # Layout components
│   │   │   ├── Header.tsx
│   │   │   ├── Footer.tsx
│   │   │   ├── Navigation.tsx
│   │   │   └── Layout.tsx
│   │   ├── common/               # Common UI components
│   │   │   ├── Button.tsx
│   │   │   ├── Card.tsx
│   │   │   └── ...
│   │   ├── sections/             # Page sections
│   │   │   ├── About.tsx
│   │   │   ├── Skills.tsx
│   │   │   ├── Projects.tsx
│   │   │   ├── Journey.tsx
│   │   │   └── Contact.tsx
│   │   └── ...
│   ├── pages/                    # Next.js pages
│   │   ├── _app.tsx              # App wrapper
│   │   ├── _document.tsx         # Document customization
│   │   ├── index.tsx             # Home page
│   │   ├── tech-projects.tsx     # Tech projects page
│   │   ├── art.tsx               # Art gallery page
│   │   ├── travel.tsx            # Travel page
│   │   ├── sports.tsx            # Sports page
│   │   └── ...
│   ├── styles/                   # Styling
│   │   ├── globals.css           # Global styles
│   │   ├── Home.module.css       # Component-specific styles
│   │   └── ...
│   ├── lib/                      # Utility functions
│   │   ├── api.ts                # API client functions
│   │   ├── graphql.ts            # GraphQL client setup
│   │   └── ...
│   ├── hooks/                    # Custom React hooks
│   │   ├── useProjects.ts
│   │   ├── useSkills.ts
│   │   └── ...
│   ├── types/                    # TypeScript type definitions
│   │   ├── project.ts
│   │   ├── skill.ts
│   │   └── ...
│   └── context/                  # React Context providers
│       ├── ThemeContext.tsx
│       └── ...
├── .eslintrc.js                  # ESLint configuration
├── .prettierrc                   # Prettier configuration
├── next.config.js                # Next.js configuration
├── tsconfig.json                 # TypeScript configuration
├── netlify.toml                  # Netlify configuration
├── package.json                  # Dependencies and scripts
└── README.md                     # Project documentation
```

## Backend (Node.js + TypeScript) - AWS Hosted

### REST API (Lambda Functions)

```
portfolio-backend-rest/
├── .github/                      # GitHub Actions workflows
│   └── workflows/
│       └── deploy-lambda.yml     # Lambda deployment
├── src/
│   ├── functions/                # Lambda functions
│   │   ├── getProjects/
│   │   │   ├── index.ts          # Handler function
│   │   │   └── schema.ts         # Validation schema
│   │   ├── getProjectById/
│   │   │   ├── index.ts          # Handler function
│   │   │   └── schema.ts         # Validation schema
│   │   ├── submitContact/
│   │   │   ├── index.ts          # Handler function
│   │   │   └── schema.ts         # Validation schema
│   │   └── ...
│   ├── lib/                      # Shared code
│   │   ├── dynamodb.ts           # DynamoDB client
│   │   ├── s3.ts                 # S3 client
│   │   ├── ses.ts                # SES for emails
│   │   └── ...
│   ├── models/                   # Data models
│   │   ├── project.ts
│   │   ├── skill.ts
│   │   └── ...
│   └── types/                    # Type definitions
│       ├── api.ts
│       └── ...
├── serverless.yml                # Serverless Framework config
├── package.json                  # Dependencies and scripts
├── tsconfig.json                 # TypeScript configuration
└── README.md                     # Project documentation
```

### GraphQL API (Fargate/ECS Container)

```
portfolio-backend-graphql/
├── .github/
│   └── workflows/
│       └── deploy-ecs.yml        # ECS deployment
├── src/
│   ├── schema/                   # GraphQL schema
│   │   ├── typeDefs.ts           # Type definitions
│   │   ├── resolvers/            # GraphQL resolvers
│   │   │   ├── projectResolvers.ts
│   │   │   ├── skillResolvers.ts
│   │   │   └── ...
│   │   └── index.ts              # Schema compilation
│   ├── datasources/              # Data sources
│   │   ├── projects.ts
│   │   ├── skills.ts
│   │   └── ...
│   ├── models/                   # Data models
│   │   ├── project.ts
│   │   ├── skill.ts
│   │   └── ...
│   ├── utils/                    # Utility functions
│   │   ├── dynamodb.ts
│   │   ├── auth.ts
│   │   └── ...
│   └── index.ts                  # Server entry point
├── docker/
│   ├── Dockerfile                # Docker configuration
│   └── .dockerignore             # Docker ignore file
├── ecs/
│   ├── task-definition.json      # ECS task definition
│   └── service-definition.json   # ECS service definition
├── package.json                  # Dependencies and scripts
├── tsconfig.json                 # TypeScript configuration
└── README.md                     # Project documentation
```

## Shared Infrastructure (AWS CDK)

```
portfolio-infrastructure/
├── .github/
│   └── workflows/
│       └── deploy-infra.yml      # Infrastructure deployment
├── lib/
│   ├── api-stack.ts              # API Gateway stack
│   ├── lambda-stack.ts           # Lambda functions stack
│   ├── ecs-stack.ts              # ECS/Fargate stack
│   ├── database-stack.ts         # DynamoDB tables stack
│   └── storage-stack.ts          # S3 buckets stack
├── bin/
│   └── portfolio-infrastructure.ts # Entry point
├── cdk.json                      # CDK configuration
├── package.json                  # Dependencies and scripts
├── tsconfig.json                 # TypeScript configuration
└── README.md                     # Project documentation
``` 