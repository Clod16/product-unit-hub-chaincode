public class ProcessStepResultDTO {
    private String chassisId;
    private String component;
    private String subComponent;
    private String workCellResourceId;
    private Collection<OperationResult> operationResults;

public class OperationResult {
    private Collection<OperationStepResult> operationStepResults;
    
public class OperationStepResult {
    private Integer sequenceNo;
    private String stepName;
    private String stepStatus;
    private String channelId;
    private EquipmentResult equipmentResult;
    private EquipmentRequirement equipmentRequirement;

public class EquipmentResult {
    private Integer sequenceNo;
    private String equipmentType;
    private Collection<EquipmentResultRecord> results;

public class EquipmentRequirement {
    private String equipmentType;
    private Integer sequenceNo;
    private Collection<EquipmentSpecification> specifications;


public class EquipmentResultRecord {
    private Integer sequenceNo;
    private String result;
    private String value;
    private String quantity;

public class EquipmentSpecification {
    public Integer sequenceNo;
    public String specification;
    public String value;
    public Integer quantity;
    public Collection<Parameters> parameters;

public class Parameters {
    public String group;
    public String id;
    public String value;