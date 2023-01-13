import styled from "styled-components";

export const Wrapper = styled.div`
	width: 100%;
	height: 100%;
	overflow: hidden;
`;

export const Canvas = styled.canvas<{ canDraw: boolean }>`
	${({ canDraw }) => canDraw && "cursor: crosshair;"};
`;
