import type {
  AirliftPacket,
  BellyNarrowRow,
  BellyWideRow,
  Block11Marks,
  DangerousCargo,
  DangerousCargoCert,
  DangerousCargoRow,
  InspectionColumn,
  JointInspection,
  LoadSequenceRow,
  AirRequest,
  AirRequestContact,
  AirRequestLeg,
  AirRequestPassenger,
  AirRequestSigner,
  CargoManifest,
  CargoManifestRow,
  PalletIdentifier,
  ShipmentLabel,
  SpecialHandling,
  AircraftLoadLine,
  AircraftLoadPlan,
  PackingList,
  PackingListRow,
} from "../types/loadPlan";
import { newId, todayYYYYMMDD } from "../utils/format";

export function isoToday(): string {
  const compact = todayYYYYMMDD();
  return `${compact.slice(0, 4)}-${compact.slice(4, 6)}-${compact.slice(6, 8)}`;
}

export function emptyMarks(): Block11Marks {
  return { a: "", b: "", c: "", d: "", e: "", f: "" };
}

export function emptyRow(): LoadSequenceRow {
  return {
    id: newId("row"),
    sequence: 1,
    equipment: "",
    station: "",
    identification: "",
    destination: "",
    location: "",
    pieces: 1,
    grossWeight: 0,
    moment: 0,
    position: "",
    overhang: "",
    contents: "",
    specialHandling: false,
    specialService: "",
    hazmat: false,
    unNumber: "",
    shippingName: "",
    hazardClass: "",
    vehicle: false,
    onDash9: false,
    attlaReference: "",
  };
}

export function emptyBellyWide(): BellyWideRow {
  return {
    id: newId("belly"),
    position: "",
    identification: "",
    destination: "",
    location: "",
    grossWeight: 0,
    moment: 0,
    specialHandling: false,
  };
}

export function emptyBellyNarrow(): BellyNarrowRow {
  return {
    id: newId("narrow"),
    location: "",
    destination: "",
    weight: 0,
    cube: 0,
    specialHandling: false,
  };
}

const emptyCert = (): DangerousCargoCert => ({
  name: "",
  title: "",
  signature: "",
  date: "",
  remarks: "",
});

export function emptyDangerousCargoRow(): DangerousCargoRow {
  return {
    id: newId("haz"),
    tcn: "",
    stowLocation: "",
    shippingName: "",
    hazardClass: "",
    unNumber: "",
    packingGroup: "",
    typePack: "",
    pieces: "",
    weight: "",
    cube: "",
    netExplosiveWeight: "",
    remarks: "",
  };
}

export function sampleDangerousCargo(): DangerousCargo {
  return {
    page: "1",
    pages: "1",
    agencyName: "621 CRW",
    agencyAddress: "436th Airlift Wing\nDover AFB\nDover, DE 19902",
    vesselName: "C-17A",
    vesselNumber: "08-8190",
    registry: "USAF",
    ircs: "RCH7547",
    voyageNumber: "PVRA7547",
    vanNumber: "PLT-4402",
    totalNetExplosiveWeight: "0",
    portOfEntry: "KDOV",
    portOfDestination: "ETAR",
    prepared49Cfr: true,
    preparedImdg: false,
    rows: [
      {
        id: "haz-plt-4402",
        tcn: "FB6214402X0001XXX",
        stowLocation: "2",
        shippingName: "Paint",
        hazardClass: "3",
        unNumber: "UN1263",
        packingGroup: "III",
        typePack: "Can",
        pieces: "12",
        weight: "816",
        cube: "2.4",
        netExplosiveWeight: "0",
        remarks: "Flash point 28 C. Pallet PLT-4402, 1,800 lb.",
      },
    ],
    declaration: {
      name: "Nguyen, A.",
      title: "SSgt",
      signature: "A. Nguyen",
      date: "2026-11-13",
      remarks: "",
    },
    unitKind: "463L pallet",
    packed: {
      name: "Nguyen, A.",
      title: "SSgt",
      signature: "A. Nguyen",
      date: "2026-11-13",
      remarks: "12 cans secured on pallet PLT-4402.",
    },
  };
}

