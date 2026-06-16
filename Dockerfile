# Use a Node.js base image with Playwright
FROM mcr.microsoft.com/playwright:v1.60.0-noble

# Set working directory inside the container
WORKDIR /home/pwuser
CMD ["npx", "-y", "playwright@1.60.0", "run-server", "--port", "3010", "--host", "0.0.0.0"]
