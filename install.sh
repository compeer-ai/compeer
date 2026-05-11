#!/usr/bin/env sh
OS="$(uname -s)"
case "$OS" in
  Linux*)   PLATFORM="linux" ;;
  Darwin*)  PLATFORM="macos" ;;
  MINGW*|MSYS*|CYGWIN*) PLATFORM="windows" ;;
  *) echo "Unsupported OS: $OS"; exit 1 ;;
esac
BIN="packages/cli/build/$PLATFORM/compeer"
INSTALL_DIR="$HOME/.local/bin"
mkdir -p "$INSTALL_DIR"
cp "$BIN" "$INSTALL_DIR/compeer"
chmod +x "$INSTALL_DIR/compeer"
echo "Installed compeer to $INSTALL_DIR"
echo "Make sure $INSTALL_DIR is on your PATH"