function dangerousCargoIsBlank(cargo: DangerousCargo | undefined): boolean {
  if (!cargo) return true;
  const text = [
    cargo.page,
    cargo.pages,
    cargo.agencyName,
    cargo.agencyAddress,
    cargo.vesselName,
    cargo.vesselNumber,
    cargo.registry,
    cargo.ircs,
    cargo.voyageNumber,
    cargo.vanNumber,
    cargo.totalNetExplosiveWeight,
    cargo.portOfEntry,
    cargo.portOfDestination,
    cargo.unitKind,
    cargo.declaration?.name,
    cargo.packed?.name,
    ... (cargo.rows ?? []).flatMap((row) => [row.tcn, row.shippingName, row.unNumber, row.remarks]),
  ];
  return text.every((value) => !value?.trim()) && !cargo.prepared49Cfr && !cargo.preparedImdg;
}

export function withSampleDangerousCargo(plan: AirliftPacket): AirliftPacket {
  if (plan.id !== "lp-c17-sample" || !dangerousCargoIsBlank(plan.dangerousCargo)) return plan;
  return { ...plan, dangerousCargo: sampleDangerousCargo() };
}

export function emptyInspectionColumn(): InspectionColumn {
  return { id: newId("inc"), identity: "", marks: {} };
}

export function emptyInspection(): JointInspection {
  return {
    deployingForce: "",
    departureAirfield: "",
    date: isoToday(),
    aircraftAndMission: "",
    loadChalk: "",
    startTime: "",
    completeTime: "",
    mobilityForce: "",
    chapter3: "",
    columns: [emptyInspectionColumn()],
    deployingRep: "",
    mobilityInspector: "",
    additionalInformation: "",
  };
}

export function withInspection(value: JointInspection | undefined): JointInspection {
  const base = emptyInspection();
  if (!value) return base;
  return {
    ...base,
    ...value,
    chapter3: value.chapter3 ?? "",
    columns: value.columns?.length
      ? value.columns.map((column) => ({ ...column, marks: column.marks ?? {} }))
      : base.columns,
  };
}

function inspectionIsBlank(value: JointInspection | undefined): boolean {
  if (!value) return true;
  const text = [
    value.deployingForce,
    value.departureAirfield,
    value.aircraftAndMission,
    value.loadChalk,
    value.mobilityForce,
    value.deployingRep,
    value.mobilityInspector,
    value.additionalInformation,
  ];
  const columns = value.columns ?? [];
  const anyColumn = columns.some(
    (column) => column.identity?.trim() || Object.values(column.marks ?? {}).some(Boolean),
  );
  return text.every((item) => !item?.trim()) && !value.chapter3 && !anyColumn;
}

function sampleInspection(): JointInspection {
  const column = (identity: string): InspectionColumn => ({
    id: `inc-${identity.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`,
    identity,
    marks: {},
  });
  return {
    ...emptyInspection(),
    deployingForce: "621 CRW",
    departureAirfield: "Dover AFB",
    date: "2026-11-13",
    aircraftAndMission: "C-17A 08-8190 / PVRA7547",
    loadChalk: "1",
    columns: [
      column("PLT-4401 / 463L pallet"),
      column("PLT-4402 / 463L pallet"),
      column("A-12 / M1151 HMMWV"),
    ],
  };
}

export function withSampleInspection(plan: AirliftPacket): AirliftPacket {
  if (plan.id !== "lp-c17-sample" || !inspectionIsBlank(plan.inspection)) return plan;
  return { ...plan, inspection: sampleInspection() };
}

export function withStoredPlan(plan: AirliftPacket): AirliftPacket {
  return withSampleInspection(withSampleDangerousCargo(plan));
}

export function emptyDangerousCargo(): DangerousCargo {
  return {
    page: "",
    pages: "",
    agencyName: "",
    agencyAddress: "",
    vesselName: "",
    vesselNumber: "",
    registry: "",
    ircs: "",
    voyageNumber: "",
    vanNumber: "",
    totalNetExplosiveWeight: "",
    portOfEntry: "",
    portOfDestination: "",
    prepared49Cfr: false,
    preparedImdg: false,
    rows: [emptyDangerousCargoRow()],
    declaration: emptyCert(),
    unitKind: "",
    packed: emptyCert(),
  };
}

