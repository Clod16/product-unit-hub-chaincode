/*
Copyright IBM Corp. 2016 All Rights Reserved.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

		 http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

// This is a node-js version of example_02.go

const shim          = require('fabric-shim');
const datatransform = require("./utils/datatransform");

// An log4js logger instance
var logger = shim.newLogger('productUnitHub');
// The logger level can also be set by environment variable 'CORE_CHAINCODE_LOGGING_SHIM'
// to CRITICAL, ERROR, WARNING, DEBUG
logger.level = 'info';

var Chaincode = class {

	generateKey(stub, component, subComponent, chassiId) {
		return stub.createCompositeKey("", [component, subComponent, chassiId]);
	}

	async Init(stub) {
		logger.info('########### Init ###########');
		return shim.success();
		/*let ret = stub.getFunctionAndParameters();

		let args = ret.params;
	
		if (args.length === 0) {
			try {
				return shim.success();
			} catch (e) {
				return shim.error(e);
			}
		}
		*/
	}

	async Invoke(stub) {
		logger.info('########### Invoke ###########');
		let ret  = stub.getFunctionAndParameters();
		let fcn  = ret.fcn;
		let args = ret.params;

		logger.info('Invoke fcn' + fcn);

		/* methods GET */

		if (fcn === 'getProcessStepRouting') {
			return this.getProcessStepRouting(stub, args);
		}

		if (fcn === 'getProcessStep') {
			return this.getProcessStep(stub, args);
		}

		if (fcn === 'getProcessStepResult') {
			return this.getProcessStepResult(stub, args);
		}

		/* methods POST */

		if (fcn === 'storeProcessStepRouting') {
			return this.storeProcessStepRouting(stub, args);
		}

		if (fcn === 'storeProcessStepResult') {
			return this.storeProcessStepResult(stub, args);
		}
		/* methods NOT FOUND */
		logger.Errorf(`Unknown action, check the first argument, must be one of 'getProcessStepRouting', 'retrieveProcessStep', 'storeProcessStepRouting' or 'storeProcessStepResult'. But got: ${fcn}`);
		return shim.error(`Unknown action, check the first argument, must be one of 'getProcessStepRouting', 'retrieveProcessStep', 'storeProcessStepRouting' or 'storeProcessStepResult'. But got: ${fcn}`);
	}

	/* methods GET */
	/* getProcessStepRouting(component, subComponent) */
	/* The getProcessStepRouting method is called to extract all chassisDTOs by Component and subComponent */ 
 
	async getProcessStepRouting(stub, args) {
		if (args.length != 2) {
			return shim.error('Incorrect number of arguments. Expecting 2, function followed by JSON parameters');
		}

		const keyPar = args[0] + "_" + args[1];
		const iterator = await this.stub.getStateByPartialCompositeKey("",keyPar);

		const listOfChassisDTO = datatransform.Transform.iteratorToKVList(iterator);
		
		let jsonResp =listOfChassisDTO;
		logger.info('Query Response:%s\n', JSON.stringify(jsonResp));

		return shim.success(Buffer.from(listOfChassisDTO.toString()));
	}


