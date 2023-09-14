import { Button, Icon, Label, TextField, Typography } from "@equinor/eds-core-react";
import { useContext, useEffect, useState } from "react";
import styled from "styled-components";
import NavigationContext from "../../contexts/navigationContext";
import NavigationType from "../../contexts/navigationType";
import { colors } from "../../styles/Colors";
import { formatIndexValue } from "../Modals/SelectIndexToDisplayModal";

interface EditIntervalProps {
  disabled?: boolean;
  overrideStartIndex?: string;
  overrideEndIndex?: string;
}

const EditInterval = (props: EditIntervalProps): React.ReactElement => {
  const { disabled, overrideStartIndex, overrideEndIndex } = props;
  const { dispatchNavigation, navigationState } = useContext(NavigationContext);
  const { selectedLogCurveInfo } = navigationState;
  const { minIndex, maxIndex } = selectedLogCurveInfo ? selectedLogCurveInfo[0] : { minIndex: null, maxIndex: null };

  const [startIndex, setStartIndex] = useState(String(minIndex));
  const [endIndex, setEndIndex] = useState(String(maxIndex));
  const [isEdited, setIsEdited] = useState(false);

  useEffect(() => {
    if (overrideStartIndex) setStartIndex(overrideStartIndex);
    if (overrideEndIndex) setEndIndex(overrideEndIndex);
  }, [overrideStartIndex, overrideEndIndex]);

  const submitEditInterval = () => {
    setIsEdited(false);
    const logCurveInfoWithUpdatedIndex = selectedLogCurveInfo.map((logCurveInfo) => {
      return {
        ...logCurveInfo,
        minIndex: formatIndexValue(startIndex),
        maxIndex: formatIndexValue(endIndex)
      };
    });
    dispatchNavigation({
      type: NavigationType.ShowCurveValues,
      payload: { logCurveInfo: logCurveInfoWithUpdatedIndex }
    });
  };

  return (
    <EditIntervalLayout>
      <Typography
        style={{
          color: `${colors.interactive.primaryResting}`
        }}
        variant="h3"
      >
        Curve Values
      </Typography>
      <StartEndIndex>
        <StyledLabel label="Start Index" />
        <StyledTextField
          disabled={disabled}
          id="startIndex"
          value={startIndex}
          onChange={(e: any) => {
            setStartIndex(e.target.value);
            setIsEdited(true);
          }}
        />
      </StartEndIndex>
      <StartEndIndex>
        <StyledLabel label="End Index" />
        <StyledTextField
          disabled={disabled}
          id="endIndex"
          value={endIndex}
          onChange={(e: any) => {
            setEndIndex(e.target.value);
            setIsEdited(true);
          }}
        />
      </StartEndIndex>
      <StyledButton variant={"ghost"} color={"primary"} onClick={submitEditInterval} disabled={disabled}>
        <Icon size={16} name={isEdited ? "arrowForward" : "sync"} />
      </StyledButton>
    </EditIntervalLayout>
  );
};

const EditIntervalLayout = styled.div`
  display: flex;
  gap: 0.25rem;
  align-items: center;
`;

const StartEndIndex = styled.div`
  display: flex;
`;

const StyledLabel = styled(Label)`
  width: 5rem;
  align-items: center;
  font-style: italic;
`;

const StyledTextField = styled(TextField)`
  div {
    background-color: transparent;
  }
  min-width: 220px;
`;

export const StyledButton = styled(Button)`
  ${(props) =>
    props.disabled
      ? `
      &:hover{
        border:2px solid ${colors.interactive.disabledBorder};
        border-radius: 50%;
      }
      &&{
        border:2px solid ${colors.interactive.disabledBorder};
      }`
      : `
      &:hover{
        border-radius: 50%;
      }
      &&{
        border:2px solid ${colors.interactive.primaryResting};
      }`}
  display:flex;
  height: 2rem;
  width: 2rem;
  min-height: 2rem;
  min-width: 2rem;
  padding: 0;
  border-radius: 50%;
  align-items: center;
  justify-content: center;
`;
export default EditInterval;