export function withDangerousCargo(value: DangerousCargo | undefined): DangerousCargo {
  const base = emptyDangerousCargo();
  if (!value) return base;
  return {
    ...base,
    ...value,
    page: digitsOnly(value.page ?? ""),
    pages: digitsOnly(value.pages ?? ""),
    prepared49Cfr: value.prepared49Cfr ?? false,
    preparedImdg: value.preparedImdg ?? false,
    unitKind: value.unitKind ?? "",
    rows: value.rows?.length ? value.rows : base.rows,
    declaration: { ...emptyCert(), ...value.declaration },
    packed: { ...emptyCert(), ...value.packed },
  };
}

export function cargoWeight(plan: AirliftPacket): number {
  return (plan.rows ?? []).reduce((sum, row) => sum + (Number(row.grossWeight) || 0), 0);
}

export function digitsOnly(value: string): string {
  return value.replace(/\D/g, "");
}

export function packingRowTotal(initial: string, spares: string): string {
  const left = initial.trim();
  const right = spares.trim();
  if (!left && !right) return "";
  const initialQty = Number(left);
  const sparesQty = Number(right);
  if ((left && Number.isNaN(initialQty)) || (right && Number.isNaN(sparesQty))) return "";
  return String((left ? initialQty : 0) + (right ? sparesQty : 0));
}

export function emptyCargoManifestRow(): CargoManifestRow {
  return {
    id: newId("man"),
    docId: "",
    vehicleNumber: "",
    year: "",
    make: "",
    containerNumber: "",
    commodity: "",
    comCode: "",
    cargoExc: "",
    voyageDocNo: "",
    airDm: "",
    trnsPt: "",
    portOfDisch: "",
    typePack: "",
    tcn: "",
    consignee: "",
    serv: "",
    activityAddress: "",
    priority: "",
    name: "",
    ammoLot: "",
    dimensions: "",
    rdd: "",
    proj: "",
    stowLoc: "",
    transAcct: "",
    identification: "",
    pieces: "",
    weight: "",
    cube: "",
  };
}

export function emptyPalletIdentifier(): PalletIdentifier {
  return {
    palletId: "",
    aircraftConfiguration: "",
    originatingStation: "",
    destinationStation: "",
    netWeight: "",
    straps: "",
    chains: "",
    devices: "",
    netSets: "",
    contents: "",
    grossWeight: "",
    scaleName: "",
    scaleGrade: "",
    scaleDate: "",
    cube: "",
  };
}

export function withPalletIdentifier(value: PalletIdentifier | undefined): PalletIdentifier {
  return { ...emptyPalletIdentifier(), ...value };
}

export function emptyShipmentLabel(): ShipmentLabel {
  return {
    tcn: "",
    postageData: "",
    from: "",
    typeService: "",
    shipTo: "",
    transPriority: "",
    pod: "",
    project: "",
    ultimateConsignee: "",
    weight: "",
    rdd: "",
    cube: "",
    charges: "",
    dateShipped: "",
    fmsCase: "",
    pieceNumber: "",
    totalPieces: "",
  };
}

export function withShipmentLabel(value: ShipmentLabel | undefined): ShipmentLabel {
  return { ...emptyShipmentLabel(), ...value };
}

export function emptySpecialHandling(): SpecialHandling {
  return {
    nomenclature: "",
    netQuantity: "",
    tcn: "",
    grossWeight: "",
    destination: "",
    supplemental: "",
    dtrReference: "",
    handlingInstructions: "",
    shipperAddress: "",
    typedName: "",
    signature: "",
    date: "",
  };
}

export function withSpecialHandling(value: SpecialHandling | undefined): SpecialHandling {
  return { ...emptySpecialHandling(), ...value };
}

export function emptyAircraftLoadLine(): AircraftLoadLine {
  return {
    id: newId("load"),
    sequence: "",
    nomenclature: "",
    tcn: "",
    vehiclePackage: "",
    increment: "",
    remarksCode: "",
    otherRemarks: "",
    length: "",
    width: "",
    height: "",
    plannedWeight: "",
    plannedStation: "",
    plannedMoment: "",
    actualWeight: "",
    actualStation: "",
    actualMoment: "",
  };
}

