# Chaincode for Product Unit Hub Use Case
## Prerequisites
TODO
## Compile the chaincode
TODO
## Test the chaincode (Hyperledger Fabric Peer [dev mode](https://hyperledger-fabric.readthedocs.io/en/latest/chaincode4ade.html#testing-using-dev-mode))
1. Download [Hyperledger Fabric Samples](https://hyperledger-fabric.readthedocs.io/en/latest/samples.html)
2. Open a Terminal in your machine:
 - `cd fabric-samples`
 - `cd chaincode && git clone https://github.com/ascatox/product-unit-hub-chaincode.git` (Only first time)
 - `cd ../chaincode-docker-devmode` 
 - `chmod +x script.sh` (Only first time)
 - `docker-compose -f docker-compose-simple.yaml up -d` (Stop the network using: `docker-compose -f docker-compose-simple.yaml down`)
 - `docker exec -it chaincode bash` (from now you are inside the container)
 - `cd product-unit-hub-chaincode && go build`
 - `CORE_PEER_ADDRESS=peer:7051 CORE_CHAINCODE_ID_NAME=productUnitHub:0 ./product-unit-hub-chaincode`

3. Open a new Terminal in your machine:<br/>
 - `docker exec -it cli bash`
 - `peer chaincode install ... (TODO)`
 - `peer chaincode instantiate ... (TODO)`
 - `peer chaincode invoke ... (TODO)`

## Edit the chaincode
TODO

## Troubleshooting
If the `cli` docker service doesn't start correctly, execute the 2nd series of step, then execute `docker restart cli`, now you can execute the other 3rd series of steps.
