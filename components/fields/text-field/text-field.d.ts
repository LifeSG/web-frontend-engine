import { IGenericFieldProps } from "../../frontend-engine";
import { IEmailFieldSchema, INumericFieldSchema, ITextFieldSchema } from "./types";
export declare const TextField: (props: IGenericFieldProps<ITextFieldSchema | IEmailFieldSchema | INumericFieldSchema>) => import("react/jsx-runtime").JSX.Element;
