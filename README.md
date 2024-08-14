# RemoteFetch

![Logo](https://raw.githubusercontent.com/souravlayek/remotefetch/main/logo.png)

**RemoteFetch** is a robust remote downloading solution designed to fetch and store files from any location. Whether you’re dealing with direct URLs or torrents, RemoteFetch manages your downloads efficiently and securely. With a user-friendly web interface, RemoteFetch streamlines remote file management, making your digital life more organized and accessible.

## Features

- **Remote File Management:** Seamlessly fetch files from any URL.
- **Secure Storage:** Files are stored securely on your server.
- **User-Friendly Interface:** Easily manage downloads through a web interface.

## Prerequisites

- Docker: [Install Docker](https://docs.docker.com/get-docker/)
- Docker Compose: [Install Docker Compose](https://docs.docker.com/compose/install/)

## Getting Started

### Clone the Repository

First, clone the repository to your local machine:

```bash
git clone https://github.com/souravlayek/remotefetch.git
cd remotefetch
```

### Docker Compose Configuration

Here is the `docker-compose.yml` file that sets up and runs the RemoteFetch application:

```yaml
version: "3.8"

services:
  remote-downloader:
    image: souravlayek/remote-fetch:latest
    container_name: remote-downloader
    ports:
      - "3000:3000"
    volumes:
      - ./op:/app/output
    restart: unless-stopped
```

### Setup with Docker Compose

1. **Start the Application:**

   ```bash
   docker-compose up -d
   ```

   This command will start the application in detached mode, creating and running the container as defined in `docker-compose.yml`.

2. **Access the Application:**
   - Open your web browser and navigate to `http://localhost:3000` to access the RemoteFetch web interface.

### Stopping the Application

To stop and remove the containers, networks, and volumes defined in `docker-compose.yml`:

```bash
docker-compose down
```

### Updating the Application

To pull the latest changes and update the application:

1. **Pull the Latest Image:**

   ```bash
   docker-compose pull
   ```

2. **Restart the Application:**

   ```bash
   docker-compose up -d
   ```

### Configuration

- **Volumes:** Local directory `./op` is mounted to `/output` in the container. Adjust the volume configuration in `docker-compose.yml` if needed.
- **Ports:** Port `3000` on your host is mapped to port `3000` in the container. Modify the port mappings in `docker-compose.yml` if necessary.

## Contributing

We welcome contributions! To contribute to RemoteFetch, please follow these steps:

1. Fork the repository.
2. Create a feature branch (`git checkout -b feature/YourFeature`).
3. Commit your changes (`git commit -am 'Add new feature'`).
4. Push to the branch (`git push origin feature/YourFeature`).
5. Create a new Pull Request.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Contact

For any questions or support, please contact:

- **Email:** souravlayek11@gmail.com
- **GitHub:** [souravlayek](https://github.com/souravlayek)

---

Thank you for using RemoteFetch!
