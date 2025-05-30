import { ContentTableRow } from "components/ContentViews/table";
import WellboreReference from "./jobs/wellboreReference";

export default interface SelectableObjectOnWellbore extends ContentTableRow {
  objectType: string;
  logType: string;
  uid: string;
  name: string;
}

export interface MixedObjectsReferences {
  wellboreReference: WellboreReference;
  selectedObjects: SelectableObjectOnWellbore[];
}
