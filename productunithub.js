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
var logger          = shim.newLogger('productUnitHub');
// The logger level can also be set by environment variable 'CORE_CHAINCODE_LOGGING_SHIM'
// to CRITICAL, ERROR, WARNING, DEBUG
logger.level = 'info';

var Chaincode = class {

	generateKey(stub, component, subComponent, chassisId, workcellResourceId) {
		logger.info('########### generateKey ###########');
		if ( typeof workcellResourceId === 'undefined' || workcellResourceId == null) {
			return stub.createCompositeKey("HYPER", [component, subComponent, chassisId]);
		} else {
			return stub.createCompositeKey("HYPER", [component, subComponent, chassisId, workcellResourceId]);
		}
	}


	extractProcessSteps(chassisDTOs) {
		logger.info('####extractProcessSteps#####')
		let processSteps = [];
		if (typeof chassisDTOs === 'undefined' || chassisDTOs == null || !chassisDTOs)
			return [];
		if (chassisDTOs.length && chassisDTOs.length > 0) {
			for (let chassisDTO of chassisDTOs) {
				if (typeof chassisDTO.BillOfProcessSteps !== 'undefined' || chassisDTO.BillOfProcessSteps != null) {
					processSteps.push(...chassisDTO.BillOfProcessSteps);
				}
			}
		} else {
			if(chassisDTOs.hasOwnProperty('BillOfProcessSteps'))
				processSteps = chassisDTOs.BillOfProcessSteps;
		}
		logger.info('extractProcessSteps - ProcessSteps retrieved: ' + JSON.stringify(processSteps));
		return processSteps;
	}


	async Init(stub) {
		logger.info('########### Init ###########');
		return shim.success(Buffer.from('Init - function executed correctly'));
	}

	async Invoke(stub) {
		logger.info('########### Invoke ###########');
		let ret  = stub.getFunctionAndParameters();
		let fcn  = ret.fcn;
		let args = ret.params;

		logger.info('Invoke function: ' + fcn);

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
		logger.Errorf(`Unknown action, check the first argument, must be one of: 'getProcessStepRouting', 'retrieveProcessStep', 'storeProcessStepRouting' or 'storeProcessStepResult'. But got: ${fcn}`);
		return shim.error(`Unknown action, check the first argument, must be one of 'getProcessStepRouting', 'retrieveProcessStep', 'storeProcessStepRouting' or 'storeProcessStepResult'. But got: ${fcn}`);
	}

	/* methods GET */
	/* getProcessStepRouting(component, subComponent) */
	/* The getProcessStepRouting method is called to extract all chassisDTOs by Component and subComponent */

	async getProcessStepRouting(stub, args) {
		logger.info('########### getProcessStepRouting ###########');
		if (args.length < 2 || args.length > 3) {
			return shim.error('Incorrect number of arguments. Expecting 2 or 3, function followed by JSON parameters');
		}
		let iterator    = null;
		let chassisDTOs = null;

		if (args.length === 2){
			iterator    = await stub.getStateByPartialCompositeKey("HYPER", [args[0], args[1]]);
			chassisDTOs = await datatransform.Transform.iteratorToObjectList(iterator);
		}
		else {
			iterator           = await stub.getStateByPartialCompositeKey("HYPER", [args[1], args[2], args[0]]);
			let chassisDTOList = await datatransform.Transform.iteratorToObjectList(iterator);
			if (chassisDTOList.length > 1) {
				return shim.error('getProcessStepRouting with key: ' + JSON.stringify(args) + ' returns unexpected multiple results');
			}
			chassisDTOs = chassisDTOList[0];
		}
		if (!chassisDTOs) {
			return shim.error('listOfChassisDTO with partial key: ' + JSON.stringify(args) + ' not found');
		}

		let jsonResp = JSON.stringify(chassisDTOs);

		logger.info('getProcessStepRouting - Query Response:%s\n', JSON.stringify(jsonResp));
		return shim.success(Buffer.from(jsonResp));
	}


	/* getProcessStep(chassisId, component, subComponent, workCellResourceId) */
	/* The getProcessStep method is called to extract the chassisDTO by chassisId, component, subComponent and workCellResourceId (eventually) */

	async getProcessStep(stub, args) {
		logger.info('########### getProcessStep ###########');
		if (args.length < 3 || args.length > 4) {
			return shim.error('Incorrect number of arguments. Expecting 3 or 4, function followed by JSON parameters: ' + args.length);
		}
		let jsonResp = null;
		/* Key is composed by: component subComponent chassisId workCellResourceId */
		if (args[3]) {
			let key = this.generateKey(stub, args[1], args[2], args[0], args[3]);
			logger.debug('getProcessStep - key: ' + key);
			let chassisDTObytes = null;

			// Get the state from the ledger
			try {
				chassisDTObytes = await stub.getState(key);
				if (!chassisDTObytes) {
					return shim.error('chassisDTO ' + key + ' not found');
				}
				const chassisDTO = datatransform.Transform.bufferToObject(chassisDTObytes);
				if (chassisDTO && chassisDTO.BillOfProcessSteps && chassisDTO.BillOfProcessSteps.length > 0){
					const processSteps = this.extractProcessSteps(chassisDTO);
					jsonResp           = JSON.stringify(processSteps);
				}
				else
					return shim.error('getProcessStep - No PrcessSteps found.');
			} catch (e) {
				logger.info('getProcessStep - ERROR CATCH: ' + e);
				return shim.error('getProcessStep - Failed to get state with key: ' + key);

			}
		} else {
			/* Key partial is composed by: component subComponent chassisId */
			let iterator         = await stub.getStateByPartialCompositeKey("HYPER", [args[1], args[2], args[0]]);
			let listOfChassisDTO = await datatransform.Transform.iteratorToObjectList(iterator);
			if (!listOfChassisDTO) {
				return shim.error('listOfChassisDTO with key partial: ' + keyPar + ' not found');
			}
			const listOfChassisResult = this.extractProcessSteps(listOfChassisDTO);
			jsonResp                  = JSON.stringify(listOfChassisResult);

		}

		logger.info('getProcessStep - Query Response:%s\n', JSON.stringify(jsonResp));
		return shim.success(Buffer.from(jsonResp));
	}

	/* getProcessStepResult(chassisId, component, subComponent, workCellResourceId) */
	/* The getProcessStepResult method is called to extract the chassisDTO by chassisId, component, subComponent and workCellResourceId (eventually) */

	async getProcessStepResult(stub, args) {
		logger.info('########### getProcessStepResult ###########');
		if (args.length !== 4) {
			return shim.error('Incorrect number of arguments. Expecting 4, function followed by JSON parameters');
		}
		let jsonResp = null;
		/* Key is composed by: chassisId_component_subComponent_workCellResourceId */
		let key = this.generateKey(stub, args[1], args[2], args[0], args[3]);
		logger.debug('getProcessStepResult - key: ' + key);
		// Get the state from the ledger
		try {
			let processStepResultDTObytes = await stub.getState(key);
			if (!processStepResultDTObytes) {
				return shim.error('processStepResultDTO with key: ' + key + ' not found');
			}
			const processStepResult = datatransform.Transform.bufferToObject(processStepResultDTObytes);
			jsonResp = JSON.stringify(processStepResult);
		} catch (e) {
			logger.info('getProcessStepResult - ERROR CATCH: ' + e);
			return shim.error('Failed to get state with key: ' + key);
		}
		logger.info('getProcessStepResult - Query Response:%s\n', JSON.stringify(jsonResp));
		return shim.success(Buffer.from(jsonResp));
	}

	/* methods POST */
	/* storeProcessSteps(component, subComponent) */
	/* The storeProcessSteps method is called to store all chassisDTOs with Component and subComponent */

	async storeProcessStepRouting(stub, args) {
		logger.info('########### storeProcessStepRouting ###########');
		try {
			let processStepsContainer = JSON.parse(args);
			if (typeof processStepsContainer == 'undefined' || processStepsContainer == null || typeof processStepsContainer != 'object') {
				return shim.error('processStepsContainer undefined or null or not object');
			}
			for (let chassisDTO of processStepsContainer) {

				if (typeof chassisDTO.BillOfProcessSteps 		 != 'undefined' && 
						   chassisDTO.BillOfProcessSteps 		 != null && 
						   chassisDTO.BillOfProcessSteps.length != 0) {

					for (let bops of chassisDTO.BillOfProcessSteps) {

						const workcellResourceId = typeof bops.WorkcellResource !== 'undefined' && 
												   bops.WorkcellResource != null ? 
												   bops.WorkcellResource.Id : null;
						let key = this.generateKey(stub, chassisDTO.Component,
														 chassisDTO.SubComponent,
														 chassisDTO.ChassisId,
														 workcellResourceId);
						// Write the state to the ledger
						try {
							await stub.putState(key, Buffer.from(JSON.stringify(processStep)));
							logger.info('storeProcessStepRouting - KEY STORED Successfull: ' + key);
						} catch (e) {
							logger.info('storeProcessStepRouting - ERROR CATCH (putState): ' + e);
							return shim.error(e);
						}	
					}
				} else {
					return shim.error('BillOfProcessSteps of ' + args + ' undefined or null or empty');
				}
			}
			return shim.success(Buffer.from('Global Store succeed'));

		} catch (e) {
			logger.info('storeProcessStepRouting - ERROR CATCH (parse): ' + e);
			return shim.error('Parse error found');
		}
	}

	/* storeProcessStepResult(chassisId, component, subComponent, processStepResult) */
	/* The storeProcessStepResults method is called to update the chassisDTO (in the part of Results) with chassisId, Component and subComponent */

	async storeProcessStepResult(stub, args) {
		logger.info('########### storeProcessStepResult ###########');

		try {
			let processStepResultContainer = JSON.parse(args);
			if (typeof processStepResultContainer == 'undefined' || 
					   processStepResultContainer == null || 
				typeof processStepResultContainer != 'object') {

				return shim.error('processStepResultsContainer undefined or null or not object');
			}
			
			const processStepResult = processStepResultContainer;

			let key = this.generateKey(stub, processStepResult.Component,
											 processStepResult.SubComponent,
											 processStepResult.ChassisId,
											 processStepResult.WorkcellResourceId);

			try {
				await stub.putState(key, Buffer.from(JSON.stringify(processStepResult)));
				logger.info('storeProcessStepResult - KEY STORED	 : ' + key);
				return shim.success(Buffer.from('ProcessStepResult Store succeed'));

			} catch (e) {
				logger.info('storeProcessStepResult - ERROR CATCH (putState): ' + e);
				return shim.error(e);
			}
		} catch (e) {
			logger.info('storeProcessStepResult - ERROR CATCH (parse): ' + e);
			return shim.error('Parse error found');
		}
	}
};

shim.start(new Chaincode());