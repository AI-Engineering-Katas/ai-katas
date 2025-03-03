# Financial Services Knowledge Base - Installation Guide

This guide will help you set up the development environment for the Financial Services Knowledge Base project.

## Prerequisites

Before you begin, make sure you have the following installed on your system:

- **Python 3.8+**: Required for running the backend code
- **Podman**: Container engine for running the services
- **Podman Compose**: Tool for defining and running multi-container applications

### Installing Prerequisites

#### Python

Download and install Python from [python.org](https://www.python.org/downloads/) or use your system's package manager.

Verify your installation:

```bash
python --version  # or python3 --version on some systems
```

#### Podman

##### macOS

```bash
brew install podman
podman machine init
podman machine start
```

##### Linux (Ubuntu/Debian)

```bash
sudo apt-get update
sudo apt-get install -y podman
```

##### Windows

Download and install Podman Desktop from [podman-desktop.io](https://podman-desktop.io/downloads).

#### Podman Compose

##### macOS/Linux

```bash
pip install podman-compose
```

##### Windows

```bash
pip install podman-compose
```

## Setting Up the Project

### 1. Clone the Repository

Clone the repository to your local machine:

```bash
git clone <repository-url>
cd financial-services-kb-template
```

### 2. Run the Setup Script

#### macOS/Linux

```bash
# Make the setup script executable
chmod +x scripts/setup.sh

# Run the setup script
./scripts/setup.sh
```

#### Windows

```bash
# Run the setup script
scripts\setup.bat
```

The setup script will:

- Check if Podman and Podman Compose are installed
- Create necessary directories
- Build and start the containers

### 3. Verify the Installation

Run the test environment script to verify that everything is set up correctly:

```bash
# For macOS/Linux
python3 scripts/test_environment.py

# For Windows
python scripts\test_environment.py
```

### 4. Access the Application

Once the setup is complete, you can access:

- **Frontend**: http://localhost:3000
- **API**: http://localhost:8000
- **Vector Database UI**: http://localhost:6333/dashboard

## Troubleshooting

### Common Issues

#### Podman Machine Not Running

If you see an error about the Podman machine not running, start it with:

```bash
podman machine start
```

#### Port Conflicts

If you see errors about ports being in use, you may have other services running on those ports. You can modify the `podman/docker-compose.yml` file to use different ports.

#### Python Dependencies

If you encounter issues with Python dependencies, you can install them manually:

```bash
pip install -r requirements.txt
```

#### Container Build Failures

If container builds fail, try rebuilding with:

```bash
cd podman
podman-compose down
podman-compose build --no-cache
podman-compose up -d
```

### Getting Help

If you encounter any issues not covered here, please:

1. Check the project documentation in the `docs` directory
2. Consult the README.md file for additional information
3. Reach out to the workshop facilitator for assistance

## Next Steps

Once your environment is set up, you're ready to start implementing the knowledge base. Follow the [Milestone Guide](./milestone_guide.md) to implement each component of the system.
