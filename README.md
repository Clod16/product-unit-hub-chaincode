# Chaincode for Product Unit Hub Use Case
## Prerequisites
* [Install Go](https://golang.org/doc/install) on your local machine.
* We reccomend [VSCode](https://code.visualstudio.com/) as Editor for development with this Go [plugin](https://code.visualstudio.com/docs/languages/go) correctly installed.

## Compile the chaincode
* `go get -u --tags nopkcs11 github.com/hyperledger/fabric/core/chaincode/shim`
* `go build --tags nopkcs11`

## Test the chaincode (Hyperledger Fabric Peer dev mode)
1. Download [Hyperledger Fabric Samples](https://hyperledger-fabric.readthedocs.io/en/latest/samples.html)
2. Open a Terminal in your machine:
 - `cd fabric-samples`
 - `cd chaincode && git clone https://github.com/ascatox/product-unit-hub-chaincode.git`
 - `cd ../chaincode-docker-devmode && chmod +x script.sh`
  - `docker-compose -f docker-compose-simple.yaml up -d` (Stop the network using: `docker-compose -f docker-compose-simple.yaml down`)
  - `docker exec -it chaincode bash` (from now you are inside the container)
  - `cd product-unit-hub-chaincode && go build`
  - `CORE_PEER_ADDRESS=peer:7051 CORE_CHAINCODE_ID_NAME=productUnitHub:0 ./product-unit-hub-chaincode`

3. Open a new Terminal in your machine:<br/>
 - `docker exec -it cli bash`
 - `peer chaincode install -p chaincodedev/chaincode/product-unit-hub-chaincode -n productUnitHub -v 0`
 - `peer chaincode instantiate -n productUnitHub -v 0 -c '{"Args":["a","10"]}' -C myc`
 - `peer chaincode invoke -n productUnitHub -c '{"Args":["set", "a", "20"]}' -C myc` or `peer chaincode query -n productUnitHub -c '{"Args":["query","a"]}' -C myc` (Beware change 'set' and parameters and 'query' and parameters with the functions inside your Go code)

## Troubleshooting
If the `cli` docker service doesn't start correctly, execute the 2nd series of step, then execute `docker restart cli`, now you can execute the other 3rd series of steps.
