import { useEffect, useRef } from "react";
import { useFormContext, useWatch } from "react-hook-form";
import { IYupValidationRule } from "../../context-providers";

export const getWhenDependencies = (validationRules: IYupValidationRule[] | undefined): string[] => {
	if (!validationRules?.length) return [];

	const deps: string[] = [];

	const extractDeps = (rules: IYupValidationRule[]) => {
		rules.forEach((rule) => {
			if (rule.when && typeof rule.when === "object") {
				Object.entries(rule.when).forEach(([key, condition]) => {
					if (!deps.includes(key)) {
						deps.push(key);
					}

					if (condition.then?.length) {
						extractDeps(condition.then as IYupValidationRule[]);
					}

					if (condition.otherwise?.length) {
						extractDeps(condition.otherwise as IYupValidationRule[]);
					}
				});
			}
		});
	};

	extractDeps(validationRules);
	return deps;
};

export const useWhenRevalidation = (fieldId: string, validationRules: IYupValidationRule[] | undefined): void => {
	const { trigger } = useFormContext();
	const dependencies = getWhenDependencies(validationRules);

	const watchedValues = useWatch({
		name: dependencies,
		disabled: dependencies.length === 0,
	});

	const isMountedRef = useRef(false);

	useEffect(() => {
		if (!isMountedRef.current) {
			isMountedRef.current = true;
			return;
		}

		void trigger(fieldId);
	}, [watchedValues, fieldId, trigger]);
};
