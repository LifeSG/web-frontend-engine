import { IResultListItem } from "../..";

export const pagination = <T>(array: T[], pageSize: number, pageNum: number) => {
	return array.slice((pageNum - 1) * pageSize, pageNum * pageSize);
};

export const boldResultsWithQuery = (arr: IResultListItem[], query: string) => {
	const regex = new RegExp(query, "gi");
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
