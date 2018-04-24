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

	generateKey(stub, component, subComponent, chassisId, workcellResourceId) {
		logger.info('########### generateKey ###########');
		logger.info('generateKey - chassisId         :    ' + chassisId);
		logger.info('generateKey - component         :    ' + component);
		logger.info('generateKey - subComponent      : ' + subComponent);
		if (typeof workcellResourceId == "undefined" && !workcellResourceId) {
			logger.info('generateKey - workcellResourceId: ' + workcellResourceId);
			return stub.createCompositeKey("HYPER", [component, subComponent, chassisId]);	
		}
		else return stub.createCompositeKey("HYPER", [component, subComponent, chassisId, workcellResourceId]);
	}

	
	async Init(stub) {
		logger.info('########### Init ###########');

	    
	let processStepsString = '{\"ChassisId\": \"A819631\",\"Component\": \"CAB\",\"SubComponent\": \"TCAB\",\"ProductUnits\": \"productUnit\",\"BillOfProcessSteps\": [\r\n\t\t\t  {\t\"SequenceNo\": 1,\t\"PlannedProductionTime\": 0,\t\"WorkcellResource\": {\t  \"Id\": \"CTPP-01A\",\t  \"Name\": \"CTPP-01A\"\t},\t\"BillOfOperation\": [\t  {\t\t\"SequenceNo\": 1,\t\t\"InstructionTexts\": null,\t\t\"EquipmentRequirements\": null,\t\t\"OperationSteps\": [\t\t  {\t\t\t\"SequenceNo\": 1,\t\t\t\"InstructionTexts\": [\t\t\t  {\t\t\t\t\"SequenceNo\": 1,\t\t\t\t\"Text\": \"Bromscylinder 4 st, 24 Nm.\",\t\t\t\t\"RTF\": \"\"\t\t\t  }\t\t\t],\t\t\t\"EquipmentRequirements\": [\t\t\t  {\t\t\t\t\"SequenceNo\": 1,\t\t\t\t\"EquipmentType\": \"91\",\t\t\t\t\"Specifications\": [\t\t\t\t  {\t\t\t\t\t\"SequenceNo\": 1,\t\t\t\t\t\"Specification\": \"01_24Nm\",\t\t\t\t\t\"Value\": \"\",\t\t\t\t\t\"Quantity\": 4,\t\t\t\t\t\"Parameters\": null\t\t\t\t  }\t\t\t\t]\t\t\t  }\t\t\t],\t\t\t\"BillOfMaterial\": null,\t\t\t\"Description\": \"Bromscylinder 4 st, 24 Nm.\"\t\t  },\t\t  {\t\t\t\"SequenceNo\": 2,\t\t\t\"InstructionTexts\": [\t\t\t  {\t\t\t\t\"SequenceNo\": 2,\t\t\t\t\"Text\": \"Stoppskruv 1st, 24 Nm.\",\t\t\t\t\"RTF\": \"\"\t\t\t  }\t\t\t],\t\t\t\"EquipmentRequirements\": [\t\t\t  {\t\t\t\t\"SequenceNo\": 1,\t\t\t\t\"EquipmentType\": \"91\",\t\t\t\t\"Specifications\": [\t\t\t\t  {\t\t\t\t\t\"SequenceNo\": 1,\t\t\t\t\t\"Specification\": \"01_24Nm\",\t\t\t\t\t\"Value\": \"\",\t\t\t\t\t\"Quantity\": 1,\t\t\t\t\t\"Parameters\": null\t\t\t\t  }\t\t\t\t]\t\t\t  }\t\t\t],\t\t\t\"BillOfMaterial\": null,\t\t\t\"Description\": \"Stoppskruv 1st, 24 Nm.\"\t\t  }\t\t],\t\t\"Id\": \"001_63C0967-2D63-494D-88AC-F5D1BCE7127    _001\",\t\t\"CIN\": \"168336\",\t\t\"Description\": \"Dragningar pedalplatta\",\t\t\"OperationType\": \"AI\"\t  },\t  {\t\t\"SequenceNo\": 2,\t\t\"InstructionTexts\": null,\t\t\"EquipmentRequirements\": null,\t\t\"OperationSteps\": [\t\t  {\t\t\t\"SequenceNo\": 1,\t\t\t\"InstructionTexts\": null,\t\t\t\"EquipmentRequirements\": null,\t\t\t\"BillOfMaterial\": null,\t\t\t\"Description\": \"\"\t\t  }\t\t],\t\t\"Id\": \"001_63C0967-2D63-494D-88AC-F5D1BCE7127    _002\",\t\t\"CIN\": \"170767\",\t\t\"Description\": \"PC24 FH\/FM: Variantinformation\",\t\t\"OperationType\": \"AI\"\t  },\t  {\t\t\"SequenceNo\": 3,\t\t\"InstructionTexts\": null,\t\t\"EquipmentRequirements\": null,\t\t\"OperationSteps\": [\t\t  {\t\t\t\"SequenceNo\": 3,\t\t\t\"InstructionTexts\": null,\t\t\t\"EquipmentRequirements\": null,\t\t\t\"BillOfMaterial\": [\t\t\t  {\t\t\t\t\"PartNo\": \"82424670\",\t\t\t\t\"Quantity\": 1,\t\t\t\t\"Description\": \"PEDALPLATTA RHD WITHOUT C\"\t\t\t  }\t\t\t],\t\t\t\"Description\": \"PEDALPLATTA RHD WITHOUT C\"\t\t  }\t\t],\t\t\"Id\": \"001_63C0967-2D63-494D-88AC-F5D1BCE7127    _003\",\t\t\"CIN\": \"163733\",\t\t\"Description\": \"PC24: Pedal Platta\",\t\t\"OperationType\": \"II\"\t  },\t  {\t\t\"SequenceNo\": 4,\t\t\"InstructionTexts\": null,\t\t\"EquipmentRequirements\": null,\t\t\"OperationSteps\": [\t\t  {\t\t\t\"SequenceNo\": 3,\t\t\t\"InstructionTexts\": null,\t\t\t\"EquipmentRequirements\": null,\t\t\t\"BillOfMaterial\": [\t\t\t  {\t\t\t\t\"PartNo\": \"82424676\",\t\t\t\t\"Quantity\": 3,\t\t\t\t\"Description\": \"AXELSTYRNING\"\t\t\t  }\t\t\t],\t\t\t\"Description\": \"AXELSTYRNING\"\t\t  }\t\t],\t\t\"Id\": \"001_63C0967-2D63-494D-88AC-F5D1BCE7127    _004\",\t\t\"CIN\": \"163732\",\t\t\"Description\": \"PC24:  Axelstyrning\",\t\t\"OperationType\": \"II\"\t  },\t  {\t\t\"SequenceNo\": 5,\t\t\"InstructionTexts\": [\t\t  {\t\t\t\"SequenceNo\": 0,\t\t\t\"Text\": \"Gleitmo, till insidan av axeln f\uFFFDr bromspedal b\uFFFDda sidor.\",\t\t\t\"RTF\": null\t\t  }\t\t],\t\t\"EquipmentRequirements\": null,\t\t\"OperationSteps\": [\t\t  {\t\t\t\"SequenceNo\": 4,\t\t\t\"InstructionTexts\": null,\t\t\t\"EquipmentRequirements\": null,\t\t\t\"BillOfMaterial\": [\t\t\t  {\t\t\t\t\"PartNo\": \"82424671\",\t\t\t\t\"Quantity\": 1,\t\t\t\t\"Description\": \"AXEL\"\t\t\t  }\t\t\t],\t\t\t\"Description\": \"AXEL\"\t\t  }\t\t],\t\t\"Id\": \"001_63C0967-2D63-494D-88AC-F5D1BCE7127    _005\",\t\t\"CIN\": \"163734\",\t\t\"Description\": \"PC24: Montera broms pedal och Gleitmo\",\t\t\"OperationType\": \"II\"\t  }\t],\t\"Id\": \"001_63C0967-2D63-494D-88AC-F5D1BCE7127\",\t\"Name\": \"FBM-fste Pedalhllare\"\r\n\t\t\t  }\r\n\t\t\t]\r\n\t\t  }';

			

		try{
	
			if(typeof processStepsString == 'undefined' || processStepsString == null || !processStepsString) {
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
				logger.info('Init - KEY STORED	 : ' + key );
				return shim.success(Buffer.from('Global Store succeed'));
			} catch (e) {
				logger.info('Init - error: ' + e);
				return shim.error(e);
			}
			
		} catch (e) {
			logger.info('Init	- Parse error: ' + e);
			return shim.error('Parse error found' + e);
		}
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
		logger.Errorf(`Unknown action, check the first argument, must be one of 'getProcessStepRouting', 'retrieveProcessStep', 'storeProcessStepRouting' or 'storeProcessStepResult'. But got: ${fcn}`);
		return shim.error(`Unknown action, check the first argument, must be one of 'getProcessStepRouting', 'retrieveProcessStep', 'storeProcessStepRouting' or 'storeProcessStepResult'. But got: ${fcn}`);
	}

	/* methods GET */
	/* getProcessStepRouting(component, subComponent) */
	/* The getProcessStepRouting method is called to extract all chassisDTOs by Component and subComponent */ 
 
	async getProcessStepRouting(stub, args) {
		logger.info('########### getProcessStepRouting ###########');
		if (args.length != 2) {
			return shim.error('Incorrect number of arguments. Expecting 2, function followed by JSON parameters');
		}
		let iterator 			= await stub.getStateByPartialCompositeKey("HYPER",[args[0], args[1]]);
		let listOfChassisDTO 	= await datatransform.Transform.iteratorToKVList(iterator);
		
		if (!listOfChassisDTO) {
			return shim.error('listOfChassisDTO with key partial: ' + keyPar + ' not found');
		}

		let jsonResp = listOfChassisDTO;

		logger.info('getProcessStepRouting - Query Response:%s\n', JSON.stringify(jsonResp));
		return shim.success(Buffer.from(jsonResp));
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
		logger.info('########### getProcessStep ###########');
		if (args.length < 3 || args.length > 4) {
			return shim.error('Incorrect number of arguments. Expecting 3 or 4, function followed by JSON parameters: ' + args.length);
		}
		let jsonResp; 
		/* Key is composed by: component subComponent chassisId workCellResourceId */
		if (args[3]) {
			let key = this.generateKey(stub, args[1], args[2], args[0], args[3]);
			logger.info('getProcessStep - key: ' + key);
			let chassisDTO;

			// Get the state from the ledger
			try {
				let chassisDTObytes = await stub.getState(key);
				logger.debug('getProcessStep - chassisDTObytes: ' + chassisDTObytes);
				if (!chassisDTObytes) {
					return shim.error('chassisDTO ' + key + ' not found');
				}
				chassisDTO = datatransform.Transform.bufferToObject(chassisDTObytes);
				logger.info('getProcessStep - chassisDTO letto: ' + JSON.stringify(chassisDTO));
			} catch (e) {
				logger.info('getProcessStep - ERROR CATCH: ' + e);
				return shim.error('getProcessStep - Failed to get state with key: ' + key);
			}
			jsonResp = chassisDTO;

		}
		else {
			/* Key partial is composed by: component subComponent chassisId */
			let iterator 			= await stub.getStateByPartialCompositeKey("HYPER",[args[1], args[2], args[0]]);
			let listOfChassisDTO 	= await datatransform.Transform.iteratorToKVList(iterator);
			logger.debug('getProcessStep - listOfChassisDTO: ' + JSON.stringify(listOfChassisDTO));
			if (!listOfChassisDTO) {
				return shim.error('listOfChassisDTO with key partial: ' + keyPar + ' not found');
			}
			jsonResp = listOfChassisDTO;
		}
		
		logger.info('getProcessStep - Query Response:%s\n', JSON.stringify(jsonResp));
		return shim.success(Buffer.from(jsonResp));
	}

		/* getProcessStepResult(chassisId, component, subComponent, workCellResourceId) */
	/* The getProcessStepResult method is called to extract the chassisDTO by chassisId, component, subComponent and workCellResourceId (eventually) */

	async getProcessStepResult(stub, args) {
		logger.info('########### getProcessStepResult ###########');
		if (args.length < 3 || args.length > 4) {
			return shim.error('Incorrect number of arguments. Expecting 3 or 4, function followed by JSON parameters');
		}
		let jsonResp; 
		/* Key is composed by: chassisId_component_subComponent_workCellResourceId */
		if (args[3]) {
			let key = this.generateKey(stub, args[1], args[2], args[0], args[3]);
			logger.info('getProcessStepResult - key: ' + key);
			let   processStepResultDTO;
			
			// Get the state from the ledger
			try {
				let processStepResultDTObytes = await stub.getState(key);
				logger.info('getProcessStepResult - processStepResultDTObytes: ' + processStepResultDTObytes);
				if (!processStepResultDTObytes) {
					return shim.error('processStepResultDTO ' + key + ' not found');
				}
				processStepResultDTO = datatransform.Transform.bufferToObject(processStepResultDTObytes);
				//processStepResultDTObytes.toString();
				logger.info('getProcessStepResult - processStepResultDTO letto: ' + JSON.stringify(processStepResultDTO));
			} catch (e) {
				logger.info('getProcessStepResult - ERROR CATCH: ' + e);
				return shim.error('Failed to get state with key: ' + key);
			}
			jsonResp = processStepResultDTO;
		}
		else {
			/* Key partial is composed by: component_subComponent_chassisId */
			let iterator 				   = await stub.getStateByPartialCompositeKey("HYPER",[args[1], args[2], args[0]]);
			let listOfProcessStepResultDTO = await datatransform.Transform.iteratorToKVList(iterator);
			logger.debug('getProcessStep - listOfChassisDTO: ' + JSON.stringify(listOfProcessStepResultDTO));
			
			if (!listOfProcessStepResultDTO) {
				return shim.error('listOfProcessStepResultDTO ' + key + ' not found');
			}
			jsonResp = listOfProcessStepResultDTO;
		}
		logger.info('getProcessStepResult - Query Response:%s\n', JSON.stringify(jsonResp));
		return shim.success(Buffer.from(jsonResp));
	}

	/* methods POST */
	/* storeProcessSteps(component, subComponent) */
	/* The storeProcessSteps method is called to store all chassisDTOs with Component and subComponent */ 

	async storeProcessStepRouting(stub, args) {
		logger.info('########### storeProcessStepRouting ###########');
		
		/* Number arguments 1: (function , JSON parameters) */
		/* if (args.length != 1) {
			return shim.error('Incorrect number of arguments. Expecting 1, function followed by JSON parameters');
		} */

		logger.debug('storeProcessStepRouting - args	 : ' + args );
		try{
			let processStepsContainer = JSON.parse(args);
			if(typeof processStepsContainer == 'undefined' || processStepsContainer == null || typeof processStepsContainer != 'object') {
				return shim.error('processStepsContainer undefined or null or not object');
			}
			for (let value of processStepsContainer) {
				logger.debug('storeProcessStepRouting - value.ChassisId   : '+ value.ChassisId);
				logger.debug('storeProcessStepRouting - value.Component   : '+ value.Component);
				logger.debug('storeProcessStepRouting - value.SubComponent: '+ value.SubComponent);
				logger.debug('storeProcessStepRouting - value.ProductUnits: '+ value.ProductUnits);
				
				let chassisDTO = value;
					chassisDTO.chassisId           = value.ChassisId;	
					chassisDTO.component           = value.Component;
					chassisDTO.subComponent        = value.SubComponent;
					chassisDTO.productUnits 	   = value.ProductUnits; 
				
				for (let bops of value.BillOfProcessSteps) {
					logger.debug('storeProcessStepRouting - bops.WorkcellResource.Id: '+ bops.WorkcellResource.Id);

					let key = this.generateKey(stub, value.Component,
													 value.SubComponent,
													 value.ChassisId,
													 bops.WorkcellResource.Id);
					logger.debug('storeProcessStepRouting - key	     : ' + key );
					chassisDTO.billOfProcessSteps  = bops;
					
					// Write the state to the ledger
					try {
						await stub.putState(key, Buffer.from(JSON.stringify(chassisDTO)));
						logger.info('storeProcessStepRouting - KEY STORED	 : ' + key );
					/*
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
						return shim.success(Buffer.from('Global Store succeed')); */
					} catch (e) {
					return shim.error(e);
					}
				}
			}
			logger.info('storeProcessStepRouting - Global Store succeed ' );
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
		
		/* Number arguments 1: (function , JSON parameters) */
	/*	if (args.length != 1) {
			return shim.error('Incorrect number of arguments. Expecting 1, function followed by JSON parameters');
		}
	*/	
		try{
			let processStepResultContainer = JSON.parse(args);
			if(typeof processStepResultContainer == 'undefined' || processStepResultContainer == null || typeof processStepResultContainer != 'object') {
				return shim.error('processStepResultsContainer undefined or null');
			}
			for (let value of processStepResultContainer) {
				logger.debug('storeProcessStepResult - INTO FOR');
				logger.debug('storeProcessStepResult - value.ChassisId         : '+ value.ChassisId);
				logger.debug('storeProcessStepResult - value.Component         : '+ value.Component);
				logger.debug('storeProcessStepResult - value.SubComponent      : '+ value.SubComponent);
				logger.debug('storeProcessStepResult - value.workCellResourceId: '+ value.workCellResourceId);
				
				let processStepResultDTO 			        = value;
					processStepResultDTO.chassisId          = value.ChassisId;	
					processStepResultDTO.component          = value.Component;
					processStepResultDTO.subComponent       = value.SubComponent;
					processStepResultDTO.workCellResourceId = value.WorkCellResourceId;
					processStepResultDTO.operationResults 	= value.OperationResults;

				let key = this.generateKey(stub, value.Component,
												 value.SubComponent,
												 value.ChassisId,
												 value.workCellResourceId);

			 	try {
					await stub.putState(key, Buffer.from(JSON.stringify(processStepResultDTO)));
					logger.info('storeProcessStepResult - KEY STORED	 : ' + key );
												
							
					} catch (e) {
						return shim.error(e);
				}	
			}
		} catch (e) {
			return shim.error('Parse error found');
		}
	}
};

shim.start(new Chaincode());
