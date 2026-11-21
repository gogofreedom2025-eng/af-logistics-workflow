export type LoadPlanStatus = "draft" | "inspected";

export type InspectionMark = "" | "sat" | "unsat" | "corrected" | "na";

export interface Block11Marks {
  a: InspectionMark;
  b: InspectionMark;
  c: InspectionMark;
  d: InspectionMark;
  e: InspectionMark;
  f: InspectionMark;
}

export interface BellyWideRow {
  id: string;
  position: string;
  identification: string;
  destination: string;
  location: string;
  grossWeight: number;
  moment: number;
  specialHandling: boolean;
}

export interface BellyNarrowRow {
  id: string;
  location: string;
  destination: string;
  weight: number;
  cube: number;
  specialHandling: boolean;
}

export interface DangerousCargoRow {
  id: string;
  tcn: string;
  stowLocation: string;
  shippingName: string;
  hazardClass: string;
  unNumber: string;
  packingGroup: string;
  typePack: string;
  pieces: string;
  weight: string;
  cube: string;
  netExplosiveWeight: string;
  remarks: string;
}

export interface DangerousCargoCert {
  name: string;
  title: string;
  signature: string;
  date: string;
  remarks: string;
}

export interface InspectionColumn {
  id: string;
  identity: string;
  marks: Record<string, InspectionMark>;
}

export interface JointInspection {
  deployingForce: string;
  departureAirfield: string;
  date: string;
  aircraftAndMission: string;
  loadChalk: string;
  startTime: string;
  completeTime: string;
  mobilityForce: string;
  chapter3: "" | "yes" | "no";
  columns: InspectionColumn[];
  deployingRep: string;
  mobilityInspector: string;
  additionalInformation: string;
}

export interface DangerousCargo {
  agencyName: string;
  agencyAddress: string;
  vesselName: string;
  vesselNumber: string;
  registry: string;
  ircs: string;
  voyageNumber: string;
  vanNumber: string;
  totalNetExplosiveWeight: string;
  portOfEntry: string;
  portOfDestination: string;
  prepared49Cfr: boolean;
  preparedImdg: boolean;
  rows: DangerousCargoRow[];
  declaration: DangerousCargoCert;
  unitKind: string;
  packed: DangerousCargoCert;
}

export interface LoadSequenceRow {
  id: string;
  sequence: number;
  equipment: string;
  station: string;
  identification: string;
  destination: string;
  location: string;
  pieces: number;
  grossWeight: number;
  moment: number;
  position: string;
  overhang: "" | "FOH" | "ROH";
  contents: string;
  specialHandling: boolean;
  specialService: string;
  hazmat: boolean;
  unNumber: string;
  shippingName: string;
  hazardClass: string;
  vehicle: boolean;
  onDash9: boolean;
  attlaReference: string;
}

export interface PackingListRow {
  id: string;
  boxNo: string;
  contents: string;
  unitOfIssue: string;
  initial: string;
  spares: string;
  total: string;
}

export interface CargoManifestRow {
  id: string;
  docId: string;
  vehicleNumber: string;
  year: string;
  make: string;
  containerNumber: string;
  commodity: string;
  comCode: string;
  cargoExc: string;
  voyageDocNo: string;
  airDm: string;
  trnsPt: string;
  portOfDisch: string;
  typePack: string;
  tcn: string;
  consignee: string;
  serv: string;
  activityAddress: string;
  priority: string;
  name: string;
  ammoLot: string;
  dimensions: string;
  rdd: string;
  proj: string;
  stowLoc: string;
  transAcct: string;
  identification: string;
  pieces: string;
  weight: string;
  cube: string;
}

export interface CargoManifest {
  carrier: string;
  acNo: string;
  acModel: string;
  destCode: string;
  airRef: string;
  destination: string;
  missionNo: string;
  missionSu: string;
  missionDate: string;
  alwWt: string;
  alwCu: string;
  manifestSta: string;
  manifestFy: string;
  manifestTy: string;
  manifestNo: string;
  airPageNo: string;
  poe: string;
  dateSailed: string;
  voyageDocumentNo: string;
  pod: string;
  surfaceRef: string;
  vesselName: string;
  status: string;
  sust: string;
  truckNo: string;
  remarks: string;
  surfacePageNo: string;
  rows: CargoManifestRow[];
  totalPieces: string;
  totalWeight: string;
  totalCube: string;
  loadedDate: string;
  loadingAgent: string;
  receivedDate: string;
  unloadingAgent: string;
  receivingDate: string;
  receivingAgent: string;
}

