export interface IAutoResizeTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
	maxLength?: number;
	resizable?: boolean;
	errorMessage?: string;
}
