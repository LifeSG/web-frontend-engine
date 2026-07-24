import { BoxContainer } from "@lifesg/react-design-system/box-container";
import { Button } from "@lifesg/react-design-system/button";
import { useApplyStyle } from "@lifesg/react-design-system/theme";
import { UneditableSection, UneditableSectionItemProps } from "@lifesg/react-design-system/uneditable-section";
import clsx from "clsx";
import isEmpty from "lodash/isEmpty";
import { useEffect, useRef, useState } from "react";
import useDeepCompareEffect from "use-deep-compare-effect";
import * as Yup from "yup";
import { AxiosApiClient, filterSchemaProps } from "../../../utils";
import { useFieldEvent, useValidationConfig } from "../../../utils/hooks";
import { Wrapper } from "../../elements/wrapper";
import { IGenericCustomElementProps } from "../types";
import {
	IReviewItemDetails,
	IReviewSchemaAccordion,
	IReviewSchemaBox,
	TReviewSchema,
	TReviewSchemaItem,
} from "./types";
import * as styles from "./review.styles";

export const Review = (props: IGenericCustomElementProps<TReviewSchema>) => {
	// =============================================================================
	// CONST, STATE, REF
	// =============================================================================
	const { id, schema } = props;
	const { setFieldValidationConfig, removeFieldValidationConfig } = useValidationConfig();
	const { dispatchFieldEvent } = useFieldEvent();
	const [itemDetailList, setItemDetailList] = useState<IReviewItemDetails[]>([]);
	const boxRef = useRef<HTMLDivElement>(null);
	const rowGap = schema.variant === "box" ? schema.rowGap : undefined;

	useApplyStyle(boxRef, {
		[styles.tokens.box.rowGap]: rowGap,
	});

	// =============================================================================
	// EFFECTS
	// =============================================================================
	useEffect(() => {
		// set validation config so frontend engine's first onChange event can be fired
		dispatchFieldEvent("mount", id);
		setFieldValidationConfig(id, Yup.mixed());
		return () => {
			removeFieldValidationConfig(id);
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useDeepCompareEffect(() => {
		const newItemDetailList = schema.items.map((item: TReviewSchemaItem, i: number): IReviewItemDetails => {
			const { value, mask, unmask, ...otherItemProps } = item;
			const itemId = `item-${i + 1}`;
			const itemValue = typeof value === "string" ? value : <Wrapper>{value}</Wrapper>;
			const itemDetail: IReviewItemDetails = {
				formattedItem: { ...otherItemProps, id: itemId, value: itemValue },
				unmaskFailureCount: 0,
			};
			if ("mask" in item && typeof value === "string") {
				if (mask === "uinfin" || mask === "whole") {
					itemDetail.unmask = unmask;
					itemDetail.formattedItem = {
						...otherItemProps,
						id: itemId,
						value: itemValue,
						maskState: "masked",
						maskRange: mask === "uinfin" ? [1, 4] : [0, value.length],
					};
				}
			}
			return itemDetail;
		});
		setItemDetailList(newItemDetailList);
	}, [schema.items]);

	// =============================================================================
	// EVENT HANDLERS
	// =============================================================================
	const handleUnmask = (itemToUnmask: UneditableSectionItemProps) => {
		setItemDetailList((previousItemDetailList) =>
			previousItemDetailList.map((prevItemDetail) => {
				const newItemDetail = { ...prevItemDetail };

				if (
					newItemDetail.formattedItem.id === itemToUnmask.id &&
					!newItemDetail.unmaskedValue &&
					!isEmpty(newItemDetail.unmask)
				) {
					unmaskItem(newItemDetail.formattedItem.id);
					return {
						...newItemDetail,
						formattedItem: {
							...newItemDetail.formattedItem,
							maskLoadingState: "loading",
						},
					};
				}
				return newItemDetail;
			})
		);
	};

	// =============================================================================
	// HELPER FUNCTIONS
	// =============================================================================
	const generateSection = (sectionSchema: IReviewSchemaBox["topSection"] | IReviewSchemaBox["bottomSection"]) => {
		if (!sectionSchema) return undefined;
		return <Wrapper>{sectionSchema}</Wrapper>;
	};

	const formatItems = (): UneditableSectionItemProps[] =>
		itemDetailList.map(({ formattedItem, unmaskedValue, unmaskFailureCount }) => {
			if (formattedItem.maskState === "unmasked") {
				return { ...formattedItem, value: unmaskedValue || formattedItem.value };
			} else if (unmaskFailureCount >= 3) {
				return {
					...formattedItem,
					alert: { type: "warning", children: "You can still submit form with this error" },
				};
			}
			return formattedItem;
		});

	const unmaskItem = async (itemId: string) => {
		const itemDetails = itemDetailList.find(({ formattedItem }) => formattedItem.id === itemId);
		try {
			const response = await new AxiosApiClient(
				"",
				undefined,
				undefined,
				itemDetails.unmask.withCredentials
			).post(itemDetails.unmask.url, itemDetails.unmask.body, {
				headers: { "Content-Type": "application/json" },
			});
			handleUnmaskSuccess(itemId, response["data"].value);
		} catch (error) {
			handleUnmaskFailure(itemId);
		}
	};

	const handleUnmaskSuccess = (itemId: string, unmaskedValue: string) => {
		setItemDetailList((previousItemDetailList) =>
			previousItemDetailList.map((prevItemDetail): IReviewItemDetails => {
				if (prevItemDetail.formattedItem.id === itemId) {
					return {
						...prevItemDetail,
						unmaskFailureCount: 0,
						unmaskedValue,
						formattedItem: {
							...prevItemDetail.formattedItem,
							maskState: "unmasked",
							maskLoadingState: undefined,
						},
					};
				}
				return prevItemDetail;
			})
		);
	};

	const handleUnmaskFailure = (itemId: string) => {
		setItemDetailList((previousItemDetailList) =>
			previousItemDetailList.map((prevItemDetail): IReviewItemDetails => {
				if (prevItemDetail.formattedItem.id === itemId) {
					return {
						...prevItemDetail,
						unmaskFailureCount: prevItemDetail.unmaskFailureCount + 1,
						formattedItem: {
							...prevItemDetail.formattedItem,
							maskLoadingState: "fail",
						},
					};
				}
				return prevItemDetail;
			})
		);
	};

	// =========================================================================
	// RENDER FUNCTIONS
	// =========================================================================
	const renderAccordion = (schema: IReviewSchemaAccordion) => {
		const {
			commonSchema: { label },
			customSchema: { button, bottomSection, expanded = true, topSection, ...accordionProps },
		} = filterSchemaProps(schema);

		return (
			<BoxContainer
				title={label}
				callToActionComponent={
					button === false ? undefined : (
						<Button styleType="light" type="button" onClick={() => dispatchFieldEvent("edit", id)}>
							{button?.label ?? "Edit"}
						</Button>
					)
				}
				expanded={expanded}
				{...accordionProps}
			>
				<UneditableSection
					background={false}
					className={styles.customUneditableSection}
					id={id}
					items={formatItems()}
					topSection={generateSection(topSection)}
					bottomSection={generateSection(bottomSection)}
					onUnmask={handleUnmask}
					onTryAgain={handleUnmask}
					fullWidth
				/>
			</BoxContainer>
		);
	};

	const renderBox = (schema: IReviewSchemaBox) => {
		const {
			commonSchema: { label },
			customSchema: { description, topSection, bottomSection, rowGap: _rowGap, ...boxProps },
		} = filterSchemaProps(schema);

		return (
			<UneditableSection
				{...boxProps}
				id={id}
				ref={boxRef}
				className={clsx(rowGap && styles.boxUneditableSection)}
				title={label}
				description={description}
				items={formatItems()}
				topSection={generateSection(topSection)}
				bottomSection={generateSection(bottomSection)}
				onUnmask={handleUnmask}
				onTryAgain={handleUnmask}
			/>
		);
	};

	return schema.variant === "accordion" ? renderAccordion(schema) : renderBox(schema);
};