export interface PalletIdentifier {
  palletId: string;
  aircraftConfiguration: string;
  originatingStation: string;
  destinationStation: string;
  netWeight: string;
  straps: string;
  chains: string;
  devices: string;
  netSets: string;
  contents: string;
  grossWeight: string;
  scaleName: string;
  scaleGrade: string;
  scaleDate: string;
  cube: string;
}

export interface ShipmentLabel {
  tcn: string;
  postageData: string;
  from: string;
  typeService: string;
  shipTo: string;
  transPriority: string;
  pod: string;
  project: string;
  ultimateConsignee: string;
  weight: string;
  rdd: string;
  cube: string;
  charges: string;
  dateShipped: string;
  fmsCase: string;
  pieceNumber: string;
  totalPieces: string;
}

export interface SpecialHandling {
  nomenclature: string;
  netQuantity: string;
  tcn: string;
  grossWeight: string;
  destination: string;
  supplemental: string;
  dtrReference: string;
  handlingInstructions: string;
  shipperAddress: string;
  typedName: string;
  signature: string;
  date: string;
}

export interface AircraftLoadLine {
  id: string;
  sequence: string;
  nomenclature: string;
  tcn: string;
  vehiclePackage: string;
  increment: string;
  remarksCode: string;
  otherRemarks: string;
  length: string;
  width: string;
  height: string;
  plannedWeight: string;
  plannedStation: string;
  plannedMoment: string;
  actualWeight: string;
  actualStation: string;
  actualMoment: string;
}

export interface AircraftLoadPlan {
  unit: string;
  uic: string;
  movementPlan: string;
  movementDate: string;
  loadNumber: string;
  missionNumber: string;
  aircraftSerial: string;
  configuration: string;
  departureAirfield: string;
  destinationAirfield: string;
  lines: AircraftLoadLine[];
  seatCount: string;
  seatAverageWeight: string;
  seatPlannedWeight: string;
  seatNotes: string;
  weightFromBack: string;
  momentFromBack: string;
  plannedCbStation: string;
  actualCbStation: string;
  totalPlannedWeight: string;
  totalPlannedMoment: string;
  totalActualWeight: string;
  totalActualMoment: string;
  plannedDate: string;
  plannedName: string;
  plannedSignature: string;
  approvedDate: string;
  approvedName: string;
  approvedSignature: string;
}

export interface AirRequestPassenger {
  id: string;
  name: string;
  grade: string;
  dutyTitle: string;
  branch: string;
}

export interface AirRequestLeg {
  departureIcao: string;
  departWhen: string;
  arrivalIcao: string;
  arriveWhen: string;
}

export interface AirRequestContact {
  name: string;
  grade: string;
  dutyPhone: string;
  afterHours: string;
}

export interface AirRequestSigner {
  name: string;
  grade: string;
  dutyTitle: string;
  officeSymbol: string;
  phone: string;
  signature: string;
  date: string;
  plad: string;
}

export interface AirRequest {
  priority: "" | "1" | "2" | "3";
  pujcCode: string;
  missionDescription: string;
  totalPax: string;
  compellingConsiderations: string;
  seniorName: string;
  seniorGrade: string;
  seniorDutyTitle: string;
  seniorBranch: string;
  passengers: AirRequestPassenger[];
  legs: AirRequestLeg[];
  costLeg1: string;
  costLeg2: string;
  costLeg3: string;
  costTimesPassengers: string;
  costTotal: string;
  cargoDescription: string;
  largestDimensions: string;
  heaviestItem: string;
  totalWeight: string;
  totalCubicFeet: string;
  specialHandling: string;
  departureContact: AirRequestContact;
  arrivalContact: AirRequestContact;
  nonDvPassengers: AirRequestPassenger[];
  remarks: string;
  requester: AirRequestSigner;
  authorizer: AirRequestSigner;
  seniorPassenger: AirRequestSigner;
}

