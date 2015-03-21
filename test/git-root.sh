#!/usr/bin/env bash
git_root() {
  git rev-parse --show-toplevel
}
# get the relative path of current path according to root of repo
git_root_relative() {
  git rev-parse --show-prefix
}
if test $# -eq 0; then
  git_root
else
  case "$1" in
    -r|--relative)
      git_root_relative
      ;;
    *)
      git_root
      ;;
  esac
fi

