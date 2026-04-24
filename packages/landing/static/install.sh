#!/usr/bin/env bash

set -euo pipefail

install_cli() {
  if ! npm install -g @barque/cli; then
    echo "NPM needs to be installed"
    return 1
  fi
}

pull_docker_image() {
  if ! docker pull barque/barque:latest; then
    echo "Docker needs to be installed"
    return 1
  fi
}

pull_docker_image
install_cli

echo "Successfully installed Compeer"