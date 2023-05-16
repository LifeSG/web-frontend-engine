const degreesToRadians = (degrees: number) => {
	return (Math.PI * degrees) / 180;
};

const radiansToDegrees = (radians: number) => {
	return (radians * 180) / Math.PI;
};

const nauticalMilesToMetres = (nauticalMiles: number) => nauticalMiles * 1852;

export const MathHelper = {
	degreesToRadians,
	radiansToDegrees,
	nauticalMilesToMetres,
};
