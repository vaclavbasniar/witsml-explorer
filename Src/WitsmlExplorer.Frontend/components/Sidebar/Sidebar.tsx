import { Divider } from "@equinor/eds-core-react";
import { useTheme } from "@material-ui/core";
import { TreeView } from "@material-ui/lab";
import React, { useContext } from "react";
import styled, { CSSProp } from "styled-components";
import { useWellFilter } from "../../contexts/filter";
import NavigationContext from "../../contexts/navigationContext";
import Well from "../../models/well";
import Wellbore from "../../models/wellbore";
import { colors } from "../../styles/Colors";
import Icon from "../../styles/Icons";
import WellProgress from "../WellProgress";
import SearchFilter from "./SearchFilter";
import WellItem from "./WellItem";

const Sidebar = (): React.ReactElement => {
  const { navigationState, dispatchNavigation } = useContext(NavigationContext);
  const { wells, expandedTreeNodes } = navigationState;
  const filteredWells = useWellFilter(
    wells,
    React.useMemo(() => ({ dispatchNavigation }), [])
  );
  const WellListing: CSSProp = { display: "grid", gridTemplateColumns: "1fr 18px", justifyContent: "center", alignContent: "stretch" };
  const isCompactMode = useTheme().props.MuiCheckbox.size === "small";

  return (
    <React.Fragment>
      <SearchFilter />
      <SidebarTreeView>
        <WellProgress>
          {filteredWells && filteredWells.length > 0 && (
            <TreeView
              defaultCollapseIcon={<Icon name="chevronDown" color={colors.interactive.primaryResting} />}
              defaultExpandIcon={<Icon name="chevronRight" color={colors.interactive.primaryResting} />}
              defaultEndIcon={<div style={{ width: 24 }} />}
              expanded={expandedTreeNodes}
            >
              {filteredWells.map((well: Well) => (
                <React.Fragment key={well.uid}>
                  <div style={WellListing}>
                    <WellItem well={well} />
                    <WellIndicator compactMode={isCompactMode} active={well.wellbores.some((wellbore: Wellbore) => wellbore.isActive)} />
                  </div>
                  <Divider style={{ margin: "0px" }} />
                </React.Fragment>
              ))}
            </TreeView>
          )}
        </WellProgress>
      </SidebarTreeView>
    </React.Fragment>
  );
};

const SidebarTreeView = styled.div`
  overflow-y: scroll;
  flex: 1 1 auto;
  height: 70%;
  padding-left: 1em;
  padding-right: 0.3em;
  .MuiTreeItem-root {
    min-width: 0;
    .MuiTreeItem-iconContainer {
      flex: none;
    }
    .MuiTreeItem-label {
      min-width: 0;
      p {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }
  }
`;

export const WellIndicator = styled.div<{ compactMode: boolean; active: boolean }>`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  margin: ${(props) => (props.compactMode ? "0.625rem 0 0 0.5rem" : "1.125rem 0 0 0.5rem")};
  ${(props) => (props.active ? `background-color: ${colors.interactive.successHover};` : `border: 2px solid ${colors.text.staticIconsTertiary};`)}
`;

export default Sidebar;
