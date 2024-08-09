import { Button } from "@lifesg/react-design-system/button";
import styled from "styled-components";
import * as Yup from "yup";
import { IFieldYupConfig, IYupValidationRule, TYupSchemaType, YupHelper } from "../../../context-providers";
import { Color } from "@lifesg/react-design-system/color";

export interface IValidationComponentProps {
	type: TYupSchemaType;
	rule: IYupValidationRule;
	value: Record<string, any>;
	extraFields?: Record<string, IFieldYupConfig>;
}

export const ValidationComponent = ({ type, rule, value, extraFields }: IValidationComponentProps) => {
	const handleClick = () => {
		try {
			const hardSchema = YupHelper.buildSchema({
				name: { schema: (Yup as any)[type](), validationRules: [rule] },
				...(extraFields || {}),
			});
			hardSchema.validateSync(value);
			alert("Validation passed");
		} catch (e) {
			alert(e.message);
		}
	};

	return (
		<>
			<StyledTable>
				<tbody>
					<tr>
						<th>Rule</th>
						<td>
							<code>{JSON.stringify(rule, null, 2)}</code>
						</td>
					</tr>
					<tr>
						<th>Value</th>
						<td>
							<code>{JSON.stringify(value, null, 2)}</code>
						</td>
					</tr>
				</tbody>
			</StyledTable>
			<Button.Default type="button" onClick={handleClick}>
				Validate
			</Button.Default>
		</>
	);
};

const StyledTable = styled.table`
	width: 100%;
	margin-bottom: 1rem;

	th,
	td {
		padding: 0.3rem;
	}

	tr:not(:last-child) {
		th,
		td {
			border-bottom: solid 1px rgba(0, 0, 0, 0.1);
		}
	}

	// NOTE: interim solution; use syntax highlighting library in the future
	code {
		display: block;
		background: ${Color.Neutral[7]};
		padding: 0.25rem 0.5rem;
		white-space: pre-wrap;
		color: #d0021b;
	}
`;
