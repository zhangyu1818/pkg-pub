# pkg-pub

Publish a temporary version to occupy the package

## Install

```shell
npm install pkg-pub -g
```

## Usage

```shell
pkgp
```

## Why

Checking if a package name is taken before publishing a npm package is important. However, npm info and npm view commands do not work for private packages. In such cases, developers may find out that the package name is already taken when attempting to publish it. The best way to confirm availability is by directly publishing the package. 

If there is a better way to search for private packages, please let me know in time, Thank you!