function fillAircraftLoadLine(row?: Partial<AircraftLoadLine>): AircraftLoadLine {
  const blank = {
    sequence: "",
    nomenclature: "",
    tcn: "",
    vehiclePackage: "",
    increment: "",
    remarksCode: "",
    otherRemarks: "",
    length: "",
    width: "",
    height: "",
    plannedWeight: "",
    plannedStation: "",
    plannedMoment: "",
    actualWeight: "",
    actualStation: "",
    actualMoment: "",
  };
  return { ...blank, ...row, id: row?.id || newId("load") };
}

export function emptyAircraftLoadPlan(): AircraftLoadPlan {
  return {
    page: "",
    pages: "",
    unit: "",
    uic: "",
    movementPlan: "",
    movementDate: "",
    loadNumber: "",
    missionNumber: "",
    aircraftSerial: "",
    configuration: "",
    departureAirfield: "",
    destinationAirfield: "",
    lines: [emptyAircraftLoadLine()],
    seatCount: "",
    seatAverageWeight: "",
    seatPlannedWeight: "",
    seatNotes: "",
    weightFromBack: "",
    momentFromBack: "",
    plannedCbStation: "",
    actualCbStation: "",
    totalPlannedWeight: "",
    totalPlannedMoment: "",
    totalActualWeight: "",
    totalActualMoment: "",
    plannedDate: "",
    plannedName: "",
    plannedSignature: "",
    approvedDate: "",
    approvedName: "",
    approvedSignature: "",
  };
}

export function withAircraftLoadPlan(value: AircraftLoadPlan | undefined): AircraftLoadPlan {
  const base = emptyAircraftLoadPlan();
  if (!value) return base;
  return {
    ...base,
    ...value,
    page: digitsOnly(value.page ?? ""),
    pages: digitsOnly(value.pages ?? ""),
    lines: value.lines?.length ? value.lines.map((line) => fillAircraftLoadLine(line)) : base.lines,
  };
}

export function emptyAirRequestPassenger(): AirRequestPassenger {
  return { id: newId("pax"), name: "", grade: "", dutyTitle: "", branch: "" };
}

function emptyAirRequestLeg(): AirRequestLeg {
  return { departureIcao: "", departWhen: "", arrivalIcao: "", arriveWhen: "" };
}

function emptyAirRequestContact(): AirRequestContact {
  return { name: "", grade: "", dutyPhone: "", afterHours: "" };
}

function emptyAirRequestSigner(): AirRequestSigner {
  return {
    name: "",
    grade: "",
    dutyTitle: "",
    officeSymbol: "",
    phone: "",
    signature: "",
    date: "",
    plad: "",
  };
}

function airRequestPassengers(rows: AirRequestPassenger[] | undefined): AirRequestPassenger[] {
  return rows?.length ? rows.map((row) => ({ ...emptyAirRequestPassenger(), ...row, id: row.id || newId("pax") })) : [emptyAirRequestPassenger(), emptyAirRequestPassenger(), emptyAirRequestPassenger()];
}

function airRequestLegs(rows: AirRequestLeg[] | undefined): AirRequestLeg[] {
  const legs = (rows ?? []).slice(0, 3).map((leg) => ({ ...emptyAirRequestLeg(), ...leg }));
  while (legs.length < 3) legs.push(emptyAirRequestLeg());
  return legs;
}

export function emptyAirRequest(): AirRequest {
  return {
    priority: "",
    pujcCode: "",
    missionDescription: "",
    totalPax: "",
    compellingConsiderations: "",
    seniorName: "",
    seniorGrade: "",
    seniorDutyTitle: "",
    seniorBranch: "",
    passengers: airRequestPassengers(undefined),
    legs: airRequestLegs(undefined),
    costLeg1: "",
    costLeg2: "",
    costLeg3: "",
    costTimesPassengers: "",
    costTotal: "",
    cargoDescription: "",
    largestDimensions: "",
    heaviestItem: "",
    totalWeight: "",
    totalCubicFeet: "",
    specialHandling: "",
    departureContact: emptyAirRequestContact(),
    arrivalContact: emptyAirRequestContact(),
    nonDvPassengers: airRequestPassengers(undefined),
    remarks: "",
    requester: emptyAirRequestSigner(),
    authorizer: emptyAirRequestSigner(),
    seniorPassenger: emptyAirRequestSigner(),
  };
}