export interface PackingList {
  packedBy: string;
  boxCount: string;
  requisitionNo: string;
  orderNo: string;
  endItem: string;
  date: string;
  rows: PackingListRow[];
  typedName: string;
  signature: string;
}

export interface AirliftPacket {
  id: string;
  status: LoadPlanStatus;
  aircraftType: string;
  missionNumber: string;
  missionRouting: string;
  fromStation: string;
  toStation: string;
  aclOffered: string;
  positionsAvailable: string;
  positionsUsed: string;
  departureDate: string;
  departureTime: string;
  configuration: string;
  looseCargoMail: string;
  operatingWeight: number;
  operatingMoment: number;
  cargoMailWeight: number;
  cargoMailMoment: number;
  zeroFuelWeight: number;
  zeroFuelMoment: number;
  percentMac: string;
  centerOfBalanceStation: string;
  plannedBy: string;
  plannedDate: string;
  phaseIIQualified: "" | "yes" | "no";
  loadedBy: string;
  loadedDate: string;
  timeLoadPlanComplete: string;
  timeReceivedByInfoControl: string;
  startAircraftUpload: string;
  completeAircraftUpload: string;
  scaleName: string;
  scaleGrade: string;
  scaleDate: string;
  specialCertifiedBy: string;
  sddgCertifiedBy: string;
  sddgDate: string;
  deployingUnit: string;
  chalk: string;
  mobilityForce: string;
  inspectionDate: string;
  deployingRepName: string;
  inspectorName: string;
  block11: Block11Marks;
  rows: LoadSequenceRow[];
  bellyWide: BellyWideRow[];
  bellyNarrow: BellyNarrowRow[];
  dangerousCargo: DangerousCargo;
  inspection: JointInspection;
  packingList: PackingList;
  cargoManifest: CargoManifest;
  palletIdentifier: PalletIdentifier;
  airRequest: AirRequest;
  shipmentLabel: ShipmentLabel;
  specialHandling: SpecialHandling;
  c17LoadPlan: AircraftLoadPlan;
  c130LoadPlan: AircraftLoadPlan;
  savedTitle: string;
  savedSlug: string;
  savedAt: string;
  updatedAt: string;
}

export interface PacketStep {
  slug: string;
  title: string;
  short: string;
  hidden?: boolean;
  built?: boolean;
}

export const PACKET_STEPS: PacketStep[] = [
  { slug: "", title: "AF Form 4080", short: "Load plan", built: true },
  { slug: "cargo-manifests", title: "DD Form 1385", short: "Cargo Manifests", built: true },
  { slug: "joint-airlift-inspection", title: "DD Form 2133", short: "Joint Airlift Inspection", built: true },
  { slug: "air-passenger-cargo-request", title: "DD Form 2768", short: "Military Air Passenger/Cargo Request", built: true },
  { slug: "pallet-identifier", title: "DD Form 2775", short: "Pallet Identifier", built: true },
  { slug: "dangerous-cargo-load-list", title: "DD Form 2776", short: "Dangerous Cargo Load List", hidden: true, built: true },
  { slug: "packing-list", title: "DD Form 1750", short: "Packing List", hidden: true, built: true },
  { slug: "military-shipment-label", title: "DD Form 1387", short: "Military Shipment Label", hidden: true, built: true },
  { slug: "special-services-label", title: "DD Form 1387-2", short: "Special Handling Data/Certification", hidden: true, built: true },
  { slug: "c17-load-plan", title: "DD Form 2130-13", short: "C-17 Load Plan", built: true },
  { slug: "c130-load-plan", title: "DD Form 2130-2", short: "C-130 E/H/J Load Plan", built: true },
];

export function stepPath(id: string, slug: string): string {
  return slug ? `/load-plans/${id}/${slug}` : `/load-plans/${id}`;
}

export function nextStep(slug: string): PacketStep | undefined {
  const index = PACKET_STEPS.findIndex((step) => step.slug === slug);
  return PACKET_STEPS.slice(index + 1).find((step) => step.built && !step.hidden);
}
