export namespace MathHelper {
	export const degreesToRadians = (degrees: number) => {
		return (Math.PI * degrees) / 180;
	};

	export const radiansToDegrees = (radians: number) => {
		return (radians * 180) / Math.PI;
	};

	export const nauticalMilesToMetres = (nauticalMiles: number) => nauticalMiles * 1852;
}