export function withAirRequest(value: AirRequest | undefined): AirRequest {
  const base = emptyAirRequest();
  if (!value) return base;
  const priority = value.priority === "1" || value.priority === "2" || value.priority === "3" ? value.priority : "";
  return {
    ...base,
    ...value,
    priority,
    passengers: airRequestPassengers(value.passengers),
    legs: airRequestLegs(value.legs),
    departureContact: { ...emptyAirRequestContact(), ...value.departureContact },
    arrivalContact: { ...emptyAirRequestContact(), ...value.arrivalContact },
    nonDvPassengers: airRequestPassengers(value.nonDvPassengers),
    requester: { ...emptyAirRequestSigner(), ...value.requester },
    authorizer: { ...emptyAirRequestSigner(), ...value.authorizer },
    seniorPassenger: { ...emptyAirRequestSigner(), ...value.seniorPassenger },
  };
}

export function emptyCargoManifest(): CargoManifest {
  return {
    carrier: "",
    acNo: "",
    acModel: "",
    destCode: "",
    airRef: "",
    destination: "",
    missionNo: "",
    missionSu: "",
    missionDate: "",
    alwWt: "",
    alwCu: "",
    manifestSta: "",
    manifestFy: "",
    manifestTy: "",
    manifestNo: "",
    airPageNo: "",
    poe: "",
    dateSailed: "",
    voyageDocumentNo: "",
    pod: "",
    surfaceRef: "",
    vesselName: "",
    status: "",
    sust: "",
    truckNo: "",
    remarks: "",
    surfacePageNo: "",
    rows: [emptyCargoManifestRow()],
    totalPieces: "",
    totalWeight: "",
    totalCube: "",
    loadedDate: "",
    loadingAgent: "",
    receivedDate: "",
    unloadingAgent: "",
    receivingDate: "",
    receivingAgent: "",
  };
}

export function withCargoManifest(value: CargoManifest | undefined): CargoManifest {
  const base = emptyCargoManifest();
  if (!value) return base;
  return {
    ...base,
    ...value,
    rows: value.rows?.length ? value.rows : base.rows,
  };
}

export function emptyPackingListRow(): PackingListRow {
  return {
    id: newId("box"),
    boxNo: "",
    contents: "",
    unitOfIssue: "",
    initial: "",
    spares: "",
    total: "",
  };
}

export function emptyPackingList(): PackingList {
  return {
    page: "",
    pages: "",
    packedBy: "",
    boxCount: "",
    requisitionNo: "",
    orderNo: "",
    endItem: "",
    date: isoToday(),
    rows: [emptyPackingListRow()],
    typedName: "",
    signature: "",
  };
}

export function withPackingList(value: PackingList | undefined): PackingList {
  const base = emptyPackingList();
  if (!value) return base;
  return {
    ...base,
    ...value,
    page: digitsOnly(value.page ?? ""),
    pages: digitsOnly(value.pages ?? ""),
    boxCount: digitsOnly(value.boxCount ?? ""),
    requisitionNo: digitsOnly(value.requisitionNo ?? ""),
    orderNo: digitsOnly(value.orderNo ?? ""),
    rows: (value.rows?.length ? value.rows : base.rows).map((row) => ({
      ...row,
      boxNo: digitsOnly(row.boxNo ?? ""),
      total: packingRowTotal(row.initial ?? "", row.spares ?? ""),
    })),
  };
}

