import { IResultListItem } from "../..";

export const pagination = <T>(array: T[], pageSize: number, pageNum: number) => {
	return array.slice((pageNum - 1) * pageSize, pageNum * pageSize);
};

const escapeRegExp = (value: string): string => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

export const boldResultsWithQuery = (arr: IResultListItem[], query: string) => {
	let regex: RegExp;
	try {
		regex = new RegExp(escapeRegExp(query), "gi");
	} catch {
		return arr;
	}
	return arr.map((obj) => {
		const newAddress = (obj.displayAddressText || obj.address).replace(
			regex,
			`<span class="keyword">${query}</span>`
		);
		return {
			...obj,
			displayAddressText: newAddress,
		};
	});
};