/*
	async getQueryResult(stub, component, subComponent) {

        const query = {
            selector: {
                component: component,
				subComponent: subComponent
				}
            };
 
        return await stub.getQueryResult(query);
	}
*/ 


	/* getProcessStep(chassisId, component, subComponent, workCellResourceId) */
	/* The getProcessStep method is called to extract the chassisDTO by chassisId, component, subComponent and workCellResourceId (eventually) */

	async getProcessStep(stub, args) {
		if (args.length < 3 || args.length > 4) {
			return shim.error('Incorrect number of arguments. Expecting 3 or 4, function followed by JSON parameters');
		}
		let jsonResp; 
		/* Key is composed by: chassisId_component_subComponent_workCellResourceId */
		if (args[3]) {
			const key = args[0] + "_" + args[1] + "_" + args[2]+ "_" + args[3];
			let   chassisDTO;
			
			// Get the state from the ledger
			try {
				let chassisDTObytes = await stub.getState(key);
				if (!chassisDTObytes) {
					return shim.error('chassisDTO ' + key + ' not found');
				}
				chassisDTO = chassisDTObytes.toString();
			} catch (e) {
				return shim.error('Failed to get state with key: ' + key);
			}
			jsonResp = chassisDTO;
		}
		else {
			/* Key partial is composed by: chassisId_component_subComponent */
			const keyPar 			=  args[0] + "_" + args[1] + "_" + args[2];
			const iterator 			= await this.stub.getStateByPartialCompositeKey("",keyPar);
			const listOfChassisDTO 	= datatransform.Transform.iteratorToKVList(iterator);
			if (!listOfChassisDTO) {
				return shim.error('listOfChassisDTO ' + keyPar + ' not found');
			}
			jsonResp = listOfChassisDTO;
		}
		
		logger.info('Query Response:%s\n', JSON.stringify(jsonResp));
		return shim.success(Buffer.from(chassisDTO.toString()));
	}

		/* getProcessStepResult(chassisId, component, subComponent, workCellResourceId) */
	/* The getProcessStepResult method is called to extract the chassisDTO by chassisId, component, subComponent and workCellResourceId (eventually) */

	async getProcessStepResult(stub, args) {
		if (args.length < 3 || args.length > 4) {
			return shim.error('Incorrect number of arguments. Expecting 3 or 4, function followed by JSON parameters');
		}
		let jsonResp; 
		/* Key is composed by: chassisId_component_subComponent_workCellResourceId */
		if (args[3]) {
			const key = args[0] + "_" + args[1] + "_" + args[2]+ "_" + args[3];
			let   processStepResultDTO;
			
			// Get the state from the ledger
			try {
				let processStepResultDTObytes = await stub.getState(key);
				if (!processStepResultDTObytes) {
					return shim.error('processStepResultDTO ' + key + ' not found');
				}
				processStepResultDTO = processStepResultDTObytes.toString();
			} catch (e) {
				return shim.error('Failed to get state with key: ' + key);
			}
			jsonResp = processStepResultDTO;
		}
		else {
			/* Key partial is composed by: component_subComponent_chassisId */
			const keyPar 						=  args[0] + "_" + args[1] + "_" + args[2];
			const iterator 						= await this.stub.getStateByPartialCompositeKey("",keyPar);
			const listOfProcessStepResultDTO 	= datatransform.Transform.iteratorToKVList(iterator);
			if (!listOfProcessStepResultDTObytes) {
				return shim.error('listOfProcessStepResultDTO ' + key + ' not found');
			}
			jsonResp = listOfProcessStepResultDTO;
		}
		
		logger.info('Query Response:%s\n', JSON.stringify(jsonResp));
		return shim.success(Buffer.from(processStepResultDTO.toString()));
	}

	/* methods POST */
	/* storeProcessSteps(component, subComponent) */
	/* The storeProcessSteps method is called to store all chassisDTOs with Component and subComponent */ 

	async storeProcessStepRouting(stub, args) {

		let processStepsContainer;

		/* Number arguments 1: (function , JSON parameters) */
		if (args.length != 1) {
			return shim.error('Incorrect number of arguments. Expecting 1, function followed by JSON parameters');
		}

		let processStepsContainerSTR = args[0];
		
		if(typeof processStepsContainerSTR == 'undefined' || processStepsContainerSTR == null) {
			return shim.error('processStepsContainerSTR undefined or null');
		}
		try{
			processStepsContainer = JSON.parse(processStepsContainerSTR);
			if(typeof processStepsContainer == 'undefined' || processStepsContainer == null || typeof processStepsContainer != 'object') {
				return shim.error('processStepsContainer undefined or null or not object');
			}
			for (let value of processStepsContainer) {
				let chassisDTO;
				chassisDTO.chassiId           = value.ChassisId;	
				chassisDTO.component          = value.Component;
				chassisDTO.subComponent       = value.SubComponent;
				chassisDTO.productUnits 	  = value.ProductUnits;
				chassisDTO.billOfProcessSteps = value.BillOfProcessSteps;	

				const key = generateKey(stub, chassisDTO.component,chassisDTO.subComponent,chassisDTO.chassiId,chassisDTO.productUnits);
				// Write the state to the ledger
				try {
					await stub.putState(key, Buffer.from(chassisDTO.toString()));
					
					let tmap = stub.getTransient();
					logger.info('Invoke move transient: ' + tmap);
					//JavaSDK expect to see events and results in transient maps just to test the feature and no other reason.
					if(tmap != null){
					 let event = tmap.get("event");
					 if(null != event){
						stub.setEvent('event', event);
					 }
		
					 let rb = tmap.get("result");
					 logger.info('Invoke Global Store transient requested result: ' + rb);
					 if( null != rb){
					  return shim.success(rb);}
					}
					return shim.success(Buffer.from('Global Store succeed'));
				} catch (e) {
					return shim.error(e);
				}
			}
		} catch (e) {
			return shim.error('Parse error found');
		}
	}

	/* storeProcessStepResult(chassisId, component, subComponent, processStepResult) */
	/* The storeProcessStepResults method is called to update the chassisDTO (in the part of Results) with chassisId, Component and subComponent */ 
	
	async storeProcessStepResult(stub, args) {
		let processStepResultContainer;

		/* TODO parameter args[0] is composed by: 
		{Component         		 : component,
		 SubComponent            : subComponent,
		 ChassisId         		 : chassisId,
		 WorkCellResourceId		 : workCellResourceId, 
		 BillOfProcessStepResults: [ProcessStepResults]
		} */
		
		/* Number arguments 1: (function , JSON parameters) */
		if (args.length != 1) {
			return shim.error('Incorrect number of arguments. Expecting 1, function followed by JSON parameters');
		}

		let processStepResultContainerSTR = args[0];	

		if(typeof processStepResultContainerSTR == 'undefined' || processStepResultContainerSTR == null) {
			return shim.error('processStepResultsContainerSTR undefined or null');
		}
		try{
			processStepResultDTO = JSON.parse(processStepResultContainerSTR);
			if(typeof processStepResultDTO == 'undefined' || 
			   processStepResultDTO == null || 
			   typeof processStepResultDTO != 'object') {
			   return shim.error('processStepDTO undefined or null or not object');
			}
			try {
				const key = generateKey(stub, 
						processStepResultDTO.component,
						processStepResultDTO.subComponent,
						processStepResultDTO.chassiId,
						processStepResultDTO.workCellResourceId);

				await stub.putState(key, Buffer.from(processStepResultDTO.toString()));
				
				let tmap = stub.getTransient();
				logger.info('Invoke move transient: ' + tmap);
				//JavaSDK expect to see events and results in transient maps just to test the feature and no other reason.
				if(tmap != null){
				 let event = tmap.get("event");
				 if(null != event){
					stub.setEvent('event', event);
				 }
	
				 let rb = tmap.get("result");
				 logger.info('Invoke Process Step Result Store transient requested result: ' + rb);
				 if( null != rb){
				  return shim.success(rb);}
				}
				return shim.success(Buffer.from('Process Step Result Store succeed'));
			} catch (e) {
				return shim.error(e);
			}
		} catch (e) {
			return shim.error('Parse error found');
		}
	}

};

shim.start(new Chaincode());