export function createBlankLoadPlan(): AirliftPacket {
  const today = isoToday();
  return {
    id: newId("lp"),
    status: "draft",
    aircraftType: "",
    missionNumber: "",
    missionRouting: "",
    fromStation: "",
    toStation: "",
    aclOffered: "",
    positionsAvailable: "",
    positionsUsed: "",
    departureDate: today,
    departureTime: "",
    configuration: "",
    looseCargoMail: "",
    operatingWeight: 0,
    operatingMoment: 0,
    cargoMailWeight: 0,
    cargoMailMoment: 0,
    zeroFuelWeight: 0,
    zeroFuelMoment: 0,
    percentMac: "",
    centerOfBalanceStation: "",
    plannedBy: "",
    plannedDate: today,
    phaseIIQualified: "",
    loadedBy: "",
    loadedDate: "",
    timeLoadPlanComplete: "",
    timeReceivedByInfoControl: "",
    startAircraftUpload: "",
    completeAircraftUpload: "",
    scaleName: "",
    scaleGrade: "",
    scaleDate: "",
    specialCertifiedBy: "",
    sddgCertifiedBy: "",
    sddgDate: "",
    deployingUnit: "",
    chalk: "",
    mobilityForce: "",
    inspectionDate: today,
    deployingRepName: "",
    inspectorName: "",
    block11: emptyMarks(),
    inspection: emptyInspection(),
    packingList: emptyPackingList(),
    cargoManifest: emptyCargoManifest(),
    palletIdentifier: emptyPalletIdentifier(),
    airRequest: emptyAirRequest(),
    shipmentLabel: emptyShipmentLabel(),
    specialHandling: emptySpecialHandling(),
    c17LoadPlan: emptyAircraftLoadPlan(),
    c130LoadPlan: emptyAircraftLoadPlan(),
    savedTitle: "",
    savedSlug: "",
    savedAt: "",
    rows: [emptyRow()],
    bellyWide: [emptyBellyWide()],
    bellyNarrow: [emptyBellyNarrow()],
    dangerousCargo: emptyDangerousCargo(),
    updatedAt: new Date().toISOString(),
  };
}

export function createSeedLoadPlans(): AirliftPacket[] {
  const row = (
    partial: Pick<LoadSequenceRow, "equipment" | "identification" | "destination" | "grossWeight" | "position"> &
      Partial<LoadSequenceRow>,
  ): LoadSequenceRow => ({
    ...emptyRow(),
    id: partial.identification.toLowerCase(),
    ...partial,
  });

  return [
    {
      ...createBlankLoadPlan(),
      id: "lp-c17-sample",
      aircraftType: "C-17A 08-8190",
      missionNumber: "PVRA7547",
      missionRouting: "KDOV-ETAR",
      fromStation: "KDOV",
      toStation: "ETAR",
      aclOffered: "90000",
      positionsAvailable: "18",
      positionsUsed: "3",
      departureTime: "18:40",
      configuration: "Cargo",
      looseCargoMail: "None",
      operatingWeight: 282000,
      plannedBy: "SSgt A. Nguyen",
      loadedBy: "",
      deployingUnit: "621 CRW",
      chalk: "1",
      dangerousCargo: sampleDangerousCargo(),
      inspection: sampleInspection(),
      rows: [
        row({
          equipment: "463L pallet",
          identification: "PLT-4401",
          destination: "ETAR",
          pieces: 1,
          grossWeight: 4200,
          moment: 2100000,
          position: "1",
          contents: "4 crates, tool kits",
        }),
        row({
          equipment: "463L pallet",
          identification: "PLT-4402",
          destination: "ETAR",
          pieces: 1,
          grossWeight: 1800,
          moment: 1080000,
          position: "2",
          contents: "Paint, 12 cans",
          hazmat: true,
          unNumber: "UN1263",
          shippingName: "Paint",
          hazardClass: "3",
        }),
        row({
          equipment: "M1151 HMMWV",
          identification: "A-12",
          destination: "ETAR",
          pieces: 1,
          grossWeight: 7800,
          moment: 5460000,
          position: "6",
          contents: "Vehicle, basic issue items secured",
          vehicle: true,
          onDash9: false,
        }),
      ],
      updatedAt: "2026-11-13T12:00:00.000Z",
    },
  ];
}

export function withSavedForm(plan: AirliftPacket, title: string, slug: string): AirliftPacket {
  return { ...plan, savedTitle: title, savedSlug: slug, savedAt: new Date().toISOString() };
}

