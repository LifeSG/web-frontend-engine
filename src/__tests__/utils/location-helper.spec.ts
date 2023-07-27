import axios from "axios";
import React from "react";
import { OneMapService } from "../../services";
import { LocationHelper } from "../../components/fields/location-field/location-helper";

describe("when reverseGeoCode returns an error", () => {
	let mockError;
	const mockOnError = jest.fn();
	const mockRef: React.MutableRefObject<AbortController | null> = {
		current: null,
	};

	beforeEach(() => {
		jest.resetAllMocks();
		global.abortController = jest.fn();
	});

	it("should call onError function if the error is not a canceled error", async () => {
		mockError = new Error();
		OneMapService.reverseGeocode = jest.fn().mockRejectedValue(mockError);

		try {
			await LocationHelper.fetchLocationList(
				"",
				1.299941797074924,
				103.78940434971592,
				false,
				mockRef,
				mockOnError
			);
		} catch (error) {
			expect(mockOnError).toBeCalled();
		}
		expect.hasAssertions();
	});

	it("should not call onError function if the error is a canceled error", async () => {
		mockError = new axios.CanceledError();
		OneMapService.reverseGeocode = jest.fn().mockRejectedValue(mockError);

		try {
			await LocationHelper.fetchLocationList(
				"",
				1.299941797074924,
				103.78940434971592,
				false,
				mockRef,
				mockOnError
			);
		} catch (error) {
			expect(mockOnError).not.toBeCalled();
		}
		expect.hasAssertions();
	});
});
