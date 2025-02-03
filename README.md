# MPC Wallet Service

This is the MPC Wallet Service for Dynamic Wallet MPC wallets (v3).

## Shared packages

`@dynamic-labs-wallet/server` - The server package for the Dynamic Wallet SDK.

## How to run your project

1. `npm install`
2. run `ev-enclave dev` to start the enclave
3. run `npm run start` to start the server

## Deployment

1. Build the enclave

Get the cert.pem and key.pem values from [1password](https://dynamiclabs.1password.com/app#/rhp23qqkejew7hlnibh5gx2mja/Search/rhp23qqkejew7hlnibh5gx2mjax3lh7sxyl3q2dtq2pmvckxqy7u?itemListId=deploy) or create new ones in the root of the project. Build the enclave with the following command:

```
 ev enclave build -c enclave.preprod.toml --private-key key.pem --signing-cert cert.pem --build-secret id=NPM_TOKEN .
```

2. Deploy the enclave with API key:

```
EV_API_KEY=<api-key> ev-enclave deploy -c enclave.preprod.toml --private-key key.pem --signing-cert cert.pem
```

## Scaling

To scale the enclave, you can use the following command:

```
EV_API_KEY=<api-key> ev enclave scale -c enclave.preprod.toml --desired-replicas <number-of-instances>
```