export function formatSavedAt(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export function withLoadPlan(plan: AirliftPacket): AirliftPacket {
  return {
    ...plan,
    bellyWide: plan.bellyWide ?? [],
    bellyNarrow: plan.bellyNarrow ?? [],
    dangerousCargo: withDangerousCargo(plan.dangerousCargo),
    inspection: withInspection(plan.inspection),
    packingList: withPackingList(plan.packingList),
    cargoManifest: withCargoManifest(plan.cargoManifest),
    palletIdentifier: withPalletIdentifier(plan.palletIdentifier),
    airRequest: withAirRequest(plan.airRequest),
    shipmentLabel: withShipmentLabel(plan.shipmentLabel),
    specialHandling: withSpecialHandling(plan.specialHandling),
    c17LoadPlan: withAircraftLoadPlan(plan.c17LoadPlan),
    c130LoadPlan: withAircraftLoadPlan(plan.c130LoadPlan),
    savedTitle: plan.savedTitle ?? "",
    savedSlug: plan.savedSlug ?? "",
    savedAt: plan.savedAt ?? "",
    operatingMoment: plan.operatingMoment ?? 0,
    cargoMailWeight: plan.cargoMailWeight ?? 0,
    cargoMailMoment: plan.cargoMailMoment ?? 0,
    zeroFuelWeight: plan.zeroFuelWeight ?? 0,
    zeroFuelMoment: plan.zeroFuelMoment ?? 0,
    centerOfBalanceStation: plan.centerOfBalanceStation ?? "",
    phaseIIQualified: plan.phaseIIQualified ?? "",
    timeLoadPlanComplete: plan.timeLoadPlanComplete ?? "",
    timeReceivedByInfoControl: plan.timeReceivedByInfoControl ?? "",
    startAircraftUpload: plan.startAircraftUpload ?? "",
    completeAircraftUpload: plan.completeAircraftUpload ?? "",
    updatedAt: new Date().toISOString(),
    rows: (plan.rows ?? []).map((row, index) => ({ ...row, sequence: index + 1 })),
  };
}

export interface BlockReadiness {
  id: keyof Block11Marks;
  title: string;
  ready: boolean;
  detail: string;
}

export function blockReadiness(plan: AirliftPacket): BlockReadiness[] {
  const hazmat = plan.rows.filter((row) => row.hazmat);
  const special = plan.rows.filter((row) => row.specialHandling);
  const vehicles = plan.rows.filter((row) => row.vehicle);
  const weighed = plan.rows.some((row) => row.identification.trim() && row.grossWeight > 0);

  return [
    {
      id: "a",
      title: "11a Pre-load plan",
      ready: Boolean(plan.aircraftType.trim() && plan.missionNumber.trim() && weighed),
      detail: "Aircraft, mission, and at least one weighed item on AF Form 4080.",
    },
    {
      id: "b",
      title: "11b Manifest, load list, packing list",
      ready: Boolean(plan.fromStation.trim() && plan.toStation.trim() && weighed),
      detail: "From and to stations, plus the items carried onto DD Form 1385 and DD Form 1750.",
    },
    {
      id: "c",
      title: "11c Shipper's declaration",
      ready:
        hazmat.length === 0 ||
        (Boolean(plan.sddgCertifiedBy.trim()) &&
          hazmat.every((row) => row.unNumber.trim() && row.shippingName.trim())),
      detail:
        hazmat.length === 0
          ? "No hazardous cargo on this load. Mark not applicable."
          : "UN number, proper shipping name, and a certifier on the shipper's declaration.",
    },
    {
      id: "d",
      title: "11d DD Form 1387-2",
      ready:
        special.length === 0 ||
        (Boolean(plan.specialCertifiedBy.trim()) && special.every((row) => row.specialService.trim())),
      detail:
        special.length === 0
          ? "No signature service or other special service. Mark not applicable."
          : "A service type on each special item, and a certifier.",
    },
    {
      id: "e",
      title: "11e Military shipping label",
      ready: Boolean(
        plan.fromStation.trim() &&
          plan.toStation.trim() &&
          plan.rows.length > 0 &&
          plan.rows.every((row) => row.identification.trim()),
      ),
      detail: "From, to, and an identifier on every piece so DD Form 1387 can be printed.",
    },
    {
      id: "f",
      title: "11f ATTLA certification",
      ready: vehicles.length === 0 || vehicles.every((row) => row.onDash9 || row.attlaReference.trim()),
      detail:
        vehicles.length === 0
          ? "No vehicles or equipment flagged. Mark not applicable."
          : "Each vehicle is either on the Dash 9 or has an ATTLA letter reference.",
    },
  ];
}
