import { useEffect, useMemo, useRef } from "react";
import { useFormContext, useWatch } from "react-hook-form";
import { setConditionalValidationInProgress } from "../../context-providers/yup/helper";

export const getSourceFieldsForDependent = (
	fieldId: string,
	whenDependencyMap: Record<string, string[]> | undefined
): string[] => {
	if (!whenDependencyMap) {
		return [];
	}

	return Object.entries(whenDependencyMap)
		.filter(([, dependentFieldIds]) => dependentFieldIds.includes(fieldId))
		.map(([sourceFieldId]) => sourceFieldId);
};

export const useWhenRevalidation = (fieldId: string, whenDependencyMap: Record<string, string[]> | undefined): void => {
	const { trigger } = useFormContext();

	const dependencies = useMemo(
		() => getSourceFieldsForDependent(fieldId, whenDependencyMap),
		[fieldId, whenDependencyMap]
	);

	const watchedValues = useWatch({
		name: dependencies,
		disabled: dependencies.length === 0,
	});

	const isMountedRef = useRef(false);

	useEffect(() => {
		if (dependencies.length === 0) {
			return;
		}

		if (!isMountedRef.current) {
			isMountedRef.current = true;
			return;
		}

		const revalidateConditionally = async (): Promise<void> => {
			setConditionalValidationInProgress(true);

			try {
				await trigger(fieldId);
			} finally {
				setConditionalValidationInProgress(false);
			}
		};

		void revalidateConditionally();
	}, [dependencies.length, fieldId, trigger, watchedValues]);
};
