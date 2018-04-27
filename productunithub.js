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

const shim = require('fabric-shim');
const datatransform = require("./utils/datatransform");

// An log4js logger instance
var logger = shim.newLogger('productUnitHub');
// The logger level can also be set by environment variable 'CORE_CHAINCODE_LOGGING_SHIM'
// to CRITICAL, ERROR, WARNING, DEBUG
logger.level = 'info';

var Chaincode = class {

	generateKey(stub, component, subComponent, chassisId, workcellResourceId) {
		logger.info('########### generateKey ###########');
		logger.info('generateKey - chassisId         :    ' + chassisId);
		logger.info('generateKey - component         :    ' + component);
		logger.info('generateKey - subComponent      : ' + subComponent);
		if ( typeof workcellResourceId === 'undefined' || workcellResourceId == null) {
			return stub.createCompositeKey("HYPER", [component, subComponent, chassisId]);
		} else {
			logger.info('generateKey - workcellResourceId: ' + workcellResourceId);
			return stub.createCompositeKey("HYPER", [component, subComponent, chassisId, workcellResourceId]);
		}
	}


	extractProcessSteps(chassisDTOs) {
		logger.debug('####extractProcessSteps#####')
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
		logger.debug('extractProcessSteps ProcessSteps retrieved: ' + JSON.stringify(processSteps));
		return processSteps;
	}


	async Init(stub) {
		logger.info('########### Init executed ###########');
		return shim.success(Buffer.from('Init function executed correctly'));
		
		/*
		let processStepsString = '{\"ChassisId\": \"A819631\",\"Component\": \"CAB\",\"SubComponent\": \"TCAB\",\"ProductUnits\": \"productUnit\",\"BillOfProcessSteps\": [\r\n\t\t\t  {\t\"SequenceNo\": 1,\t\"PlannedProductionTime\": 0,\t\"WorkcellResource\": {\t  \"Id\": \"CTPP-01A\",\t  \"Name\": \"CTPP-01A\"\t},\t\"BillOfOperation\": [\t  {\t\t\"SequenceNo\": 1,\t\t\"InstructionTexts\": null,\t\t\"EquipmentRequirements\": null,\t\t\"OperationSteps\": [\t\t  {\t\t\t\"SequenceNo\": 1,\t\t\t\"InstructionTexts\": [\t\t\t  {\t\t\t\t\"SequenceNo\": 1,\t\t\t\t\"Text\": \"Bromscylinder 4 st, 24 Nm.\",\t\t\t\t\"RTF\": \"\"\t\t\t  }\t\t\t],\t\t\t\"EquipmentRequirements\": [\t\t\t  {\t\t\t\t\"SequenceNo\": 1,\t\t\t\t\"EquipmentType\": \"91\",\t\t\t\t\"Specifications\": [\t\t\t\t  {\t\t\t\t\t\"SequenceNo\": 1,\t\t\t\t\t\"Specification\": \"01_24Nm\",\t\t\t\t\t\"Value\": \"\",\t\t\t\t\t\"Quantity\": 4,\t\t\t\t\t\"Parameters\": null\t\t\t\t  }\t\t\t\t]\t\t\t  }\t\t\t],\t\t\t\"BillOfMaterial\": null,\t\t\t\"Description\": \"Bromscylinder 4 st, 24 Nm.\"\t\t  },\t\t  {\t\t\t\"SequenceNo\": 2,\t\t\t\"InstructionTexts\": [\t\t\t  {\t\t\t\t\"SequenceNo\": 2,\t\t\t\t\"Text\": \"Stoppskruv 1st, 24 Nm.\",\t\t\t\t\"RTF\": \"\"\t\t\t  }\t\t\t],\t\t\t\"EquipmentRequirements\": [\t\t\t  {\t\t\t\t\"SequenceNo\": 1,\t\t\t\t\"EquipmentType\": \"91\",\t\t\t\t\"Specifications\": [\t\t\t\t  {\t\t\t\t\t\"SequenceNo\": 1,\t\t\t\t\t\"Specification\": \"01_24Nm\",\t\t\t\t\t\"Value\": \"\",\t\t\t\t\t\"Quantity\": 1,\t\t\t\t\t\"Parameters\": null\t\t\t\t  }\t\t\t\t]\t\t\t  }\t\t\t],\t\t\t\"BillOfMaterial\": null,\t\t\t\"Description\": \"Stoppskruv 1st, 24 Nm.\"\t\t  }\t\t],\t\t\"Id\": \"001_63C0967-2D63-494D-88AC-F5D1BCE7127    _001\",\t\t\"CIN\": \"168336\",\t\t\"Description\": \"Dragningar pedalplatta\",\t\t\"OperationType\": \"AI\"\t  },\t  {\t\t\"SequenceNo\": 2,\t\t\"InstructionTexts\": null,\t\t\"EquipmentRequirements\": null,\t\t\"OperationSteps\": [\t\t  {\t\t\t\"SequenceNo\": 1,\t\t\t\"InstructionTexts\": null,\t\t\t\"EquipmentRequirements\": null,\t\t\t\"BillOfMaterial\": null,\t\t\t\"Description\": \"\"\t\t  }\t\t],\t\t\"Id\": \"001_63C0967-2D63-494D-88AC-F5D1BCE7127    _002\",\t\t\"CIN\": \"170767\",\t\t\"Description\": \"PC24 FH\/FM: Variantinformation\",\t\t\"OperationType\": \"AI\"\t  },\t  {\t\t\"SequenceNo\": 3,\t\t\"InstructionTexts\": null,\t\t\"EquipmentRequirements\": null,\t\t\"OperationSteps\": [\t\t  {\t\t\t\"SequenceNo\": 3,\t\t\t\"InstructionTexts\": null,\t\t\t\"EquipmentRequirements\": null,\t\t\t\"BillOfMaterial\": [\t\t\t  {\t\t\t\t\"PartNo\": \"82424670\",\t\t\t\t\"Quantity\": 1,\t\t\t\t\"Description\": \"PEDALPLATTA RHD WITHOUT C\"\t\t\t  }\t\t\t],\t\t\t\"Description\": \"PEDALPLATTA RHD WITHOUT C\"\t\t  }\t\t],\t\t\"Id\": \"001_63C0967-2D63-494D-88AC-F5D1BCE7127    _003\",\t\t\"CIN\": \"163733\",\t\t\"Description\": \"PC24: Pedal Platta\",\t\t\"OperationType\": \"II\"\t  },\t  {\t\t\"SequenceNo\": 4,\t\t\"InstructionTexts\": null,\t\t\"EquipmentRequirements\": null,\t\t\"OperationSteps\": [\t\t  {\t\t\t\"SequenceNo\": 3,\t\t\t\"InstructionTexts\": null,\t\t\t\"EquipmentRequirements\": null,\t\t\t\"BillOfMaterial\": [\t\t\t  {\t\t\t\t\"PartNo\": \"82424676\",\t\t\t\t\"Quantity\": 3,\t\t\t\t\"Description\": \"AXELSTYRNING\"\t\t\t  }\t\t\t],\t\t\t\"Description\": \"AXELSTYRNING\"\t\t  }\t\t],\t\t\"Id\": \"001_63C0967-2D63-494D-88AC-F5D1BCE7127    _004\",\t\t\"CIN\": \"163732\",\t\t\"Description\": \"PC24:  Axelstyrning\",\t\t\"OperationType\": \"II\"\t  },\t  {\t\t\"SequenceNo\": 5,\t\t\"InstructionTexts\": [\t\t  {\t\t\t\"SequenceNo\": 0,\t\t\t\"Text\": \"Gleitmo, till insidan av axeln f\uFFFDr bromspedal b\uFFFDda sidor.\",\t\t\t\"RTF\": null\t\t  }\t\t],\t\t\"EquipmentRequirements\": null,\t\t\"OperationSteps\": [\t\t  {\t\t\t\"SequenceNo\": 4,\t\t\t\"InstructionTexts\": null,\t\t\t\"EquipmentRequirements\": null,\t\t\t\"BillOfMaterial\": [\t\t\t  {\t\t\t\t\"PartNo\": \"82424671\",\t\t\t\t\"Quantity\": 1,\t\t\t\t\"Description\": \"AXEL\"\t\t\t  }\t\t\t],\t\t\t\"Description\": \"AXEL\"\t\t  }\t\t],\t\t\"Id\": \"001_63C0967-2D63-494D-88AC-F5D1BCE7127    _005\",\t\t\"CIN\": \"163734\",\t\t\"Description\": \"PC24: Montera broms pedal och Gleitmo\",\t\t\"OperationType\": \"II\"\t  }\t],\t\"Id\": \"001_63C0967-2D63-494D-88AC-F5D1BCE7127\",\t\"Name\": \"FBM-fste Pedalhllare\"\r\n\t\t\t  }\r\n\t\t\t]\r\n\t\t  }';

		try {

			if (typeof processStepsString == 'undefined' || processStepsString == null || !processStepsString) {
				return shim.error('processStepsContainer undefined or null');
			}
			let processStepsContainer = JSON.parse(processStepsString);
			logger.debug('Init - PRE FOR ');
			logger.debug('Init - processStepsContainer.ChassisId         : ' + processStepsContainer.ChassisId);
			logger.debug('Init - processStepsContainer.Component         : ' + processStepsContainer.Component);
			logger.debug('Init - processStepsContainer.SubComponent      : ' + processStepsContainer.SubComponent);
			logger.debug('Init - processStepsContainer.ProductUnits      : ' + processStepsContainer.ProductUnits);
			logger.debug('Init - processStepsContainer.WorkcellResourceId: ' + processStepsContainer.BillOfProcessSteps[0].WorkcellResource.Id);


			let key = this.generateKey(stub, processStepsContainer.Component,
				processStepsContainer.SubComponent,
				processStepsContainer.ChassisId,
				processStepsContainer.BillOfProcessSteps[0].WorkcellResource.Id);

			// Write the state to the ledger
			try {
				await stub.putState(key, Buffer.from(processStepsString));
				logger.info('Init - Success!');
				logger.info('Init - KEY STORED	 : ' + key);
				return shim.success(Buffer.from('Global Store succeed'));
			} catch (e) {
				logger.info('Init - error: ' + e);
				return shim.error(e);
			}

		} catch (e) {
			logger.info('Init	- Parse error: ' + e);
			return shim.error('Parse error found' + e);
		}
		*/
	}

	async Invoke(stub) {
		logger.info('########### Invoke ###########');
		let ret = stub.getFunctionAndParameters();
		let fcn = ret.fcn;
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
		logger.Errorf(`Unknown action, check the first argument, must be one of 'getProcessStepRouting', 'retrieveProcessStep', 'storeProcessStepRouting' or 'storeProcessStepResult'. But got: ${fcn}`);
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
		let iterator = null;
		let chassisDTOs = null;
		if (args.length == 2){
			iterator = await stub.getStateByPartialCompositeKey("HYPER", [args[0], args[1]]);
			chassisDTOs = await datatransform.Transform.iteratorToObjectList(iterator);
		}
		else {
			const key = this.generateKey(stub, args[1], args[2], args[0], null);
			iterator = await stub.getState(key);
			chassisDTOs = datatransform.Transform.bufferToObject(iterator);
		}
		if (!chassisDTOs) {
			return shim.error('listOfChassisDTO with key partial: ' + JSON.stringify(args) + ' not found');
		}
		let jsonResp = JSON.stringify(chassisDTOs);

		logger.info('getProcessStepRouting - Query Response:%s\n', JSON.stringify(jsonResp));
		return shim.success(Buffer.from(jsonResp));
	}


	/* getProcessStep(chassisId, component, subComponent, workCellResourceId) */
	/* The getProcessStep method is called to extract the chassisDTO by chassisId, component, subComponent and workCellResourceId (eventually) */

	async getProcessStep(stub, args) {
		logger.info('########### getProcessStep ###########');
		logger.debug('Args passed: ' + JSON.stringify(args));
		if (args.length < 3 || args.length > 4) {
			return shim.error('Incorrect number of arguments. Expecting 3 or 4, function followed by JSON parameters: ' + args.length);
		}
		let jsonResp = null;
		/* Key is composed by: component subComponent chassisId workCellResourceId */
		if (args[3]) {
			let key = this.generateKey(stub, args[1], args[2], args[0], args[3]);
			logger.info('getProcessStep - key: ' + key);
			let chassisDTObytes = null;

			// Get the state from the ledger
			try {
				chassisDTObytes = await stub.getState(key);
				logger.debug('getProcessStep - chassisDTObytes: ' + chassisDTObytes);
				if (!chassisDTObytes) {
					return shim.error('chassisDTO ' + key + ' not found');
				}
				logger.debug('getProcessStep - chassisDTO toString: ' + chassisDTObytes.toString());
				const chassisDTO = datatransform.Transform.bufferToObject(chassisDTObytes);
				if (chassisDTO && chassisDTO.BillOfProcessSteps && chassisDTO.BillOfProcessSteps.length > 0){
					//jsonResp = chassisDTO.BillOfProcessSteps[0];
					const processSteps = this.extractProcessSteps(chassisDTO);
					jsonResp = JSON.stringify(processSteps);
				}
				else
					return shim.error('No PrcessSteps found.');
			} catch (e) {
				logger.info('getProcessStep - ERROR CATCH: ' + e);
				return shim.error('getProcessStep - Failed to get state with key: ' + key);

			}
		} else {
			/* Key partial is composed by: component subComponent chassisId */
			let iterator = await stub.getStateByPartialCompositeKey("HYPER", [args[1], args[2], args[0]]);
			let listOfChassisDTO = await datatransform.Transform.iteratorToObjectList(iterator);
			logger.debug('getProcessStep - listOfChassisDTO: ' + JSON.stringify(listOfChassisDTO));
			if (!listOfChassisDTO) {
				return shim.error('listOfChassisDTO with key partial: ' + keyPar + ' not found');
			}
			const listOfChassisResult = this.extractProcessSteps(listOfChassisDTO);
			jsonResp = JSON.stringify(listOfChassisResult);

		}

		logger.info('getProcessStep - Query Response:%s\n', JSON.stringify(jsonResp));
		return shim.success(Buffer.from(jsonResp));
	}

	/* getProcessStepResult(chassisId, component, subComponent, workCellResourceId) */
	/* The getProcessStepResult method is called to extract the chassisDTO by chassisId, component, subComponent and workCellResourceId (eventually) */

	async getProcessStepResult(stub, args) {
		logger.info('########### getProcessStepResult ###########');
		logger.debug('getProcessStepResult -> Args: ' + JSON.stringify(args));
		if (args.length !== 4) {
			return shim.error('Incorrect number of arguments. Expecting 4, function followed by JSON parameters');
		}
		let jsonResp;
		/* Key is composed by: chassisId_component_subComponent_workCellResourceId */
		let key = this.generateKey(stub, args[1], args[2], args[0], args[3]);
		logger.info('getProcessStepResult - key: ' + key);
		// Get the state from the ledger
		try {
			let processStepResultDTObytes = await stub.getState(key);
			logger.info('getProcessStepResult - processStepResultDTObytes: ' + processStepResultDTObytes.toString());
			if (!processStepResultDTObytes) {
				return shim.error('processStepResultDTO ' + key + ' not found');
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
		logger.info('storeProcessStepRouting - args	 : ' + args);
		try {
			let processStepsContainer = JSON.parse(args);
			if (typeof processStepsContainer == 'undefined' || processStepsContainer == null || typeof processStepsContainer != 'object') {
				return shim.error('processStepsContainer undefined or null or not object');
			}
			for (let processStep of processStepsContainer) {
				logger.debug('storeProcessStepRouting - processStep.ChassisId   : ' + processStep.ChassisId);
				logger.debug('storeProcessStepRouting - processStep.Component   : ' + processStep.Component);
				logger.debug('storeProcessStepRouting - processStep.SubComponent: ' + processStep.SubComponent);

				if (typeof processStep.BillOfProcessSteps != 'undefined' && processStep.BillOfProcessSteps != null) {
					for (let bops of processStep.BillOfProcessSteps) {

						const workcellResourceId = typeof bops.WorkcellResource !== 'undefined' && bops.WorkcellResource != null ? bops.WorkcellResource.Id : null;
						let key = this.generateKey(stub, processStep.Component,
							processStep.SubComponent,
							processStep.ChassisId,
							workcellResourceId);
						logger.debug('storeProcessStepRouting - key	     : ' + key);

						// Write the state to the ledger
						try {
							await stub.putState(key, Buffer.from(JSON.stringify(processStep)));
							logger.info('storeProcessStepRouting - KEY STORED	 : ' + key);
						} catch (e) {
							return shim.error(e);
						}
					}
				}
			}
			logger.info('storeProcessStepRouting - Global Store succeed ');
			return shim.success(Buffer.from('Global Store succeed'));

		} catch (e) {
			return shim.error('Parse error found');
		}
	}

	/* storeProcessStepResult(chassisId, component, subComponent, processStepResult) */
	/* The storeProcessStepResults method is called to update the chassisDTO (in the part of Results) with chassisId, Component and subComponent */

	async storeProcessStepResult(stub, args) {
		logger.info('########### storeProcessStepResult ###########');

		/* TODO parameter args[0] is composed by: 
		{Component         		 : component,
		 SubComponent            : subComponent,
		 ChassisId         		 : chassisId,
		 WorkCellResourceId		 : workCellResourceId, 
		 BillOfProcessStepResults: [ProcessStepResults]
		} */

		try {
			let processStepResultContainer = JSON.parse(args);
			logger.debug('storeProcessStepResult - processStepResultContainer stringify: ' + JSON.stringify(processStepResultContainer));
			if (typeof processStepResultContainer == 'undefined' || processStepResultContainer == null || typeof processStepResultContainer != 'object') {
				return shim.error('processStepResultsContainer undefined or null');
			}
			//for (let processStepResult of processStepResultContainer) {
			const processStepResult = processStepResultContainer;
			logger.debug('storeProcessStepResult - INTO FOR');
			logger.debug('storeProcessStepResult - processStepResult.ChassisId         : ' + processStepResult.ChassisId);
			logger.debug('storeProcessStepResult - processStepResult.Component         : ' + processStepResult.Component);
			logger.debug('storeProcessStepResult - processStepResult.SubComponent      : ' + processStepResult.SubComponent);
			logger.debug('storeProcessStepResult - processStepResult.workCellResourceId: ' + processStepResult.WorkcellResourceId);

			let key = this.generateKey(stub, processStepResult.Component,
				processStepResult.SubComponent,
				processStepResult.ChassisId,
				processStepResult.WorkcellResourceId);

			try {
				await stub.putState(key, Buffer.from(JSON.stringify(processStepResult)));
				logger.info('storeProcessStepResult - KEY STORED	 : ' + key);
				return shim.success(Buffer.from('ProcessStepResult Store succeed'));

			} catch (e) {
				return shim.error(e);
			}
			//}
		} catch (e) {
			return shim.error('Parse error found');
		}
	}
};

shim.start(new Chaincode());