export type LoadPlanStatus = "draft" | "inspected";

export type InspectionMark = "" | "sat" | "unsat" | "na";

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
  updatedAt: string;
}

export interface PacketStep {
  slug: string;
  title: string;
  short: string;
}

export const PACKET_STEPS: PacketStep[] = [
  { slug: "", title: "AF Form 4080", short: "Load plan" },
  { slug: "cargo-manifests", title: "DD Form 1385", short: "Cargo Manifests" },
  { slug: "dangerous-cargo-load-list", title: "DD Form 2776", short: "Dangerous Cargo Load List" },
  { slug: "packing-list", title: "DD Form 1750", short: "Packing List" },
  { slug: "military-shipment-label", title: "DD Form 1387", short: "Military Shipment Label" },
  { slug: "special-services-label", title: "DD Form 1387-2", short: "Special Services Label" },
  { slug: "inspection-checklist", title: "DD Form 2133", short: "Inspection Checklist" },
];

export function stepPath(id: string, slug: string): string {
  return slug ? `/load-plans/${id}/${slug}` : `/load-plans/${id}`;
}

export function nextStep(slug: string): PacketStep | undefined {
  const index = PACKET_STEPS.findIndex((step) => step.slug === slug);
  return PACKET_STEPS[index + 1];
}
