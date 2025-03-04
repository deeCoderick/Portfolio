# Portfolio Architecture Diagram

```mermaid
graph TD
    subgraph "Netlify Hosting"
        A[Frontend Application] --> |Build & Deploy| B[Netlify CDN]
        Z[netlify.toml] --> B
        Y[GitHub Repository] --> |Git Push| B
    end
    
    subgraph "AWS Cloud"
        subgraph "API Gateway"
            C[REST API Endpoints]
            D[GraphQL API Endpoint]
        end
        
        subgraph "AWS Lambda"
            E[Contact Form Lambda]
            F[Project Data Lambda]
            G[Authentication Lambda]
            H[GraphQL Lambda]
        end
        
        subgraph "AWS Fargate/ECS"
            I[GraphQL Container Service]
            J[Long-running Processes]
        end
        
        subgraph "AWS Databases"
            K[DynamoDB - Projects]
            L[DynamoDB - Users]
            M[S3 - Static Assets]
        end
    end
    
    B --> |API Calls| C
    B --> |GraphQL Queries| D
    
    C --> E
    C --> F
    C --> G
    
    D --> H
    D --> I
    
    E --> K
    F --> K
    G --> L
    H --> K
    H --> L
    I --> K
    I --> L
    
    E --> M
    F --> M
    I --> M
    
    subgraph "CI/CD Pipeline"
        N[GitHub Actions]
        O[AWS CodePipeline]
    end
    
    Y --> N
    N --> |Deploy Frontend| B
    N --> |Deploy Backend| O
    O --> |Update| E
    O --> |Update| F
    O --> |Update| G
    O --> |Update| H
    O --> |Update| I
    O --> |Update| J
```

## Component Descriptions

### Frontend (Netlify)
- **React/Next.js Application**: TypeScript-based, responsive design
- **Netlify CDN**: Global content delivery network for fast loading
- **netlify.toml**: Configuration for build settings, redirects, and environment variables
- **GitHub Repository**: Source code with automated deployment on push to main branch

### Backend (AWS)
- **API Gateway**: Manages both REST and GraphQL endpoints
- **Lambda Functions**:
  - Contact Form: Processes submissions, sends emails
  - Project Data: Retrieves and manages portfolio project information
  - Authentication: Handles secure user authentication (if needed)
  - GraphQL Lambda: Processes simpler GraphQL queries
- **Fargate/ECS**: Contains Docker containers for services requiring more processing power
  - GraphQL Container: Handles complex GraphQL operations
  - Long-running Processes: Background jobs, analytics, etc.
- **Databases**:
  - DynamoDB - Projects: Stores portfolio project data
  - DynamoDB - Users: Manages user authentication (if applicable)
  - S3 - Static Assets: Stores images, documents, and other static content

### CI/CD Pipeline
- **GitHub Actions**: Automates frontend build and deployment to Netlify
- **AWS CodePipeline**: Manages backend deployments to Lambda and ECS 